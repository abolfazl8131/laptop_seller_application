package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Sell.
 */
@Entity
@Table(name = "sell")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Sell implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "sell_id")
    private Integer sellId;

    @Column(name = "date")
    private String date;

    @JsonIgnoreProperties(value = { "sell", "seller", "customer" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private LapTop lapTop;

    @ManyToOne
    @JsonIgnoreProperties(value = { "locations", "lapTops", "sells" }, allowSetters = true)
    private Customer customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sell id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSellId() {
        return this.sellId;
    }

    public Sell sellId(Integer sellId) {
        this.setSellId(sellId);
        return this;
    }

    public void setSellId(Integer sellId) {
        this.sellId = sellId;
    }

    public String getDate() {
        return this.date;
    }

    public Sell date(String date) {
        this.setDate(date);
        return this;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public LapTop getLapTop() {
        return this.lapTop;
    }

    public void setLapTop(LapTop lapTop) {
        this.lapTop = lapTop;
    }

    public Sell lapTop(LapTop lapTop) {
        this.setLapTop(lapTop);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Sell customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sell)) {
            return false;
        }
        return id != null && id.equals(((Sell) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sell{" +
            "id=" + getId() +
            ", sellId=" + getSellId() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
