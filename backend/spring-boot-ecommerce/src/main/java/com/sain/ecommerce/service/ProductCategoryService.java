package com.sain.ecommerce.service;

import com.sain.ecommerce.dto.ProductCategoryDto;
import com.sain.ecommerce.exceptions.EcommerceException;
import com.sain.ecommerce.mapper.ProductCategoryMapper;
import com.sain.ecommerce.model.ProductCategory;
import com.sain.ecommerce.repository.ProductCategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;
    private final ProductCategoryMapper productCategoryMapper;


    //retrieves all the categories from database
    @Transactional(readOnly = true)
    public List<ProductCategoryDto> getAllCategories() {
        return productCategoryRepository.findAll()
                .stream()
                .map(productCategoryMapper::mapCategoryToDto)
                .collect(Collectors.toList());
    }

    //adds category and saves to database
    public ProductCategoryDto addCategory(ProductCategoryDto productCategoryDto) {
        ProductCategory productCategory = productCategoryRepository.save(productCategoryMapper.mapDtoToCategory(productCategoryDto));
        productCategoryDto.setId(productCategory.getId());
        return productCategoryDto;
    }

    //retrieves category by id from database if not found throws exception
    @Transactional(readOnly = true)
    public ProductCategoryDto getCategory(Long id) {
        ProductCategory productCategory = productCategoryRepository.findById(id).orElseThrow(() -> new EcommerceException("Category Not found with ID : " + id));
        return productCategoryMapper.mapCategoryToDto(productCategory);
    }

    //updates category by id, if category not found throws exception
    public ProductCategory updateCategory(Long id, ProductCategoryDto productCategoryDto) {
        productCategoryDto.setId(id);
        productCategoryRepository.findById(id).orElseThrow(() -> new EcommerceException("Category Not found with ID : " + id));
        return productCategoryRepository.save(productCategoryMapper.mapDtoToCategory(productCategoryDto));
    }

    //Deletes category by id, if category not found throws exception
    public void deleteCategory(Long id) {
        ProductCategory productCategory = productCategoryRepository.findById(id)
                .orElseThrow(() -> new EcommerceException("Category Not found with ID : " + id));
        if (productCategory != null) {
            productCategoryRepository.delete(productCategory);
        }
    }
}
