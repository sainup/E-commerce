package com.sain.ecommerce.controller;

import com.sain.ecommerce.dto.ProductDto;
import com.sain.ecommerce.model.Product;
import com.sain.ecommerce.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public ResponseEntity<List<ProductDto>> getAllProducts(@RequestParam(value = "page", required = false) String page,
                                                         @RequestParam(value = "size", required = false) String size) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.pageProducts(page, size));
    }


    //to add new product
    @PostMapping
    public ResponseEntity<ProductDto> addProduct(@Valid @RequestBody ProductDto productDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.addProduct(productDto));
    }

    //to get a single product by id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(productService.getProduct(id));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
        return  ResponseEntity.status(HttpStatus.OK).body("Successfully deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody ProductDto productDto){
        return ResponseEntity.status(HttpStatus.OK).body(productService.updateProduct(id, productDto));
    }


}
