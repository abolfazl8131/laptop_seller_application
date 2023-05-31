package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LapTop.
 */
@Entity
@Table(name = "lap_top")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LapTop implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private Integer code;

    @Column(name = "company")
    private String company;

    @Column(name = "model")
    private String model;

    @Column(name = "datepublished")
    private String datepublished;

    @Column(name = "price")
    private Integer price;

    @Column(name = "heigth")
    private Integer heigth;

    @Column(name = "width")
    private Integer width;

    @Column(name = "battery")
    private String battery;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JsonIgnoreProperties(value = { "location", "lapTops" }, allowSetters = true)
    private Seller seller;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LapTop id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCode() {
        return this.code;
    }

    public LapTop code(Integer code) {
        this.setCode(code);
        return this;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getCompany() {
        return this.company;
    }

    public LapTop company(String company) {
        this.setCompany(company);
        return this;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getModel() {
        return this.model;
    }

    public LapTop model(String model) {
        this.setModel(model);
        return this;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getDatepublished() {
        return this.datepublished;
    }

    public LapTop datepublished(String datepublished) {
        this.setDatepublished(datepublished);
        return this;
    }

    public void setDatepublished(String datepublished) {
        this.datepublished = datepublished;
    }

    public Integer getPrice() {
        return this.price;
    }

    public LapTop price(Integer price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getHeigth() {
        return this.heigth;
    }

    public LapTop heigth(Integer heigth) {
        this.setHeigth(heigth);
        return this;
    }

    public void setHeigth(Integer heigth) {
        this.heigth = heigth;
    }

    public Integer getWidth() {
        return this.width;
    }

    public LapTop width(Integer width) {
        this.setWidth(width);
        return this;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public String getBattery() {
        return this.battery;
    }

    public LapTop battery(String battery) {
        this.setBattery(battery);
        return this;
    }

    public void setBattery(String battery) {
        this.battery = battery;
    }

    public String getDescription() {
        return this.description;
    }

    public LapTop description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Seller getSeller() {
        return this.seller;
    }

    public void setSeller(Seller seller) {
        this.seller = seller;
    }

    public LapTop seller(Seller seller) {
        this.setSeller(seller);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LapTop)) {
            return false;
        }
        return id != null && id.equals(((LapTop) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LapTop{" +
            "id=" + getId() +
            ", code=" + getCode() +
            ", company='" + getCompany() + "'" +
            ", model='" + getModel() + "'" +
            ", datepublished='" + getDatepublished() + "'" +
            ", price=" + getPrice() +
            ", heigth=" + getHeigth() +
            ", width=" + getWidth() +
            ", battery='" + getBattery() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
