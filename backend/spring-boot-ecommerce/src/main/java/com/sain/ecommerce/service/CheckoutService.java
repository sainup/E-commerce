package com.sain.ecommerce.service;

import com.sain.ecommerce.dto.Purchase;
import com.sain.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
