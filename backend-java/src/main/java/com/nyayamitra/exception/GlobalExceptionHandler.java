package com.nyayamitra.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler — centralized error handling.
 * Migrated from: Node.js errorHandler middleware:
 *   const errorHandler = (err, req, res, next) => { res.status(err.status || 500).json({ error: msg }) }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    /** 404 — Resource not found */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND.value()));
    }

    /** 503 — AI/Gemini service failure */
    @ExceptionHandler(AiServiceException.class)
    public ResponseEntity<ErrorResponse> handleAiServiceError(AiServiceException ex) {
        logger.error("AI service error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(new ErrorResponse(
                "AI service temporarily unavailable. Please try again in a moment.",
                HttpStatus.SERVICE_UNAVAILABLE.value()));
    }

    /** 400 — Validation errors (Jakarta @Valid) — replaces express-validator */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            fieldErrors.put(field, error.getDefaultMessage());
        });
        Map<String, Object> response = new HashMap<>();
        response.put("errors", fieldErrors);
        response.put("status", 400);
        return ResponseEntity.badRequest().body(response);
    }

    /** 500 — Catch-all (mirrors Node.js errorHandler's 500 fallback) */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        logger.error("Unhandled exception: ", ex);
        String message = "development".equals(activeProfile)
            ? ex.getMessage()
            : "Internal server error";
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse(message, 500));
    }

    /** Consistent error envelope matching Node.js: { error: "message" } */
    public record ErrorResponse(String error, int status) {}
}
