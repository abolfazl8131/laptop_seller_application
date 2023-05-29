package com.myapp.repository;

import com.myapp.domain.Sell;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Sell entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SellRepository extends JpaRepository<Sell, Long> {}
