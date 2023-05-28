package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Sell;
import com.myapp.repository.SellRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SellResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SellResourceIT {

    private static final Integer DEFAULT_SELL_ID = 1;
    private static final Integer UPDATED_SELL_ID = 2;

    private static final String DEFAULT_DATE = "AAAAAAAAAA";
    private static final String UPDATED_DATE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sells";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SellRepository sellRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSellMockMvc;

    private Sell sell;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sell createEntity(EntityManager em) {
        Sell sell = new Sell().sellId(DEFAULT_SELL_ID).date(DEFAULT_DATE);
        return sell;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sell createUpdatedEntity(EntityManager em) {
        Sell sell = new Sell().sellId(UPDATED_SELL_ID).date(UPDATED_DATE);
        return sell;
    }

    @BeforeEach
    public void initTest() {
        sell = createEntity(em);
    }

    @Test
    @Transactional
    void createSell() throws Exception {
        int databaseSizeBeforeCreate = sellRepository.findAll().size();
        // Create the Sell
        restSellMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sell)))
            .andExpect(status().isCreated());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeCreate + 1);
        Sell testSell = sellList.get(sellList.size() - 1);
        assertThat(testSell.getSellId()).isEqualTo(DEFAULT_SELL_ID);
        assertThat(testSell.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createSellWithExistingId() throws Exception {
        // Create the Sell with an existing ID
        sell.setId(1L);

        int databaseSizeBeforeCreate = sellRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSellMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sell)))
            .andExpect(status().isBadRequest());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSells() throws Exception {
        // Initialize the database
        sellRepository.saveAndFlush(sell);

        // Get all the sellList
        restSellMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sell.getId().intValue())))
            .andExpect(jsonPath("$.[*].sellId").value(hasItem(DEFAULT_SELL_ID)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getSell() throws Exception {
        // Initialize the database
        sellRepository.saveAndFlush(sell);

        // Get the sell
        restSellMockMvc
            .perform(get(ENTITY_API_URL_ID, sell.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sell.getId().intValue()))
            .andExpect(jsonPath("$.sellId").value(DEFAULT_SELL_ID))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE));
    }

    @Test
    @Transactional
    void getNonExistingSell() throws Exception {
        // Get the sell
        restSellMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSell() throws Exception {
        // Initialize the database
        sellRepository.saveAndFlush(sell);

        int databaseSizeBeforeUpdate = sellRepository.findAll().size();

        // Update the sell
        Sell updatedSell = sellRepository.findById(sell.getId()).get();
        // Disconnect from session so that the updates on updatedSell are not directly saved in db
        em.detach(updatedSell);
        updatedSell.sellId(UPDATED_SELL_ID).date(UPDATED_DATE);

        restSellMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSell.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSell))
            )
            .andExpect(status().isOk());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeUpdate);
        Sell testSell = sellList.get(sellList.size() - 1);
        assertThat(testSell.getSellId()).isEqualTo(UPDATED_SELL_ID);
        assertThat(testSell.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSell() throws Exception {
        int databaseSizeBeforeUpdate = sellRepository.findAll().size();
        sell.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSellMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sell.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sell))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSell() throws Exception {
        int databaseSizeBeforeUpdate = sellRepository.findAll().size();
        sell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sell))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSell() throws Exception {
        int databaseSizeBeforeUpdate = sellRepository.findAll().size();
        sell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sell)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSellWithPatch() throws Exception {
        // Initialize the database
        sellRepository.saveAndFlush(sell);

        int databaseSizeBeforeUpdate = sellRepository.findAll().size();

        // Update the sell using partial update
        Sell partialUpdatedSell = new Sell();
        partialUpdatedSell.setId(sell.getId());

        restSellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSell.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSell))
            )
            .andExpect(status().isOk());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeUpdate);
        Sell testSell = sellList.get(sellList.size() - 1);
        assertThat(testSell.getSellId()).isEqualTo(DEFAULT_SELL_ID);
        assertThat(testSell.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSellWithPatch() throws Exception {
        // Initialize the database
        sellRepository.saveAndFlush(sell);

        int databaseSizeBeforeUpdate = sellRepository.findAll().size();

        // Update the sell using partial update
        Sell partialUpdatedSell = new Sell();
        partialUpdatedSell.setId(sell.getId());

        partialUpdatedSell.sellId(UPDATED_SELL_ID).date(UPDATED_DATE);

        restSellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSell.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSell))
            )
            .andExpect(status().isOk());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeUpdate);
        Sell testSell = sellList.get(sellList.size() - 1);
        assertThat(testSell.getSellId()).isEqualTo(UPDATED_SELL_ID);
        assertThat(testSell.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSell() throws Exception {
        int databaseSizeBeforeUpdate = sellRepository.findAll().size();
        sell.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sell.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sell))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSell() throws Exception {
        int databaseSizeBeforeUpdate = sellRepository.findAll().size();
        sell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sell))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSell() throws Exception {
        int databaseSizeBeforeUpdate = sellRepository.findAll().size();
        sell.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSellMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sell)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sell in the database
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSell() throws Exception {
        // Initialize the database
        sellRepository.saveAndFlush(sell);

        int databaseSizeBeforeDelete = sellRepository.findAll().size();

        // Delete the sell
        restSellMockMvc
            .perform(delete(ENTITY_API_URL_ID, sell.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sell> sellList = sellRepository.findAll();
        assertThat(sellList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
