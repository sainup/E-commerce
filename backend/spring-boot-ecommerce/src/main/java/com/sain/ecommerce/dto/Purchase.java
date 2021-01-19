package com.sain.ecommerce.dto;

import com.sain.ecommerce.entity.Address;
import com.sain.ecommerce.entity.Customer;
import com.sain.ecommerce.entity.Order;
import com.sain.ecommerce.entity.OrderItem;
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
