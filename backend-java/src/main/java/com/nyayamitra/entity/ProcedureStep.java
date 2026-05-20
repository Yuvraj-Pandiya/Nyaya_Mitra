package com.nyayamitra.entity;

import jakarta.persistence.*;
import lombok.*;

/** Migrated from MongoDB 'steps' embedded array */
@Entity
@Table(name = "procedure_steps")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProcedureStep {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "situation_db_id", nullable = false)
    private Situation situation;

    @Column(name = "step_number")
    private Integer stepNumber;

    @Column(name = "title_en", columnDefinition = "TEXT")
    private String titleEn;

    @Column(name = "title_hi", columnDefinition = "TEXT")
    private String titleHi;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_hi", columnDefinition = "TEXT")
    private String descriptionHi;

    @Column(name = "tip_en", columnDefinition = "TEXT")
    private String tipEn;

    @Column(name = "tip_hi", columnDefinition = "TEXT")
    private String tipHi;
}
