package com.sain.ecommerce.exceptions;

//@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class EcommerceException extends RuntimeException {

    public EcommerceException(String exMessage, Exception exception){ super(exMessage, exception);}

    public EcommerceException(String exMessage){super(exMessage);}
}
