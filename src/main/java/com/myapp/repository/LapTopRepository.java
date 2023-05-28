package com.myapp.repository;

import com.myapp.domain.LapTop;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LapTop entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LapTopRepository extends JpaRepository<LapTop, Long> {}
