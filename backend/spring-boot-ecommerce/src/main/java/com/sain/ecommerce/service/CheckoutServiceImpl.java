package com.sain.ecommerce.service;

import com.sain.ecommerce.repository.CustomerRepository;
import com.sain.ecommerce.dto.Purchase;
import com.sain.ecommerce.dto.PurchaseResponse;
import com.sain.ecommerce.model.Customer;
import com.sain.ecommerce.model.Order;
import com.sain.ecommerce.model.OrderItem;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CheckoutServiceImpl implements CheckoutService {

    private final CustomerRepository customerRepository;


    @Override
    public PurchaseResponse placeOrder(Purchase purchase) {


        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(order::add);


        //populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        //save to database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);


    }

    private String generateOrderTrackingNumber() {

        //generate a random UUID number (UUID VERSION-4)

        return UUID.randomUUID().toString();

    }
}
