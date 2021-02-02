package com.sain.ecommerce.model;



import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;

import lombok.Setter;

import javax.persistence.*;

import java.util.Set;

@Entity
@Table(name = "product_category")
@Setter
@Getter
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="category_name")
    private String categoryName;

    @JsonIgnore
   @OneToMany(cascade = CascadeType.ALL,mappedBy = "category")
    private Set<Product> products;


}
