package com.nyayamitra.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * AI request DTOs — mirrors the Node.js request bodies in ai.js routes.
 * Nested as static inner classes for clean packaging.
 */
public class AiRequestDto {

    /** POST /api/ai/explain-rights — Body: { id, lang } */
    @Data
    public static class ExplainRightsRequest {
        @NotBlank(message = "Situation id is required")
        private String id;
        private String lang = "en";
    }

    /** POST /api/ai/analyze-case — Body: { id, userStory, lang } */
    @Data
    public static class AnalyzeCaseRequest {
        @NotBlank(message = "Situation id is required")
        private String id;

        @NotBlank(message = "User story is required")
        private String userStory;

        private String lang = "en";
    }

    /**
     * POST /api/ai/chat
     * Body: { situationId, messages: [{role, content}], lang }
     */
    @Data
    public static class ChatRequest {
        private String situationId; // optional
        private List<ChatMessageDto> messages;
        private String lang = "en";
    }

    /** POST /api/ai/translate-document — Body: { documentText, lang } */
    @Data
    public static class TranslateDocumentRequest {
        @NotBlank(message = "Document text is required")
        private String documentText;
        private String lang = "en";
    }
}
