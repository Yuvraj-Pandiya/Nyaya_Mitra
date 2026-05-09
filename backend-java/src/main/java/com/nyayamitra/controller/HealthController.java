package com.nyayamitra.controller;

import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * HealthController — migrated from Node.js: app.get('/api/health', (req, res) => res.json({...}))
 */
@RestController
@RequestMapping("/api")
@Hidden
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "ok",
            "service", "NyayaMitra Java Backend",
            "timestamp", Instant.now().toString(),
            "database", "PostgreSQL"
        ));
    }
}
