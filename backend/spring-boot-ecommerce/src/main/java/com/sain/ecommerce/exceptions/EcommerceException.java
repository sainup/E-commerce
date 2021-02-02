package com.sain.ecommerce.exceptions;

public class EcommerceException extends RuntimeException {

    public EcommerceException(String exMessage, Exception exception){ super(exMessage, exception);}

    public EcommerceException(String exMessage){super(exMessage);}
}
