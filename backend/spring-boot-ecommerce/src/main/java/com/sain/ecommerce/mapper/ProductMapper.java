package com.sain.ecommerce.mapper;

import com.sain.ecommerce.dto.ProductDto;
import com.sain.ecommerce.model.Product;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    //Maps model Product to DTO Product
    ProductDto mapProductToDto(Product product);

    //Maps DTO Product to model Product
    @InheritInverseConfiguration
    Product mapDtoToProduct(ProductDto productDto);
}
