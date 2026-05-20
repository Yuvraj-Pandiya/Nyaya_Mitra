package com.nyayamitra.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * SituationSummaryDto — mirrors the Node.js summary projection:
 * Situation.find({}, "id category icon title description templateType")
 * Used by GET /api/situations (list view)
 */
@Data
@Builder
public class SituationSummaryDto {
    private String id;           // situationId slug
    private String category;
    private String icon;
    private BilingualTextDto title;
    private BilingualTextDto description;
    private List<ChecklistItemDto> checklist;
    private String templateType;
}
