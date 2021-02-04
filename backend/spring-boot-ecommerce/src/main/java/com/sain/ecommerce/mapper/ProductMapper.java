package com.sain.ecommerce.mapper;

import com.sain.ecommerce.dto.ProductDto;
import com.sain.ecommerce.model.Product;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {


    @Mapping(source = "name", target = "name")
    ProductDto mapProductToDto(Product product);

    @InheritInverseConfiguration
    Product mapDtoToProduct(ProductDto productDto);
}
