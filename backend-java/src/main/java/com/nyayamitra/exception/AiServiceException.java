package com.nyayamitra.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/** Thrown when AI service (Gemini) is unavailable — equivalent of 503 in Node.js chat route */
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class AiServiceException extends RuntimeException {
    public AiServiceException(String message) { super(message); }
    public AiServiceException(String message, Throwable cause) { super(message, cause); }
}
