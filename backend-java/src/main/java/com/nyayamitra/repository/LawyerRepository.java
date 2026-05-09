package com.nyayamitra.repository;

import com.nyayamitra.entity.Lawyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * LawyerRepository — Spring Data JPA equivalent of:
 * Node.js: Lawyer.find({ proBono: true, city: /city/i, state: /state/i, availableFor: spec })
 */
@Repository
public interface LawyerRepository extends JpaRepository<Lawyer, Long> {

    boolean existsByBarCouncilId(String barCouncilId);

    /** Mirrors: Lawyer.find({ proBono: true }) */
    List<Lawyer> findByProBonoTrue();

    /** Mirrors: Lawyer.find({ city: new RegExp(city, 'i') }) — case-insensitive LIKE */
    List<Lawyer> findByCityIgnoreCaseContaining(String city);

    /** Mirrors: Lawyer.find({ state: new RegExp(state, 'i') }) */
    List<Lawyer> findByStateIgnoreCaseContaining(String state);

    /** Dynamic filter query for the lawyers endpoint GET /api/lawyers?city=&state=&specialization= */
    @Query("""
        SELECT DISTINCT l FROM Lawyer l
        LEFT JOIN l.availableFor af
        WHERE l.proBono = true
        AND (:city IS NULL OR LOWER(l.city) LIKE LOWER(CONCAT('%', :city, '%')))
        AND (:state IS NULL OR LOWER(l.state) LIKE LOWER(CONCAT('%', :state, '%')))
        AND (:specialization IS NULL OR af = :specialization)
        ORDER BY l.rating DESC
        """)
    List<Lawyer> findByFilters(
        @Param("city") String city,
        @Param("state") String state,
        @Param("specialization") String specialization
    );
}
