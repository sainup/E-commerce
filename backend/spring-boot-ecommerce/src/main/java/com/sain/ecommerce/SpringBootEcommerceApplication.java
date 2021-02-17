package com.sain.ecommerce;

import com.sain.ecommerce.config.SwaggerConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaRepositories
@Import(SwaggerConfig.class)
@EnableAsync
public class SpringBootEcommerceApplication {




	public static void main(String[] args) {
		SpringApplication.run(SpringBootEcommerceApplication.class, args);




	}



}
