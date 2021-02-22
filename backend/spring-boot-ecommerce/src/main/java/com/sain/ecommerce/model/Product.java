package com.sain.ecommerce.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name="product")
@NoArgsConstructor
@ToString
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;



    @NotBlank
    @NotNull
    @Column(name="sku")
    private String sku;

    @NotBlank
    @NotNull
    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Min(value = 0,message = "Value should be higher than 0")
    @Column(name="unit_price")
    @NotNull
    private BigDecimal unitPrice;


    @Column(name="image_url")
    private String imageUrl;

    @Column(name="active")
    private boolean active;


    @Column(name="units_in_stock")
    private int unitsInStock;


    @CreationTimestamp
    @Column(name="date_created")
    private Date dateCreated;

    @UpdateTimestamp
    @Column(name="last_updated")
    private Date lastUpdated;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private  ProductCategory category;





}
