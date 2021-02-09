package com.sain.ecommerce.mapper;


import com.sain.ecommerce.dto.ProductCategoryDto;
import com.sain.ecommerce.model.ProductCategory;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductCategoryMapper {

    ProductCategoryDto mapCategoryToDto(ProductCategory productCategory);

    @InheritInverseConfiguration
    ProductCategory mapDtoToCategory(ProductCategoryDto productCategoryDto);

}
