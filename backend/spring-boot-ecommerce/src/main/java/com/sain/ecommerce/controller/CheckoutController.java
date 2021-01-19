package com.sain.ecommerce.controller;

import com.sain.ecommerce.dto.Purchase;
import com.sain.ecommerce.dto.PurchaseResponse;
import com.sain.ecommerce.service.CheckoutService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/checkout")
@AllArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return  purchaseResponse;
    }

}
