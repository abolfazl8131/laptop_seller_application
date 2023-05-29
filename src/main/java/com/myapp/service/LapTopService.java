package com.myapp.service;

import com.myapp.domain.LapTop;
import com.myapp.repository.LapTopRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link LapTop}.
 */
@Service
@Transactional
public class LapTopService {

    private final Logger log = LoggerFactory.getLogger(LapTopService.class);

    private final LapTopRepository lapTopRepository;

    public LapTopService(LapTopRepository lapTopRepository) {
        this.lapTopRepository = lapTopRepository;
    }

    /**
     * Save a lapTop.
     *
     * @param lapTop the entity to save.
     * @return the persisted entity.
     */
    public LapTop save(LapTop lapTop) {
        log.debug("Request to save LapTop : {}", lapTop);
        return lapTopRepository.save(lapTop);
    }

    /**
     * Update a lapTop.
     *
     * @param lapTop the entity to save.
     * @return the persisted entity.
     */
    public LapTop update(LapTop lapTop) {
        log.debug("Request to update LapTop : {}", lapTop);
        return lapTopRepository.save(lapTop);
    }

    /**
     * Partially update a lapTop.
     *
     * @param lapTop the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<LapTop> partialUpdate(LapTop lapTop) {
        log.debug("Request to partially update LapTop : {}", lapTop);

        return lapTopRepository
            .findById(lapTop.getId())
            .map(existingLapTop -> {
                if (lapTop.getCode() != null) {
                    existingLapTop.setCode(lapTop.getCode());
                }
                if (lapTop.getCompany() != null) {
                    existingLapTop.setCompany(lapTop.getCompany());
                }
                if (lapTop.getModel() != null) {
                    existingLapTop.setModel(lapTop.getModel());
                }
                if (lapTop.getDatepublished() != null) {
                    existingLapTop.setDatepublished(lapTop.getDatepublished());
                }
                if (lapTop.getPrice() != null) {
                    existingLapTop.setPrice(lapTop.getPrice());
                }
                if (lapTop.getHeigth() != null) {
                    existingLapTop.setHeigth(lapTop.getHeigth());
                }
                if (lapTop.getWidth() != null) {
                    existingLapTop.setWidth(lapTop.getWidth());
                }
                if (lapTop.getBattery() != null) {
                    existingLapTop.setBattery(lapTop.getBattery());
                }
                if (lapTop.getDescription() != null) {
                    existingLapTop.setDescription(lapTop.getDescription());
                }

                return existingLapTop;
            })
            .map(lapTopRepository::save);
    }

    /**
     * Get all the lapTops.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<LapTop> findAll(Pageable pageable) {
        log.debug("Request to get all LapTops");
        return lapTopRepository.findAll(pageable);
    }

    /**
     *  Get all the lapTops where Sell is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<LapTop> findAllWhereSellIsNull() {
        log.debug("Request to get all lapTops where Sell is null");
        return StreamSupport
            .stream(lapTopRepository.findAll().spliterator(), false)
            .filter(lapTop -> lapTop.getSell() == null)
            .collect(Collectors.toList());
    }

    /**
     * Get one lapTop by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<LapTop> findOne(Long id) {
        log.debug("Request to get LapTop : {}", id);
        return lapTopRepository.findById(id);
    }

    /**
     * Delete the lapTop by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete LapTop : {}", id);
        lapTopRepository.deleteById(id);
    }
}
