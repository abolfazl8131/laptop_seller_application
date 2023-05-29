package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.LapTop;
import com.myapp.repository.LapTopRepository;
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
 * Integration tests for the {@link LapTopResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LapTopResourceIT {

    private static final Integer DEFAULT_CODE = 1;
    private static final Integer UPDATED_CODE = 2;

    private static final String DEFAULT_COMPANY = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY = "BBBBBBBBBB";

    private static final String DEFAULT_MODEL = "AAAAAAAAAA";
    private static final String UPDATED_MODEL = "BBBBBBBBBB";

    private static final String DEFAULT_DATEPUBLISHED = "AAAAAAAAAA";
    private static final String UPDATED_DATEPUBLISHED = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRICE = 1;
    private static final Integer UPDATED_PRICE = 2;

    private static final Integer DEFAULT_HEIGTH = 1;
    private static final Integer UPDATED_HEIGTH = 2;

    private static final Integer DEFAULT_WIDTH = 1;
    private static final Integer UPDATED_WIDTH = 2;

    private static final String DEFAULT_BATTERY = "AAAAAAAAAA";
    private static final String UPDATED_BATTERY = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lap-tops";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LapTopRepository lapTopRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLapTopMockMvc;

    private LapTop lapTop;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LapTop createEntity(EntityManager em) {
        LapTop lapTop = new LapTop()
            .code(DEFAULT_CODE)
            .company(DEFAULT_COMPANY)
            .model(DEFAULT_MODEL)
            .datepublished(DEFAULT_DATEPUBLISHED)
            .price(DEFAULT_PRICE)
            .heigth(DEFAULT_HEIGTH)
            .width(DEFAULT_WIDTH)
            .battery(DEFAULT_BATTERY)
            .description(DEFAULT_DESCRIPTION);
        return lapTop;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LapTop createUpdatedEntity(EntityManager em) {
        LapTop lapTop = new LapTop()
            .code(UPDATED_CODE)
            .company(UPDATED_COMPANY)
            .model(UPDATED_MODEL)
            .datepublished(UPDATED_DATEPUBLISHED)
            .price(UPDATED_PRICE)
            .heigth(UPDATED_HEIGTH)
            .width(UPDATED_WIDTH)
            .battery(UPDATED_BATTERY)
            .description(UPDATED_DESCRIPTION);
        return lapTop;
    }

    @BeforeEach
    public void initTest() {
        lapTop = createEntity(em);
    }

    @Test
    @Transactional
    void createLapTop() throws Exception {
        int databaseSizeBeforeCreate = lapTopRepository.findAll().size();
        // Create the LapTop
        restLapTopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lapTop)))
            .andExpect(status().isCreated());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeCreate + 1);
        LapTop testLapTop = lapTopList.get(lapTopList.size() - 1);
        assertThat(testLapTop.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testLapTop.getCompany()).isEqualTo(DEFAULT_COMPANY);
        assertThat(testLapTop.getModel()).isEqualTo(DEFAULT_MODEL);
        assertThat(testLapTop.getDatepublished()).isEqualTo(DEFAULT_DATEPUBLISHED);
        assertThat(testLapTop.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testLapTop.getHeigth()).isEqualTo(DEFAULT_HEIGTH);
        assertThat(testLapTop.getWidth()).isEqualTo(DEFAULT_WIDTH);
        assertThat(testLapTop.getBattery()).isEqualTo(DEFAULT_BATTERY);
        assertThat(testLapTop.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createLapTopWithExistingId() throws Exception {
        // Create the LapTop with an existing ID
        lapTop.setId(1L);

        int databaseSizeBeforeCreate = lapTopRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLapTopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lapTop)))
            .andExpect(status().isBadRequest());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLapTops() throws Exception {
        // Initialize the database
        lapTopRepository.saveAndFlush(lapTop);

        // Get all the lapTopList
        restLapTopMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lapTop.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].company").value(hasItem(DEFAULT_COMPANY)))
            .andExpect(jsonPath("$.[*].model").value(hasItem(DEFAULT_MODEL)))
            .andExpect(jsonPath("$.[*].datepublished").value(hasItem(DEFAULT_DATEPUBLISHED)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].heigth").value(hasItem(DEFAULT_HEIGTH)))
            .andExpect(jsonPath("$.[*].width").value(hasItem(DEFAULT_WIDTH)))
            .andExpect(jsonPath("$.[*].battery").value(hasItem(DEFAULT_BATTERY)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getLapTop() throws Exception {
        // Initialize the database
        lapTopRepository.saveAndFlush(lapTop);

        // Get the lapTop
        restLapTopMockMvc
            .perform(get(ENTITY_API_URL_ID, lapTop.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lapTop.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.company").value(DEFAULT_COMPANY))
            .andExpect(jsonPath("$.model").value(DEFAULT_MODEL))
            .andExpect(jsonPath("$.datepublished").value(DEFAULT_DATEPUBLISHED))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE))
            .andExpect(jsonPath("$.heigth").value(DEFAULT_HEIGTH))
            .andExpect(jsonPath("$.width").value(DEFAULT_WIDTH))
            .andExpect(jsonPath("$.battery").value(DEFAULT_BATTERY))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingLapTop() throws Exception {
        // Get the lapTop
        restLapTopMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLapTop() throws Exception {
        // Initialize the database
        lapTopRepository.saveAndFlush(lapTop);

        int databaseSizeBeforeUpdate = lapTopRepository.findAll().size();

        // Update the lapTop
        LapTop updatedLapTop = lapTopRepository.findById(lapTop.getId()).get();
        // Disconnect from session so that the updates on updatedLapTop are not directly saved in db
        em.detach(updatedLapTop);
        updatedLapTop
            .code(UPDATED_CODE)
            .company(UPDATED_COMPANY)
            .model(UPDATED_MODEL)
            .datepublished(UPDATED_DATEPUBLISHED)
            .price(UPDATED_PRICE)
            .heigth(UPDATED_HEIGTH)
            .width(UPDATED_WIDTH)
            .battery(UPDATED_BATTERY)
            .description(UPDATED_DESCRIPTION);

        restLapTopMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLapTop.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLapTop))
            )
            .andExpect(status().isOk());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeUpdate);
        LapTop testLapTop = lapTopList.get(lapTopList.size() - 1);
        assertThat(testLapTop.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testLapTop.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testLapTop.getModel()).isEqualTo(UPDATED_MODEL);
        assertThat(testLapTop.getDatepublished()).isEqualTo(UPDATED_DATEPUBLISHED);
        assertThat(testLapTop.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testLapTop.getHeigth()).isEqualTo(UPDATED_HEIGTH);
        assertThat(testLapTop.getWidth()).isEqualTo(UPDATED_WIDTH);
        assertThat(testLapTop.getBattery()).isEqualTo(UPDATED_BATTERY);
        assertThat(testLapTop.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingLapTop() throws Exception {
        int databaseSizeBeforeUpdate = lapTopRepository.findAll().size();
        lapTop.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLapTopMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lapTop.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lapTop))
            )
            .andExpect(status().isBadRequest());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLapTop() throws Exception {
        int databaseSizeBeforeUpdate = lapTopRepository.findAll().size();
        lapTop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLapTopMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lapTop))
            )
            .andExpect(status().isBadRequest());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLapTop() throws Exception {
        int databaseSizeBeforeUpdate = lapTopRepository.findAll().size();
        lapTop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLapTopMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lapTop)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLapTopWithPatch() throws Exception {
        // Initialize the database
        lapTopRepository.saveAndFlush(lapTop);

        int databaseSizeBeforeUpdate = lapTopRepository.findAll().size();

        // Update the lapTop using partial update
        LapTop partialUpdatedLapTop = new LapTop();
        partialUpdatedLapTop.setId(lapTop.getId());

        partialUpdatedLapTop.datepublished(UPDATED_DATEPUBLISHED).battery(UPDATED_BATTERY);

        restLapTopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLapTop.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLapTop))
            )
            .andExpect(status().isOk());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeUpdate);
        LapTop testLapTop = lapTopList.get(lapTopList.size() - 1);
        assertThat(testLapTop.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testLapTop.getCompany()).isEqualTo(DEFAULT_COMPANY);
        assertThat(testLapTop.getModel()).isEqualTo(DEFAULT_MODEL);
        assertThat(testLapTop.getDatepublished()).isEqualTo(UPDATED_DATEPUBLISHED);
        assertThat(testLapTop.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testLapTop.getHeigth()).isEqualTo(DEFAULT_HEIGTH);
        assertThat(testLapTop.getWidth()).isEqualTo(DEFAULT_WIDTH);
        assertThat(testLapTop.getBattery()).isEqualTo(UPDATED_BATTERY);
        assertThat(testLapTop.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateLapTopWithPatch() throws Exception {
        // Initialize the database
        lapTopRepository.saveAndFlush(lapTop);

        int databaseSizeBeforeUpdate = lapTopRepository.findAll().size();

        // Update the lapTop using partial update
        LapTop partialUpdatedLapTop = new LapTop();
        partialUpdatedLapTop.setId(lapTop.getId());

        partialUpdatedLapTop
            .code(UPDATED_CODE)
            .company(UPDATED_COMPANY)
            .model(UPDATED_MODEL)
            .datepublished(UPDATED_DATEPUBLISHED)
            .price(UPDATED_PRICE)
            .heigth(UPDATED_HEIGTH)
            .width(UPDATED_WIDTH)
            .battery(UPDATED_BATTERY)
            .description(UPDATED_DESCRIPTION);

        restLapTopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLapTop.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLapTop))
            )
            .andExpect(status().isOk());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeUpdate);
        LapTop testLapTop = lapTopList.get(lapTopList.size() - 1);
        assertThat(testLapTop.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testLapTop.getCompany()).isEqualTo(UPDATED_COMPANY);
        assertThat(testLapTop.getModel()).isEqualTo(UPDATED_MODEL);
        assertThat(testLapTop.getDatepublished()).isEqualTo(UPDATED_DATEPUBLISHED);
        assertThat(testLapTop.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testLapTop.getHeigth()).isEqualTo(UPDATED_HEIGTH);
        assertThat(testLapTop.getWidth()).isEqualTo(UPDATED_WIDTH);
        assertThat(testLapTop.getBattery()).isEqualTo(UPDATED_BATTERY);
        assertThat(testLapTop.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingLapTop() throws Exception {
        int databaseSizeBeforeUpdate = lapTopRepository.findAll().size();
        lapTop.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLapTopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lapTop.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lapTop))
            )
            .andExpect(status().isBadRequest());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLapTop() throws Exception {
        int databaseSizeBeforeUpdate = lapTopRepository.findAll().size();
        lapTop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLapTopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lapTop))
            )
            .andExpect(status().isBadRequest());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLapTop() throws Exception {
        int databaseSizeBeforeUpdate = lapTopRepository.findAll().size();
        lapTop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLapTopMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(lapTop)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LapTop in the database
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLapTop() throws Exception {
        // Initialize the database
        lapTopRepository.saveAndFlush(lapTop);

        int databaseSizeBeforeDelete = lapTopRepository.findAll().size();

        // Delete the lapTop
        restLapTopMockMvc
            .perform(delete(ENTITY_API_URL_ID, lapTop.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LapTop> lapTopList = lapTopRepository.findAll();
        assertThat(lapTopList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
