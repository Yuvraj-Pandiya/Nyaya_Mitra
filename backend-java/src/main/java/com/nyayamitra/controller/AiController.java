package com.nyayamitra.controller;

import com.nyayamitra.dto.AiRequestDto.*;
import com.nyayamitra.entity.Situation;
import com.nyayamitra.exception.ResourceNotFoundException;
import com.nyayamitra.service.AiService;
import com.nyayamitra.service.SituationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AiController — migrated from Node.js routes/ai.js
 *
 * All 4 endpoints preserved with identical URL + request/response shapes:
 *   POST /api/ai/explain-rights
 *   POST /api/ai/analyze-case
 *   POST /api/ai/chat
 *   POST /api/ai/translate-document
 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI", description = "Gemini-powered legal AI endpoints")
public class AiController {

    private final AiService aiService;
    private final SituationService situationService;

    /**
     * POST /api/ai/explain-rights
     * Body: { "id": "landlord-dispute", "lang": "en" }
     * Migrated from: router.post('/explain-rights', ...)
     */
    @PostMapping("/explain-rights")
    @Operation(summary = "Explain legal rights for a situation using Gemini AI")
    public ResponseEntity<Map<String, Object>> explainRights(
            @Valid @RequestBody ExplainRightsRequest req) {
        Situation situation = getSituationOrThrow(req.getId());
        return ResponseEntity.ok(aiService.explainRights(situation, defaultLang(req.getLang())));
    }

    /**
     * POST /api/ai/analyze-case
     * Body: { "id": "...", "userStory": "...", "lang": "en" }
     * Migrated from: router.post('/analyze-case', ...)
     */
    @PostMapping("/analyze-case")
    @Operation(summary = "Analyze user's legal position for a specific situation")
    public ResponseEntity<Map<String, Object>> analyzeCase(
            @Valid @RequestBody AnalyzeCaseRequest req) {
        Situation situation = getSituationOrThrow(req.getId());
        return ResponseEntity.ok(
            aiService.analyzeCase(situation, req.getUserStory(), defaultLang(req.getLang())));
    }

    /**
     * POST /api/ai/chat
     * Body: { "situationId": "...", "messages": [{role, content}], "lang": "en" }
     * Migrated from: router.post('/chat', ...) — includes validation for empty messages and last-role check.
     */
    @PostMapping("/chat")
    @Operation(summary = "Multi-turn Gemini chat with situation context")
    public ResponseEntity<?> chat(@RequestBody ChatRequest req) {
        // Validation — mirrors Node.js checks
        if (req.getMessages() == null || req.getMessages().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "No messages provided. Please send at least one message."));
        }
        var lastMsg = req.getMessages().get(req.getMessages().size() - 1);
        if (!"user".equals(lastMsg.getRole())) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Last message must be from user."));
        }

        // Situation context is optional — chat works without it (general legal queries)
        Situation situation = new Situation(); // empty entity = general mode
        if (req.getSituationId() != null && !req.getSituationId().isBlank()) {
            Situation found = situationService.getEntityById(req.getSituationId());
            if (found != null) situation = found;
        }

        String reply = aiService.chatWithGemini(situation, req.getMessages(), defaultLang(req.getLang()));
        return ResponseEntity.ok(Map.of(
            "reply", reply,
            "situationId", req.getSituationId() != null ? req.getSituationId() : ""
        ));
    }

    /**
     * POST /api/ai/translate-document
     * Body: { "documentText": "...", "lang": "en" }
     * Migrated from: router.post('/translate-document', ...)
     * Returns: { "translation": "simplified text" }
     */
    @PostMapping("/translate-document")
    @Operation(summary = "Simplify a legal document into plain language")
    public ResponseEntity<?> translateDocument(
            @Valid @RequestBody TranslateDocumentRequest req) {
        String translation = aiService.translateDocument(req.getDocumentText(), defaultLang(req.getLang()));
        return ResponseEntity.ok(Map.of("translation", translation));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Situation getSituationOrThrow(String id) {
        Situation s = situationService.getEntityById(id);
        if (s == null) throw new ResourceNotFoundException("Situation not found");
        return s;
    }

    private String defaultLang(String lang) {
        return (lang != null && !lang.isBlank()) ? lang : "en";
    }
}
