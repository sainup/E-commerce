package com.sain.ecommerce.controller;

import com.sain.ecommerce.dto.ProductDto;
import com.sain.ecommerce.model.Product;
import com.sain.ecommerce.service.ProductService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;

    //get the list of products and with pagination if needed
    @GetMapping
    @ApiOperation(value = "Finds all the Products",
    notes = "Retrieves all the products with pagination if needed.")
    public ResponseEntity<List<ProductDto>> getAllProducts(@ApiParam(value ="define which page you want to retrieve" ) @RequestParam(value = "page", required = false) String page,
    @ApiParam(value ="define how many products should be retrieved" )@RequestParam(value = "size", required = false) String size) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.pageProducts(page, size));
    }


    //to add new product
    @PostMapping
    @ApiOperation(value = "Add new Product",
    notes = "Able to add product")
    public ResponseEntity<ProductDto> addProduct(@Valid @RequestBody ProductDto productDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.addProduct(productDto));
    }

    //to get a single product by id
    @GetMapping("/{id}")
    @ApiOperation(value = "Finds Product by id",
    notes = "Provides an id to look up specific product from product list")
    public ResponseEntity<ProductDto> getProduct(@ApiParam(value = "ID value for the product you want to retrieve",required = true) @PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(productService.getProduct(id));
    }


    //deletes product by id
    @DeleteMapping("/{id}")
    @ApiOperation(value = "Deletes Product by id",
            notes = "Provides an id to delete a specific product from product list")
    public ResponseEntity<String> deleteProduct(@ApiParam(value = "ID value for the product you want to delete",required = true) @PathVariable Long id){
        productService.deleteProduct(id);
        return  ResponseEntity.status(HttpStatus.OK).body("Successfully deleted");
    }

    //updates product by id
    @PutMapping("/{id}")
    @ApiOperation(value = "Updates Product by id",
            notes = "Provides an id to update a specific product from product list")
    public ResponseEntity<Product> updateProduct(@ApiParam(value = "ID value for the product you want to update",required = true)@PathVariable Long id, @RequestBody ProductDto productDto){
        return ResponseEntity.status(HttpStatus.OK).body(productService.updateProduct(id, productDto));
    }

    @GetMapping("/search/findByCategoryId")
    public ResponseEntity<List<ProductDto>> getProductByCategory(@RequestParam(value = "id") Long id, Pageable pageable){

        return ResponseEntity.status(HttpStatus.OK).body(productService.getProductByCategory(id,pageable));

    }


}
