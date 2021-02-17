package com.sain.ecommerce.service;

import com.sain.ecommerce.dto.ProductDto;
import com.sain.ecommerce.exceptions.EcommerceException;
import com.sain.ecommerce.mapper.ProductMapper;
import com.sain.ecommerce.model.Product;
import com.sain.ecommerce.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    //gets all the product and paginates if parameters are not null
    @Transactional(readOnly = true)
    public List<ProductDto> pageProducts(String page, String size) {

        if (page == null || size == null || page.isEmpty() || size.isEmpty()) {
            return productRepository.findAll()
                    .stream()
                    .map(productMapper::mapProductToDto)
                    .collect(Collectors.toList());
        } else {
            Pageable numberOfPage = PageRequest.of(Integer.parseInt(page), Integer.parseInt(size));
            return productRepository.findAll(numberOfPage)
                    .stream()
                    .map(productMapper::mapProductToDto)
                    .collect(Collectors.toList());
        }
    }

    //save the product to database
    public ProductDto addProduct(ProductDto productDto) {
        Product product = productRepository.save(productMapper.mapDtoToProduct(productDto));
        productDto.setId(product.getId());
        return productDto;
    }

    //gets product by id and throws exception if not found
    @Transactional(readOnly = true)
    public ProductDto getProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new EcommerceException("Product with id : " + id + " not found!"));
        return productMapper.mapProductToDto(product);
    }

    //deletes product by id and throws exception if the product is not found
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(()-> new EcommerceException("Product with id : " + id + " not found!"));
        productRepository.delete(product);
    }

    //updates product by id and throws exception if the product is not found
    public Product updateProduct(Long id, ProductDto productDto){

        productDto.setId(id);
        productRepository.findById(id);
        return productRepository.save(productMapper.mapDtoToProduct(productDto));

    }
}
