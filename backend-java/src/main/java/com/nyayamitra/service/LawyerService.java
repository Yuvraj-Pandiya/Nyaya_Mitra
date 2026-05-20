package com.nyayamitra.service;

import com.nyayamitra.dto.LawyerDto;
import com.nyayamitra.repository.LawyerRepository;
import com.nyayamitra.util.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * LawyerService — migrated from Node.js lawyers.js route logic.
 *
 * Node.js filter logic:
 *   let query = { proBono: true };
 *   if (city) query.city = new RegExp(city, 'i');
 *   if (state) query.state = new RegExp(state, 'i');
 *   if (specialization) query.availableFor = specialization;
 *
 * Preserved exactly via JPQL dynamic query in LawyerRepository.findByFilters()
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LawyerService {

    private final LawyerRepository lawyerRepository;
    private final EntityMapper mapper;

    /**
     * GET /api/lawyers?city=&state=&specialization=
     * Mirrors: Lawyer.find({ proBono: true, city: /city/i, state: /state/i, availableFor: spec })
     */
    public List<LawyerDto> getLawyers(String city, String state, String specialization) {
        // Pass nulls for empty strings so JPQL skips those filters
        String cityParam    = StringUtils.hasText(city)           ? city           : null;
        String stateParam   = StringUtils.hasText(state)          ? state          : null;
        String specParam    = StringUtils.hasText(specialization)  ? specialization : null;

        return lawyerRepository.findByFilters(cityParam, stateParam, specParam)
            .stream()
            .map(mapper::toLawyerDto)
            .toList();
    }

    /**
     * GET /api/lawyers/city/:city
     * Mirrors: Lawyer.find({ city: new RegExp(req.params.city, 'i') })
     */
    public List<LawyerDto> getLawyersByCity(String city) {
        return lawyerRepository.findByCityIgnoreCaseContaining(city)
            .stream()
            .map(mapper::toLawyerDto)
            .toList();
    }
}
