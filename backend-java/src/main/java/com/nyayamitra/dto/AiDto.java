package com.nyayamitra.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/** AI request/response DTOs — mirror the Node.js route body shapes exactly */
public class AiDto {

    /** POST /api/ai/explain-rights body */
    @Data
    public static class ExplainRightsRequest {
        @NotBlank(message = "Situation id is required")
        private String id;
        private String lang = "en";
    }

    /** POST /api/ai/analyze-case body */
    @Data
    public static class AnalyzeCaseRequest {
        @NotBlank(message = "Situation id is required")
        private String id;
        @NotBlank(message = "User story is required")
        private String userStory;
        private String lang = "en";
    }

    /** POST /api/ai/chat body */
    @Data
    public static class ChatRequest {
        private String situationId;          // Optional — context
        private List<ChatMessage> messages;  // [{role, content}]
        private String lang = "en";
    }

    @Data
    public static class ChatMessage {
        private String role;    // "user" | "assistant"
        private String content;
    }

    /** POST /api/ai/translate-document body */
    @Data
    public static class TranslateDocumentRequest {
        @NotBlank(message = "Document text is required")
        private String documentText;
        private String lang = "en";
    }

    /** POST /api/ai/translate-document response */
    @Data
    public static class TranslateDocumentResponse {
        private String translation;
        public TranslateDocumentResponse(String translation) {
            this.translation = translation;
        }
    }

    /** POST /api/ai/chat response */
    @Data
    public static class ChatResponse {
        private String reply;
        private String situationId;
        public ChatResponse(String reply, String situationId) {
            this.reply = reply;
            this.situationId = situationId;
        }
    }
}
