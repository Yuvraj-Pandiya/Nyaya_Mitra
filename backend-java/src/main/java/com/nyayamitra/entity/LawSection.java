package com.nyayamitra.entity;

import jakarta.persistence.*;
import lombok.*;

/** Migrated from MongoDB 'laws' embedded array */
@Entity
@Table(name = "law_sections")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LawSection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "situation_db_id", nullable = false)
    private Situation situation;

    @Column(columnDefinition = "TEXT")
    private String section;

    @Column(columnDefinition = "TEXT")
    private String act;

    @Column(name = "summary_en", columnDefinition = "TEXT")
    private String summaryEn;

    @Column(name = "summary_hi", columnDefinition = "TEXT")
    private String summaryHi;

    @Column(name = "full_text", columnDefinition = "TEXT")
    private String fullText;
}
