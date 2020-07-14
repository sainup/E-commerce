package com.sain.ecommerce.config;

import com.sain.ecommerce.entity.Product;
import com.sain.ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
//
//@Configuration
//public class MyDataRestConfig implements RepositoryRestConfigurer {
//
//    @Override
//    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
//
//        HttpMethod[] theUnsuporrtedActions = {HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE};
//
//        //disable HTTP methods for Products : PUT, POST , DELETE
//        config.getExposureConfiguration()
//                .forDomainType(Product.class)
//                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsuporrtedActions))
//                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsuporrtedActions));
//
//        //disable HTTP methods for ProductCategory : PUT, POST , DELETE
//        config.getExposureConfiguration()
//                .forDomainType(ProductCategory.class)
//                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsuporrtedActions))
//                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsuporrtedActions));
//    }
//}
