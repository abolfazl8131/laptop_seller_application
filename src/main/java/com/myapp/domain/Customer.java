package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Customer.
 */
@Entity
@Table(name = "customer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "i_d")
    private Integer iD;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "customer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "seller", "customer" }, allowSetters = true)
    private Set<Location> locations = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sell", "seller", "customer" }, allowSetters = true)
    private Set<LapTop> lapTops = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lapTop", "customer" }, allowSetters = true)
    private Set<Sell> sells = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Customer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getiD() {
        return this.iD;
    }

    public Customer iD(Integer iD) {
        this.setiD(iD);
        return this;
    }

    public void setiD(Integer iD) {
        this.iD = iD;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Customer phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getName() {
        return this.name;
    }

    public Customer name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Location> getLocations() {
        return this.locations;
    }

    public void setLocations(Set<Location> locations) {
        if (this.locations != null) {
            this.locations.forEach(i -> i.setCustomer(null));
        }
        if (locations != null) {
            locations.forEach(i -> i.setCustomer(this));
        }
        this.locations = locations;
    }

    public Customer locations(Set<Location> locations) {
        this.setLocations(locations);
        return this;
    }

    public Customer addLocation(Location location) {
        this.locations.add(location);
        location.setCustomer(this);
        return this;
    }

    public Customer removeLocation(Location location) {
        this.locations.remove(location);
        location.setCustomer(null);
        return this;
    }

    public Set<LapTop> getLapTops() {
        return this.lapTops;
    }

    public void setLapTops(Set<LapTop> lapTops) {
        if (this.lapTops != null) {
            this.lapTops.forEach(i -> i.setCustomer(null));
        }
        if (lapTops != null) {
            lapTops.forEach(i -> i.setCustomer(this));
        }
        this.lapTops = lapTops;
    }

    public Customer lapTops(Set<LapTop> lapTops) {
        this.setLapTops(lapTops);
        return this;
    }

    public Customer addLapTop(LapTop lapTop) {
        this.lapTops.add(lapTop);
        lapTop.setCustomer(this);
        return this;
    }

    public Customer removeLapTop(LapTop lapTop) {
        this.lapTops.remove(lapTop);
        lapTop.setCustomer(null);
        return this;
    }

    public Set<Sell> getSells() {
        return this.sells;
    }

    public void setSells(Set<Sell> sells) {
        if (this.sells != null) {
            this.sells.forEach(i -> i.setCustomer(null));
        }
        if (sells != null) {
            sells.forEach(i -> i.setCustomer(this));
        }
        this.sells = sells;
    }

    public Customer sells(Set<Sell> sells) {
        this.setSells(sells);
        return this;
    }

    public Customer addSell(Sell sell) {
        this.sells.add(sell);
        sell.setCustomer(this);
        return this;
    }

    public Customer removeSell(Sell sell) {
        this.sells.remove(sell);
        sell.setCustomer(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Customer)) {
            return false;
        }
        return id != null && id.equals(((Customer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Customer{" +
            "id=" + getId() +
            ", iD=" + getiD() +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
