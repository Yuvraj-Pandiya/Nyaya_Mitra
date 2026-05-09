package com.nyayamitra.service;

import com.nyayamitra.dto.ChatMessageDto;
import com.nyayamitra.entity.Situation;
import com.nyayamitra.exception.AiServiceException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

/**
 * AiService — migrated from Node.js llmService.js.
 *
 * Replaces: LangChain ChatGoogleGenerativeAI + GoogleGenerativeAI SDK
 * With    : Direct HTTP calls to Gemini 1.5 Flash REST API
 * (No LangChain dependency needed — Spring Boot uses RestTemplate)
 *
 * Functions migrated:
 *   1. explainRights      → POST /api/ai/explain-rights
 *   2. analyzeCase        → POST /api/ai/analyze-case
 *   3. chatWithGemini     → POST /api/ai/chat
 *   4. translateDocument  → POST /api/ai/translate-document
 */
@Service
@RequiredArgsConstructor
public class AiService {

    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // ─── Base URL for Gemini REST API ──────────────────────────────────────────
    private String geminiUrl(String endpoint) {
        return "https://generativelanguage.googleapis.com/v1beta/models/"
            + geminiModel + ":" + endpoint + "?key=" + geminiApiKey;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 1. EXPLAIN RIGHTS
    // Migrated from: explainRights(situation, lang)
    // ══════════════════════════════════════════════════════════════════════════

    private static final String SYSTEM_PROMPT_EXPLAIN = """
        You are NyayaSaathi, a legal literacy assistant for first-generation litigants in India.
        Your job is to explain legal rights in simple, accessible language.
        
        CRITICAL RULES:
        1. ONLY use information from the law sections provided below. Do not add, invent, or
           extrapolate any legal information not present in the provided text.
        2. Never give legal advice. Explain rights and procedures only.
        3. Write at a Class 8 reading level. Use short sentences.
        4. Use empowering language: "You have the right to...", "The law protects you..."
        5. If language is "hi", respond ENTIRELY in Hindi using Devanagari script.
           If language is "en", respond in simple English.
        6. Return ONLY valid JSON matching the schema below. No markdown, no preamble.
        7. Always include the disclaimer in your response.
        
        OUTPUT SCHEMA (return exactly this JSON structure):
        {
          "summary": "one sentence overview of what the law protects",
          "rights": ["right 1", "right 2", "right 3", "right 4"],
          "key_protection": "the single most important protection",
          "what_you_can_do": ["action 1", "action 2", "action 3"],
          "disclaimer": "यह कानूनी जानकारी है, कानूनी सलाह नहीं। / This is legal information, not legal advice."
        }
        """;

    public Map<String, Object> explainRights(Situation situation, String lang) {
        String lawText = situation.getLaws().stream()
            .map(l -> "Act: " + l.getAct() + "\nSection: " + l.getSection()
                + "\nSummary: " + ("hi".equals(lang) ? l.getSummaryHi() : l.getSummaryEn())
                + "\nFull Text: " + (l.getFullText() != null ? l.getFullText() : ""))
            .collect(Collectors.joining("\n\n"));

        String title = "hi".equals(lang) ? situation.getTitleHi() : situation.getTitleEn();
        String userMessage = "Law Sections:\n" + lawText
            + "\n\nLanguage: " + lang
            + "\n\nPlease explain my rights regarding: " + title;

        String rawJson = callGeminiGenerateContent(SYSTEM_PROMPT_EXPLAIN, userMessage);

        try {
            // Strip markdown fences if present (e.g. ```json ... ```)
            rawJson = stripMarkdownFences(rawJson);
            return objectMapper.readValue(rawJson, new TypeReference<>() {});
        } catch (Exception e) {
            logger.error("Failed to parse explainRights JSON response: {}", e.getMessage());
            throw new AiServiceException("AI returned an unreadable response. Please retry.", e);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 2. ANALYZE CASE
    // Migrated from: analyzeCase(situation, userStory, lang)
    // ══════════════════════════════════════════════════════════════════════════

    private static final String CASE_ANALYSIS_SYSTEM = """
        You are NyayaSaathi. Analyze the user's situation and provide guidance.
        
        CRITICAL RULES:
        1. Do not give direct legal advice.
        2. Guide them on whether filing a case is appropriate based on the law.
        3. Suggest if settlement is a better option for small issues.
        4. Mention potential complications if they are in the wrong.
        5. Write in simple language (Class 8 level).
        6. Return ONLY valid JSON.
        
        OUTPUT SCHEMA:
        {
            "analysis": "2-3 sentences explaining the legal standing",
            "should_file": "Yes/No/Maybe and Why",
            "is_wrongdoing_possible": "Warning if the user action might be problematic",
            "settlement_advice": "Should they settle? Why?",
            "charges_possible": "Explain what charges they can potentially file",
            "people_power": "How they can use collective voice or public support",
            "disclaimer": "This is legal information, not legal advice."
        }
        """;

    public Map<String, Object> analyzeCase(Situation situation, String userStory, String lang) {
        String lawText = situation.getLaws().stream()
            .map(l -> "Act: " + l.getAct() + "\nSection: " + l.getSection())
            .collect(Collectors.joining("\n\n"));

        String title = "hi".equals(lang) ? situation.getTitleHi() : situation.getTitleEn();
        String userMessage = "Situation: " + title
            + "\nUser Story: " + userStory
            + "\nApplicable Law:\n" + lawText
            + "\nLanguage: " + lang;

        String rawJson = callGeminiGenerateContent(CASE_ANALYSIS_SYSTEM, userMessage);

        try {
            rawJson = stripMarkdownFences(rawJson);
            return objectMapper.readValue(rawJson, new TypeReference<>() {});
        } catch (Exception e) {
            logger.error("Failed to parse analyzeCase JSON: {}", e.getMessage());
            throw new AiServiceException("AI returned an unreadable response. Please retry.", e);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 3. CHAT WITH GEMINI (multi-turn)
    // Migrated from: chatWithGemini(situation, messages, lang)
    // ══════════════════════════════════════════════════════════════════════════

    public String chatWithGemini(Situation situation, List<ChatMessageDto> messages, String lang) {
        String systemInstruction = buildChatSystemPrompt(situation, lang);
        String lastMessage = messages.get(messages.size() - 1).getContent();

        // Build history (all messages except the last)
        List<Map<String, Object>> history = new ArrayList<>();
        List<ChatMessageDto> historyMessages = messages.subList(0, messages.size() - 1);

        // Gemini requires first history message to be from 'user'
        if (!historyMessages.isEmpty() && "assistant".equals(historyMessages.get(0).getRole())) {
            history.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text",
                    "hi".equals(lang)
                        ? "नमस्ते, मुझे एक कानूनी सवाल पूछना है।"
                        : "Hi, I have a legal query."))
            ));
        }

        for (ChatMessageDto msg : historyMessages) {
            history.add(Map.of(
                "role", "user".equals(msg.getRole()) ? "user" : "model",
                "parts", List.of(Map.of("text", msg.getContent()))
            ));
        }

        return callGeminiChat(systemInstruction, history, lastMessage);
    }

    /**
     * Migrated from: buildChatSystemPrompt(situation, lang) in llmService.js
     * Constructs context-rich system instruction injecting laws, rights, steps, checklist.
     */
    private String buildChatSystemPrompt(Situation situation, String lang) {
        boolean isHindi = "hi".equals(lang);

        String title = situation.getTitleEn() != null
            ? (isHindi ? situation.getTitleHi() : situation.getTitleEn())
            : (isHindi ? "सामान्य कानूनी प्रश्न" : "General Legal Query");

        String laws = situation.getLaws() != null && !situation.getLaws().isEmpty()
            ? situation.getLaws().stream()
                .map(l -> l.getAct() + " - " + l.getSection() + ": "
                    + (isHindi ? l.getSummaryHi() : l.getSummaryEn()))
                .collect(Collectors.joining("\n"))
            : "No specific laws available.";

        String steps = situation.getSteps() != null && !situation.getSteps().isEmpty()
            ? situation.getSteps().stream()
                .map(s -> s.getStepNumber() + ". "
                    + (isHindi ? s.getDescriptionHi() : s.getDescriptionEn()))
                .collect(Collectors.joining("\n"))
            : "No specific steps available.";

        String checklist = situation.getChecklist() != null && !situation.getChecklist().isEmpty()
            ? situation.getChecklist().stream()
                .map(c -> "- " + (isHindi ? c.getItemHi() : c.getItemEn()))
                .collect(Collectors.joining("\n"))
            : "No specific documents listed.";

        String rights = situation.getRights() != null && !situation.getRights().isEmpty()
            ? situation.getRights().stream()
                .map(r -> "• " + (isHindi ? r.getDescriptionHi() : r.getDescriptionEn()))
                .collect(Collectors.joining("\n"))
            : "No specific rights information available.";

        return """
            You are NyayaSaathi (न्यायसाथी), a friendly legal literacy assistant for first-generation litigants in India.
            The user has selected the legal situation: "%s".
            
            YOUR KNOWLEDGE BASE FOR THIS CONVERSATION:
            
            APPLICABLE LAWS:
            %s
            
            YOUR RIGHTS IN THIS SITUATION:
            %s
            
            STEP-BY-STEP PROCEDURE:
            %s
            
            DOCUMENTS YOU NEED:
            %s
            
            STRICT RULES:
            1. ONLY use information from the laws, rights, procedure, and documents above.
            2. NEVER give specific legal advice. Explain rights and available options only.
            3. Speak at Class 8 reading level. Be warm, empathetic, supportive, and clear.
            4. %s
            5. When giving legal guidance, always end with a brief disclaimer.
            6. Keep responses focused and concise — 3-5 sentences unless the user asks for more.
            7. If the user asks something outside your knowledge base, politely say you only have information about %s.
            8. Always be encouraging — remind users that legal aid is their right and free legal help is available.
            """.formatted(
                title, laws, rights, steps, checklist,
                isHindi
                    ? "ALWAYS respond in Hindi using Devanagari script. Do not mix English words unnecessarily."
                    : "Respond in clear, simple English.",
                title
            );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 4. TRANSLATE / SIMPLIFY DOCUMENT
    // Migrated from: translateDocument(documentText, lang)
    // ══════════════════════════════════════════════════════════════════════════

    public String translateDocument(String documentText, String lang) {
        String translationPrompt = """
            You are NyayaSaathi. Your task is to translate and simplify the provided legal document.
            
            CRITICAL RULES:
            1. Translate the document into very simple language understandable by a 12th-grade student.
            2. Maintain the core meaning and all critical details of the document.
            3. If the language is "hi", respond ENTIRELY in Hindi using Devanagari script.
            4. If the language is "en", respond in simple, plain English.
            5. Be supportive and clear.
            6. Return ONLY the simplified text.
            
            USER'S DOCUMENT:
            %s
            
            Language: %s
            """.formatted(documentText, lang);

        return callGeminiGenerateContent(
            "You are a helpful legal expert who simplifies complex documents.",
            translationPrompt
        );
    }

    // ══════════════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS — Gemini REST API calls
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Single-shot content generation (replaces LangChain model.invoke([SystemMessage, HumanMessage]))
     * POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
     */
    @SuppressWarnings("unchecked")
    private String callGeminiGenerateContent(String systemInstruction, String userMessage) {
        Map<String, Object> body = Map.of(
            "system_instruction", Map.of(
                "parts", List.of(Map.of("text", systemInstruction))
            ),
            "contents", List.of(
                Map.of("role", "user",
                       "parts", List.of(Map.of("text", userMessage)))
            ),
            "generationConfig", Map.of(
                "temperature", 0.2,
                "maxOutputTokens", 2048
            )
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                geminiUrl("generateContent"), request, Map.class);

            return extractGeminiText(response.getBody());
        } catch (Exception e) {
            logger.error("Gemini generateContent call failed: {}", e.getMessage());
            throw new AiServiceException("Gemini API error: " + e.getMessage(), e);
        }
    }

    /**
     * Multi-turn chat (replaces geminiModel.startChat({ history }).sendMessage(lastMessage))
     * POST .../generateContent with history in "contents" array
     */
    @SuppressWarnings("unchecked")
    private String callGeminiChat(String systemInstruction,
                                   List<Map<String, Object>> history,
                                   String lastMessage) {
        List<Map<String, Object>> contents = new ArrayList<>(history);
        contents.add(Map.of(
            "role", "user",
            "parts", List.of(Map.of("text", lastMessage))
        ));

        Map<String, Object> body = new HashMap<>();
        body.put("system_instruction", Map.of("parts", List.of(Map.of("text", systemInstruction))));
        body.put("contents", contents);
        body.put("generationConfig", Map.of("temperature", 0.3, "maxOutputTokens", 1024));

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                geminiUrl("generateContent"), request, Map.class);

            return extractGeminiText(response.getBody());
        } catch (Exception e) {
            logger.error("Gemini chat call failed: {}", e.getMessage());
            throw new AiServiceException("Gemini chat error: " + e.getMessage(), e);
        }
    }

    /** Extract text from Gemini response envelope: candidates[0].content.parts[0].text */
    @SuppressWarnings("unchecked")
    private String extractGeminiText(Map<?, ?> responseBody) {
        try {
            List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) responseBody.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            logger.error("Could not parse Gemini response body: {}", responseBody);
            throw new AiServiceException("Unexpected Gemini response format.");
        }
    }

    /** Strip ```json ... ``` markdown fences that Gemini sometimes adds despite instructions */
    private String stripMarkdownFences(String text) {
        if (text == null) return "{}";
        text = text.trim();
        if (text.startsWith("```")) {
            text = text.replaceAll("^```[a-z]*\\n?", "").replaceAll("```$", "").trim();
        }
        return text;
    }
}
