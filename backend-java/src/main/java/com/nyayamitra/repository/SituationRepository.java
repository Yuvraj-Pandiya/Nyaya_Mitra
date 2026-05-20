package com.nyayamitra.repository;

import com.nyayamitra.entity.Situation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * SituationRepository — Spring Data JPA equivalent of:
 * Node.js: Situation.find() and Situation.findOne({ id })
 */
@Repository
public interface SituationRepository extends JpaRepository<Situation, Long> {

    Optional<Situation> findBySituationId(String situationId);

    boolean existsBySituationId(String situationId);

    /** Summary projection — mirrors the Node.js field selection:
     *  Situation.find({}, "id category icon title description templateType") */
    @Query("SELECT s FROM Situation s")
    List<Situation> findAllSummaries();

    List<Situation> findByCategory(String category);
}
