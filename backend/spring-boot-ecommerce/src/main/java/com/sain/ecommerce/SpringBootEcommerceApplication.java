package com.sain.ecommerce;

import com.sain.ecommerce.DAO.ProductRepository;
import com.sain.ecommerce.entity.Product;
import com.sain.ecommerce.entity.ProductCategory;
import org.hibernate.Session;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class SpringBootEcommerceApplication {




	public static void main(String[] args) {
		SpringApplication.run(SpringBootEcommerceApplication.class, args);




	}



}
