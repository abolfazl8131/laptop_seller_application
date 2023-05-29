package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LapTopTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LapTop.class);
        LapTop lapTop1 = new LapTop();
        lapTop1.setId(1L);
        LapTop lapTop2 = new LapTop();
        lapTop2.setId(lapTop1.getId());
        assertThat(lapTop1).isEqualTo(lapTop2);
        lapTop2.setId(2L);
        assertThat(lapTop1).isNotEqualTo(lapTop2);
        lapTop1.setId(null);
        assertThat(lapTop1).isNotEqualTo(lapTop2);
    }
}
