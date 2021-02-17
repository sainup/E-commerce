package com.sain.ecommerce.mapper;


import com.sain.ecommerce.dto.ProductCategoryDto;
import com.sain.ecommerce.model.ProductCategory;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductCategoryMapper {

    //Maps the model ProductCategory to DTO ProductCategory
    ProductCategoryDto mapCategoryToDto(ProductCategory productCategory);

    //Maps the DTO ProductCategory to model ProductCategory
    @InheritInverseConfiguration
    ProductCategory mapDtoToCategory(ProductCategoryDto productCategoryDto);

}
