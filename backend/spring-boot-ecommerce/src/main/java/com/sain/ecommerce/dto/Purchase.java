package com.sain.ecommerce.dto;

import com.sain.ecommerce.model.Address;
import com.sain.ecommerce.model.Customer;
import com.sain.ecommerce.model.Order;
import com.sain.ecommerce.model.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;

    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
