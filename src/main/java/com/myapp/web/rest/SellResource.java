package com.myapp.web.rest;

import com.myapp.domain.Sell;
import com.myapp.repository.SellRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.Sell}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SellResource {

    private final Logger log = LoggerFactory.getLogger(SellResource.class);

    private final SellRepository sellRepository;

    public SellResource(SellRepository sellRepository) {
        this.sellRepository = sellRepository;
    }

    /**
     * {@code GET  /sells} : get all the sells.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sells in body.
     */
    @GetMapping("/sells")
    public ResponseEntity<List<Sell>> getAllSells(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Sells");
        Page<Sell> page = sellRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /sells/:id} : get the "id" sell.
     *
     * @param id the id of the sell to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sell, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sells/{id}")
    public ResponseEntity<Sell> getSell(@PathVariable Long id) {
        log.debug("REST request to get Sell : {}", id);
        Optional<Sell> sell = sellRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sell);
    }
}
