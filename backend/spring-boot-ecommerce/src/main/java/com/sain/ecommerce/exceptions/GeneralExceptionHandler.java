package com.sain.ecommerce.exceptions;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


/**
 * * Handle all exceptions and java bean validation errors for all endpoints income data that use the @Valid annotation
 *
 * @author Ehab Qadah
 */
@ControllerAdvice
public class GeneralExceptionHandler extends ResponseEntityExceptionHandler {



    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException exception, HttpHeaders headers,
                                                                  HttpStatus status, WebRequest request) {
        List<String> validationErrors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
        return getExceptionResponseEntity(HttpStatus.BAD_REQUEST, request, validationErrors);
    }

    @ExceptionHandler({EcommerceException.class})
    public ResponseEntity<Object> handleEcommerceException(
            EcommerceException exception, WebRequest request){
            String errors  = exception.getMessage();
            return getExceptionResponseEntity(HttpStatus.NOT_FOUND,request,errors);
    }


    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraintViolation(
            ConstraintViolationException exception, WebRequest request) {
        List<String> validationErrors = exception.getConstraintViolations().stream().
                map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.toList());
        return getExceptionResponseEntity(HttpStatus.BAD_REQUEST, request, validationErrors);
    }

    private ResponseEntity<Object> getExceptionResponseEntity(final HttpStatus status, WebRequest request, List<String> errors) {
        final Map<String, Object> body = new LinkedHashMap<>();
        final String errorsMessage = CollectionUtils.isNotEmpty(errors) ? errors.stream().filter(StringUtils::isNotEmpty).collect(Collectors.joining(",")):status.getReasonPhrase();
        return getObjectResponseEntity(status, request, errorsMessage, body);
    }
    private ResponseEntity<Object> getExceptionResponseEntity(final HttpStatus status, WebRequest request, String errors) {
        final Map<String, Object> body = new LinkedHashMap<>();

        return getObjectResponseEntity(status, request, errors, body);
    }

    private ResponseEntity<Object> getObjectResponseEntity(HttpStatus status, WebRequest request, String errors, Map<String, Object> body) {
        final String path = request.getDescription(false);
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", errors);
        body.put("path", path);
        body.put("message", status.getReasonPhrase());
        return new ResponseEntity<>(body, status);
    }
}
