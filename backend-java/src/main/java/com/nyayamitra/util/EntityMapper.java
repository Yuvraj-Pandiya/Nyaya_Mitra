package com.nyayamitra.util;

import com.nyayamitra.dto.*;
import com.nyayamitra.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * EntityMapper — converts JPA entities → DTOs.
 * Ensures the JSON response shape exactly matches what the Node.js backend returned,
 * so the Next.js frontend requires ZERO changes.
 */
@Component
public class EntityMapper {

    public SituationSummaryDto toSummary(Situation s) {
        return SituationSummaryDto.builder()
            .id(s.getSituationId())
            .category(s.getCategory())
            .icon(s.getIcon())
            .title(new BilingualTextDto(s.getTitleEn(), s.getTitleHi()))
            .description(new BilingualTextDto(s.getDescriptionEn(), s.getDescriptionHi()))
            .checklist(s.getChecklist().stream().map(this::toChecklistDto).toList())
            .templateType(s.getTemplateType() != null ? s.getTemplateType().name() : "none")
            .build();
    }

    public SituationDetailDto toDetail(Situation s) {
        return SituationDetailDto.builder()
            .id(s.getSituationId())
            .category(s.getCategory())
            .icon(s.getIcon())
            .title(new BilingualTextDto(s.getTitleEn(), s.getTitleHi()))
            .description(new BilingualTextDto(s.getDescriptionEn(), s.getDescriptionHi()))
            .rights(s.getRights().stream().map(this::toRightDto).toList())
            .laws(s.getLaws().stream().map(this::toLawDto).toList())
            .checklist(s.getChecklist().stream().map(this::toChecklistDto).toList())
            .steps(s.getSteps().stream().map(this::toStepDto).toList())
            .templateType(s.getTemplateType() != null ? s.getTemplateType().name() : "none")
            .build();
    }

    private SituationDetailDto.RightDto toRightDto(SituationRight r) {
        return SituationDetailDto.RightDto.builder()
            .title(new BilingualTextDto(r.getTitleEn(), r.getTitleHi()))
            .description(new BilingualTextDto(r.getDescriptionEn(), r.getDescriptionHi()))
            .build();
    }

    private SituationDetailDto.LawSectionDto toLawDto(LawSection l) {
        return SituationDetailDto.LawSectionDto.builder()
            .section(l.getSection())
            .act(l.getAct())
            .summary(new BilingualTextDto(l.getSummaryEn(), l.getSummaryHi()))
            .fullText(l.getFullText())
            .build();
    }

    private ChecklistItemDto toChecklistDto(ChecklistItem c) {
        return ChecklistItemDto.builder()
            .id(c.getChecklistId())
            .item(new BilingualTextDto(c.getItemEn(), c.getItemHi()))
            .required(c.isRequired())
            .build();
    }

    private SituationDetailDto.ProcedureStepDto toStepDto(ProcedureStep p) {
        return SituationDetailDto.ProcedureStepDto.builder()
            .stepNumber(p.getStepNumber())
            .title(new BilingualTextDto(p.getTitleEn(), p.getTitleHi()))
            .description(new BilingualTextDto(p.getDescriptionEn(), p.getDescriptionHi()))
            .tip(new BilingualTextDto(p.getTipEn(), p.getTipHi()))
            .build();
    }

    public LawyerDto toLawyerDto(Lawyer l) {
        return LawyerDto.builder()
            .id(l.getId())
            .name(l.getName())
            .specializations(l.getSpecializations())
            .state(l.getState())
            .city(l.getCity())
            .phone(l.getPhone())
            .email(l.getEmail())
            .organization(l.getOrganization())
            .languages(l.getLanguages())
            .proBono(l.isProBono())
            .experience(l.getExperience())
            .barCouncilId(l.getBarCouncilId())
            .availableFor(l.getAvailableFor())
            .rating(l.getRating())
            .locationLink(l.getLocationLink())
            .lat(l.getLat())
            .lng(l.getLng())
            .build();
    }
}
