package com.nyayamitra.entity;

import jakarta.persistence.*;
import lombok.*;

/** Migrated from MongoDB 'checklist' embedded array */
@Entity
@Table(name = "checklist_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChecklistItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "checklist_id")
    private String checklistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "situation_db_id", nullable = false)
    private Situation situation;

    @Column(name = "item_en", columnDefinition = "TEXT")
    private String itemEn;

    @Column(name = "item_hi", columnDefinition = "TEXT")
    private String itemHi;

    @Column(nullable = false)
    @Builder.Default
    private boolean required = true;
}
