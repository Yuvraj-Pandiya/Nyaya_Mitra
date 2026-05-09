package com.nyayamitra.controller;

import com.nyayamitra.dto.LawyerDto;
import com.nyayamitra.service.LawyerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * LawyerController — migrated from Node.js routes/lawyers.js
 *
 * Endpoints preserved:
 *   GET  /api/lawyers                              → filtered lawyer list (city, state, specialization)
 *   GET  /api/lawyers/city/:city                   → lawyers by city
 */
@RestController
@RequestMapping("/api/lawyers")
@RequiredArgsConstructor
@Tag(name = "Lawyers", description = "Pro-bono legal aid directory endpoints")
public class LawyerController {

    private final LawyerService lawyerService;

    /**
     * GET /api/lawyers?city=&state=&specialization=
     * Migrated from: router.get('/', async (req, res) => { Lawyer.find({ proBono: true, ...filters }) })
     */
    @GetMapping
    @Operation(summary = "Search pro-bono lawyers with optional city/state/specialization filters")
    public ResponseEntity<List<LawyerDto>> getLawyers(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String specialization) {
        return ResponseEntity.ok(lawyerService.getLawyers(city, state, specialization));
    }

    /**
     * GET /api/lawyers/city/:city
     * Migrated from: router.get('/city/:city', async (req, res) => { Lawyer.find({ city: /city/i }) })
     */
    @GetMapping("/city/{city}")
    @Operation(summary = "Get all lawyers (including non-pro-bono) in a specific city")
    public ResponseEntity<List<LawyerDto>> getLawyersByCity(@PathVariable String city) {
        return ResponseEntity.ok(lawyerService.getLawyersByCity(city));
    }
}
