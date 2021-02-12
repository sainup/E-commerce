package com.sain.ecommerce.controller;

import com.sain.ecommerce.dto.ProductCategoryDto;
import com.sain.ecommerce.model.ProductCategory;
import com.sain.ecommerce.service.ProductCategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-category")
@AllArgsConstructor
public class ProductCategoryController {

    private ProductCategoryService productCategoryService;


    @GetMapping
    public ResponseEntity<List<ProductCategoryDto>> getAllCategories(){

        return ResponseEntity.status(HttpStatus.OK).body(productCategoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<ProductCategoryDto> addCategory(@RequestBody ProductCategoryDto productCategoryDto){

        return ResponseEntity.status(HttpStatus.CREATED).body(productCategoryService.addCategory(productCategoryDto));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductCategoryDto> getCategory(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(productCategoryService.getCategory(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductCategory> updateCategory(@PathVariable Long id, @RequestBody ProductCategoryDto productCategoryDto){
        return ResponseEntity.status(HttpStatus.OK).body(productCategoryService.updateCategory(id,productCategoryDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id){

        productCategoryService.deleteCategory(id);
        return ResponseEntity.status(HttpStatus.OK).body("Successfully Deleted");


    }

}
