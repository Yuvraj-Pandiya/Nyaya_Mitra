package com.nyayamitra.entity;

import jakarta.persistence.*;
import lombok.*;

/** Migrated from MongoDB 'rights' embedded array */
@Entity
@Table(name = "situation_rights")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SituationRight {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "situation_db_id", nullable = false)
    private Situation situation;

    @Column(name = "title_en", columnDefinition = "TEXT")
    private String titleEn;

    @Column(name = "title_hi", columnDefinition = "TEXT")
    private String titleHi;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "description_hi", columnDefinition = "TEXT")
    private String descriptionHi;
}
