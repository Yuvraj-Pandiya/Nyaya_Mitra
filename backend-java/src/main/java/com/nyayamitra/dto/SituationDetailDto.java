package com.nyayamitra.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * SituationDetailDto — full situation response.
 * Mirrors the complete MongoDB document returned by GET /api/situations/:id
 * Response structure is identical to the Node.js response so the frontend needs NO changes.
 */
@Data
@Builder
public class SituationDetailDto {
    private String id;
    private String category;
    private String icon;
    private BilingualTextDto title;
    private BilingualTextDto description;
    private List<RightDto> rights;
    private List<LawSectionDto> laws;
    private List<ChecklistItemDto> checklist;
    private List<ProcedureStepDto> steps;
    private String templateType;

    @Data @Builder
    public static class RightDto {
        private BilingualTextDto title;
        private BilingualTextDto description;
    }

    @Data @Builder
    public static class LawSectionDto {
        private String section;
        private String act;
        private BilingualTextDto summary;
        private String fullText;
    }

    @Data @Builder
    public static class ProcedureStepDto {
        private Integer stepNumber;
        private BilingualTextDto title;
        private BilingualTextDto description;
        private BilingualTextDto tip;
    }
}
