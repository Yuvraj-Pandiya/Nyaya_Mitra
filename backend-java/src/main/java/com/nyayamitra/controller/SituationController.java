package com.nyayamitra.controller;

import com.nyayamitra.dto.SituationDetailDto;
import com.nyayamitra.dto.SituationSummaryDto;
import com.nyayamitra.service.SituationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * SituationController — migrated from Node.js routes/situations.js
 *
 * Endpoints preserved (zero frontend changes required):
 *   GET  /api/situations       → list of all situations (summary)
 *   GET  /api/situations/:id   → single situation with full detail
 */
@RestController
@RequestMapping("/api/situations")
@RequiredArgsConstructor
@Tag(name = "Situations", description = "Legal situation catalogue endpoints")
public class SituationController {

    private final SituationService situationService;

    /**
     * GET /api/situations
     * Migrated from: router.get('/', async (req, res) => { situations = Situation.find({}, projection) })
     */
    @GetMapping
    @Operation(summary = "Get all situations (summary list)")
    public ResponseEntity<List<SituationSummaryDto>> getAllSituations() {
        return ResponseEntity.ok(situationService.getAllSummaries());
    }

    /**
     * GET /api/situations/:id
     * Migrated from: router.get('/:id', async (req, res) => { situation = Situation.findOne({ id }) })
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get full detail for a situation by slug ID")
    public ResponseEntity<SituationDetailDto> getSituationById(@PathVariable String id) {
        return ResponseEntity.ok(situationService.getById(id));
    }
}
