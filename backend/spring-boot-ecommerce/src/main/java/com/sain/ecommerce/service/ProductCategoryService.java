package com.sain.ecommerce.service;

import com.sain.ecommerce.dto.ProductCategoryDto;
import com.sain.ecommerce.exceptions.EcommerceException;
import com.sain.ecommerce.mapper.ProductCategoryMapper;
import com.sain.ecommerce.model.ProductCategory;
import com.sain.ecommerce.repository.ProductCategoryRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;
    private  final ProductCategoryMapper productCategoryMapper;


    public List<ProductCategoryDto> getAllCategories(){
        return productCategoryRepository.findAll()
                .stream()
                .map(productCategoryMapper :: mapCategoryToDto)
                .collect(Collectors.toList());

    }

    public ProductCategoryDto addCategory(ProductCategoryDto productCategoryDto) {
        ProductCategory productCategory = productCategoryRepository.save(productCategoryMapper.mapDtoToCategory(productCategoryDto));
        productCategoryDto.setId(productCategory.getId());
        return productCategoryDto;
    }

    public ProductCategoryDto getCategory(Long id) {
        ProductCategory productCategory = productCategoryRepository.findById(id).orElseThrow(()->new EcommerceException("Category not found"));
        return productCategoryMapper.mapCategoryToDto(productCategory) ;
    }

    public ProductCategory updateCategory(Long id, ProductCategoryDto productCategoryDto){
        productCategoryDto.setId(id);
        ProductCategory productCategory = productCategoryRepository.findById(id).orElseThrow(()-> new EcommerceException("Product Not found"));
        log.info("NAME OF CATEGORY =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + productCategoryDto.getCategoryName());
        return productCategoryRepository.save(productCategoryMapper.mapDtoToCategory(productCategoryDto));
    }

    public void deleteCategory(Long id){
        ProductCategory productCategory = productCategoryRepository.findById(id)
                .orElseThrow(()-> new EcommerceException("Couldn't find the Product Category"));

        if(productCategory != null){
            productCategoryRepository.delete(productCategory);
        }

    }
}
