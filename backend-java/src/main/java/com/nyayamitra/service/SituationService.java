package com.nyayamitra.service;

import com.nyayamitra.dto.SituationDetailDto;
import com.nyayamitra.dto.SituationSummaryDto;
import com.nyayamitra.entity.Situation;
import com.nyayamitra.exception.ResourceNotFoundException;
import com.nyayamitra.repository.SituationRepository;
import com.nyayamitra.util.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * SituationService — migrated from Node.js situations.js route logic.
 *
 * Node.js seeded data on first request if DB was empty (lazy seeding).
 * Spring Boot uses DataInitializer (ApplicationRunner) for eager seeding at startup.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SituationService {

    private final SituationRepository situationRepository;
    private final EntityMapper mapper;

    /**
     * GET /api/situations — summary list.
     * Mirrors: Situation.find({}, "id category icon title description templateType")
     */
    public List<SituationSummaryDto> getAllSummaries() {
        return situationRepository.findAllSummaries()
            .stream()
            .map(mapper::toSummary)
            .toList();
    }

    /**
     * GET /api/situations/:id — full detail.
     * Mirrors: Situation.findOne({ id: req.params.id })
     */
    public SituationDetailDto getById(String situationId) {
        Situation situation = situationRepository.findBySituationId(situationId)
            .orElseThrow(() -> new ResourceNotFoundException("Situation not found"));
        return mapper.toDetail(situation);
    }

    /** Used internally by AI service to fetch situation context */
    public Situation getEntityById(String situationId) {
        return situationRepository.findBySituationId(situationId).orElse(null);
    }
}
