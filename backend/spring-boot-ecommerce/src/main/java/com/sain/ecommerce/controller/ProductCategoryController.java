package com.sain.ecommerce.controller;

import com.sain.ecommerce.dto.ProductCategoryDto;
import com.sain.ecommerce.model.ProductCategory;
import com.sain.ecommerce.service.ProductCategoryService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-category")
@AllArgsConstructor
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;


    //Retrieves all the categories
    @GetMapping
    @ApiOperation(value = "Finds all the ProductCategories",
            notes = "Retrieves all the categories")
    public ResponseEntity<List<ProductCategoryDto>> getAllCategories(){
        return ResponseEntity.status(HttpStatus.OK).body(productCategoryService.getAllCategories());
    }

    //Adds new category
    @PostMapping
    @ApiOperation(value = "Adds new ProductCategory")
    public ResponseEntity<ProductCategoryDto> addCategory(@RequestBody ProductCategoryDto productCategoryDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(productCategoryService.addCategory(productCategoryDto));
    }


    //Retrieves category by id
    @GetMapping("/{id}")
    @ApiOperation(value = "Finds ProductCategory by ID",
            notes = "Provides an id to look up specific category from ProductCategory list ")
    public ResponseEntity<ProductCategoryDto> getCategory(@ApiParam(value = "ID value category you want to retrieve") @PathVariable Long id){
        return ResponseEntity.status(HttpStatus.OK).body(productCategoryService.getCategory(id));
    }

    //Updates category by id
    @PutMapping("/{id}")
    @ApiOperation(value = "Updates ProductCategory by ID",
            notes = "Provides an id to update a specific category from ProductCategory list ")
    public ResponseEntity<ProductCategory> updateCategory(@ApiParam(value = "ID value category you want to update") @PathVariable Long id, @RequestBody ProductCategoryDto productCategoryDto){
        return ResponseEntity.status(HttpStatus.OK).body(productCategoryService.updateCategory(id,productCategoryDto));
    }

    //Deletes category by id
    @DeleteMapping("/{id}")
    @ApiOperation(value = "Deletes ProductCategory by ID",
            notes = "Provides an id to delete a specific category from ProductCategory list ")
    public ResponseEntity<String> deleteCategory(@ApiParam(value = "ID value category you want to delete")@PathVariable Long id){

        productCategoryService.deleteCategory(id);
        return ResponseEntity.status(HttpStatus.OK).body("Successfully Deleted");


    }

}
