package com.sain.ecommerce.Controller;


import com.sain.ecommerce.DAO.ProductRepository;
import com.sain.ecommerce.entity.Product;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/")
public class ProductController {

    private ProductRepository productRepository;
    public ProductController(ProductRepository theproductRepository){
        this.productRepository = theproductRepository;
    }





}
