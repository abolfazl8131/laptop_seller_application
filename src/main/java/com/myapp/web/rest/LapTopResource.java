package com.myapp.web.rest;

import com.myapp.domain.LapTop;
import com.myapp.repository.LapTopRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.LapTop}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LapTopResource {

    private final Logger log = LoggerFactory.getLogger(LapTopResource.class);

    private static final String ENTITY_NAME = "lapTop";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LapTopRepository lapTopRepository;

    public LapTopResource(LapTopRepository lapTopRepository) {
        this.lapTopRepository = lapTopRepository;
    }

    /**
     * {@code POST  /lap-tops} : Create a new lapTop.
     *
     * @param lapTop the lapTop to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lapTop, or with status {@code 400 (Bad Request)} if the lapTop has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lap-tops")
    public ResponseEntity<LapTop> createLapTop(@RequestBody LapTop lapTop) throws URISyntaxException {
        log.debug("REST request to save LapTop : {}", lapTop);
        if (lapTop.getId() != null) {
            throw new BadRequestAlertException("A new lapTop cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LapTop result = lapTopRepository.save(lapTop);
        return ResponseEntity
            .created(new URI("/api/lap-tops/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lap-tops/:id} : Updates an existing lapTop.
     *
     * @param id the id of the lapTop to save.
     * @param lapTop the lapTop to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lapTop,
     * or with status {@code 400 (Bad Request)} if the lapTop is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lapTop couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lap-tops/{id}")
    public ResponseEntity<LapTop> updateLapTop(@PathVariable(value = "id", required = false) final Long id, @RequestBody LapTop lapTop)
        throws URISyntaxException {
        log.debug("REST request to update LapTop : {}, {}", id, lapTop);
        if (lapTop.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lapTop.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lapTopRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LapTop result = lapTopRepository.save(lapTop);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lapTop.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lap-tops/:id} : Partial updates given fields of an existing lapTop, field will ignore if it is null
     *
     * @param id the id of the lapTop to save.
     * @param lapTop the lapTop to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lapTop,
     * or with status {@code 400 (Bad Request)} if the lapTop is not valid,
     * or with status {@code 404 (Not Found)} if the lapTop is not found,
     * or with status {@code 500 (Internal Server Error)} if the lapTop couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lap-tops/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LapTop> partialUpdateLapTop(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LapTop lapTop
    ) throws URISyntaxException {
        log.debug("REST request to partial update LapTop partially : {}, {}", id, lapTop);
        if (lapTop.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lapTop.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lapTopRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LapTop> result = lapTopRepository
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

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lapTop.getId().toString())
        );
    }

    /**
     * {@code GET  /lap-tops} : get all the lapTops.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lapTops in body.
     */
    @GetMapping("/lap-tops")
    public List<LapTop> getAllLapTops(@RequestParam(required = false) String filter) {
        if ("sell-is-null".equals(filter)) {
            log.debug("REST request to get all LapTops where sell is null");
            return StreamSupport
                .stream(lapTopRepository.findAll().spliterator(), false)
                .filter(lapTop -> lapTop.getSell() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all LapTops");
        return lapTopRepository.findAll();
    }

    /**
     * {@code GET  /lap-tops/:id} : get the "id" lapTop.
     *
     * @param id the id of the lapTop to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lapTop, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lap-tops/{id}")
    public ResponseEntity<LapTop> getLapTop(@PathVariable Long id) {
        log.debug("REST request to get LapTop : {}", id);
        Optional<LapTop> lapTop = lapTopRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(lapTop);
    }

    /**
     * {@code DELETE  /lap-tops/:id} : delete the "id" lapTop.
     *
     * @param id the id of the lapTop to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lap-tops/{id}")
    public ResponseEntity<Void> deleteLapTop(@PathVariable Long id) {
        log.debug("REST request to delete LapTop : {}", id);
        lapTopRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
