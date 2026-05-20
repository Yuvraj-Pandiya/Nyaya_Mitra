package com.nyayamitra.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Situation entity — migrated from MongoDB Situation schema.
 *
 * MIGRATION DECISION:
 * MongoDB stored nested objects (rights, laws, checklist, steps) as embedded arrays.
 * In PostgreSQL we use @ElementCollection with @Embeddable for simple bilingual text
 * and @OneToMany for richer child entities. This preserves relational integrity.
 *
 * The 'id' field in MongoDB was a business-key string (e.g., "landlord-dispute").
 * We keep this as 'situationId' (unique slug) and use an auto-generated DB primary key.
 */
@Entity
@Table(name = "situations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Situation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    /** Business-key slug matching the Node.js 'id' field (e.g., "landlord-dispute") */
    @Column(name = "situation_id", unique = true, nullable = false)
    private String situationId;

    @Column(nullable = false)
    private String category;

    @Column(name = "icon", columnDefinition = "TEXT")
    private String icon;

    // Bilingual title stored as two columns (flattened from MongoDB nested object)
    @Column(name = "title_en", nullable = false, columnDefinition = "TEXT")
    private String titleEn;

    @Column(name = "title_hi", nullable = false, columnDefinition = "TEXT")
    private String titleHi;

    // Bilingual description
    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_hi", columnDefinition = "TEXT")
    private String descriptionHi;

    /**
     * MIGRATION DECISION: Rights, Laws, Checklist, Steps are stored as child entities
     * (separate tables with foreign keys) instead of embedded documents.
     * This allows indexed querying and avoids PostgreSQL JSON column complexity.
     * CascadeType.ALL + orphanRemoval mirrors MongoDB's embedded document lifecycle.
     */
    @OneToMany(mappedBy = "situation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("id ASC")
    @Builder.Default
    private List<SituationRight> rights = new ArrayList<>();

    @OneToMany(mappedBy = "situation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("id ASC")
    @Builder.Default
    private List<LawSection> laws = new ArrayList<>();

    @OneToMany(mappedBy = "situation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("id ASC")
    @Builder.Default
    private List<ChecklistItem> checklist = new ArrayList<>();

    @OneToMany(mappedBy = "situation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("stepNumber ASC")
    @Builder.Default
    private List<ProcedureStep> steps = new ArrayList<>();

    @Column(name = "template_type")
    @Enumerated(EnumType.STRING)
    private TemplateType templateType;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum TemplateType { rti, complaint, fir, labor, both, none }
}
