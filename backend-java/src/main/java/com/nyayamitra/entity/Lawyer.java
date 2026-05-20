package com.nyayamitra.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Lawyer entity — migrated from MongoDB Lawyer schema.
 *
 * MIGRATION DECISIONS:
 * 1. MongoDB stored 'specializations', 'languages', 'availableFor' as String[] arrays.
 *    In PostgreSQL, these become @ElementCollection stored in separate join tables.
 *    This preserves queryability (e.g., filter by specialization).
 * 2. 'barCouncilId' maintains its UNIQUE constraint from MongoDB.
 * 3. 'lat' and 'lng' coordinates are added as proper numeric columns (existed as
 *    optional fields in frontend but not in the original Mongoose schema).
 */
@Entity
@Table(name = "lawyers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lawyer {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    /** MIGRATION: String[] → @ElementCollection in join table 'lawyer_specializations' */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "lawyer_specializations", joinColumns = @JoinColumn(name = "lawyer_id"))
    @Column(name = "specialization")
    @Builder.Default
    private List<String> specializations = new ArrayList<>();

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String organization;

    /** MIGRATION: String[] → @ElementCollection */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "lawyer_languages", joinColumns = @JoinColumn(name = "lawyer_id"))
    @Column(name = "language")
    @Builder.Default
    private List<String> languages = new ArrayList<>();

    @Column(name = "pro_bono", nullable = false)
    @Builder.Default
    private boolean proBono = true;

    private Integer experience;

    @Column(name = "bar_council_id", unique = true, nullable = false)
    private String barCouncilId;

    /** MIGRATION: String[] → @ElementCollection (equivalent of 'availableFor' in MongoDB) */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "lawyer_available_for", joinColumns = @JoinColumn(name = "lawyer_id"))
    @Column(name = "available_for")
    @Builder.Default
    private List<String> availableFor = new ArrayList<>();

    @Builder.Default
    private Double rating = 5.0;

    @Column(name = "location_link", columnDefinition = "TEXT")
    private String locationLink;

    /** Added from frontend Lawyer type — coordinates for map display */
    private Double lat;
    private Double lng;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
