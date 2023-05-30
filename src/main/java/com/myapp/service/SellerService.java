package com.myapp.service;

import com.myapp.domain.Seller;
import com.myapp.repository.SellerRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Seller}.
 */
@Service
@Transactional
public class SellerService {

    private final Logger log = LoggerFactory.getLogger(SellerService.class);

    private final SellerRepository sellerRepository;

    public SellerService(SellerRepository sellerRepository) {
        this.sellerRepository = sellerRepository;
    }

    /**
     * Save a seller.
     *
     * @param seller the entity to save.
     * @return the persisted entity.
     */
    public Seller save(Seller seller) {
        log.debug("Request to save Seller : {}", seller);
        return sellerRepository.save(seller);
    }

    /**
     * Update a seller.
     *
     * @param seller the entity to save.
     * @return the persisted entity.
     */
    public Seller update(Seller seller) {
        log.debug("Request to update Seller : {}", seller);
        return sellerRepository.save(seller);
    }

    /**
     * Partially update a seller.
     *
     * @param seller the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Seller> partialUpdate(Seller seller) {
        log.debug("Request to partially update Seller : {}", seller);

        return sellerRepository
            .findById(seller.getId())
            .map(existingSeller -> {
                if (seller.getiD() != null) {
                    existingSeller.setiD(seller.getiD());
                }
                if (seller.getName() != null) {
                    existingSeller.setName(seller.getName());
                }
                if (seller.getPhoneNumber() != null) {
                    existingSeller.setPhoneNumber(seller.getPhoneNumber());
                }

                return existingSeller;
            })
            .map(sellerRepository::save);
    }

    /**
     * Get all the sellers.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Seller> findAll() {
        log.debug("Request to get all Sellers");
        return sellerRepository.findAll();
    }

    /**
     * Get one seller by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Seller> findOne(Long id) {
        log.debug("Request to get Seller : {}", id);
        return sellerRepository.findById(id);
    }

    /**
     * Delete the seller by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Seller : {}", id);
        sellerRepository.deleteById(id);
    }
}
