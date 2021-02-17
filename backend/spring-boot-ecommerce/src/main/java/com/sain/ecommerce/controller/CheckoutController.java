package com.sain.ecommerce.controller;

import com.sain.ecommerce.dto.Purchase;
import com.sain.ecommerce.dto.PurchaseResponse;
import com.sain.ecommerce.service.CheckoutService;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/checkout")
@AllArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;


    //places order
    @PostMapping("/purchase")
    @ApiOperation(value = "Places order")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){


        return checkoutService.placeOrder(purchase);
    }

}
