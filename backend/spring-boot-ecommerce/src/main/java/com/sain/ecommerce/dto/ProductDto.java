package com.sain.ecommerce.dto;

import com.sain.ecommerce.model.ProductCategory;
import lombok.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ProductDto {

    private Long id;
    @NotBlank
    @NotNull
    private String sku;

    @NotBlank
    @NotNull
    private String name;
    private String description;

    @Min(value = 0,message = "Price cannot be lower than 0")
    @NotNull
    private BigDecimal unitPrice;
    private String imageUrl;
    private boolean active;
    private int unitsInStock;
    private Date dateCreated;
    private Date lastUpdated;
    private ProductCategory category;

}
