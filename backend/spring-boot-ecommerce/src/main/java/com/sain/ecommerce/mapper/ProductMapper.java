package com.sain.ecommerce.mapper;

import com.sain.ecommerce.dto.ProductDto;
import com.sain.ecommerce.model.Product;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {


    ProductDto mapProductToDto(Product product);

    @InheritInverseConfiguration
    Product mapDtoToProduct(ProductDto productDto);
}
