package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Seller.
 */
@Entity
@Table(name = "seller")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Seller implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "i_d")
    private Integer iD;

    @Column(name = "name")
    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @JsonIgnoreProperties(value = { "seller", "customer" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Location location;

    @OneToMany(mappedBy = "seller")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "seller" }, allowSetters = true)
    private Set<LapTop> lapTops = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Seller id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getiD() {
        return this.iD;
    }

    public Seller iD(Integer iD) {
        this.setiD(iD);
        return this;
    }

    public void setiD(Integer iD) {
        this.iD = iD;
    }

    public String getName() {
        return this.name;
    }

    public Seller name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Seller phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Seller location(Location location) {
        this.setLocation(location);
        return this;
    }

    public Set<LapTop> getLapTops() {
        return this.lapTops;
    }

    public void setLapTops(Set<LapTop> lapTops) {
        if (this.lapTops != null) {
            this.lapTops.forEach(i -> i.setSeller(null));
        }
        if (lapTops != null) {
            lapTops.forEach(i -> i.setSeller(this));
        }
        this.lapTops = lapTops;
    }

    public Seller lapTops(Set<LapTop> lapTops) {
        this.setLapTops(lapTops);
        return this;
    }

    public Seller addLapTop(LapTop lapTop) {
        this.lapTops.add(lapTop);
        lapTop.setSeller(this);
        return this;
    }

    public Seller removeLapTop(LapTop lapTop) {
        this.lapTops.remove(lapTop);
        lapTop.setSeller(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Seller)) {
            return false;
        }
        return id != null && id.equals(((Seller) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Seller{" +
            "id=" + getId() +
            ", iD=" + getiD() +
            ", name='" + getName() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            "}";
    }
}
