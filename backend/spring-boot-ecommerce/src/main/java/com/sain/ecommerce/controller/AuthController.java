package com.sain.ecommerce.controller;

import com.sain.ecommerce.dto.AuthenticationResponse;
import com.sain.ecommerce.dto.LoginRequest;
import com.sain.ecommerce.dto.RefreshTokenRequest;
import com.sain.ecommerce.dto.RegisterRequest;
import com.sain.ecommerce.exceptions.EcommerceException;
import com.sain.ecommerce.service.AuthService;
import com.sain.ecommerce.service.RefreshTokenService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    //Registers user
    @PostMapping("/signup")
    @ApiOperation(value = "Add new user")
    public ResponseEntity<String> signUp(@Valid @RequestBody RegisterRequest registerRequest){
        try{
            authService.signUp(registerRequest);
        }catch (EcommerceException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>("User Registration Successful", HttpStatus.OK);
    }



    //Verifies the token
    @GetMapping("/accountVerification/{token}")
    @ApiOperation(value = "Verifies account with token",
            notes = "Verifies the token and activates if token is valid.")
    public ResponseEntity<String> verifyAccount(@ApiParam(value = "Token value for verification" , required = true) @PathVariable String token){
        authService.verifyAccount(token);
        return new ResponseEntity<>("Account activated Successfully", HttpStatus.OK);

    }

    //logs user in
    @PostMapping("/login")
    @ApiOperation(value = "Logs the user in",
            notes = "Logins the user if authentication is successful")
    public AuthenticationResponse login(@Valid @RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }

    //refreshes token
    @PostMapping("/refresh/token")
    @ApiOperation(value = "Provides new refresh token",
            notes = "Provides new refresh token if the parameters are valid")
    public AuthenticationResponse refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest){
        return authService.refreshToken(refreshTokenRequest);

    }

    //logs user out
    @PostMapping("/logout")
    @ApiOperation(value = "Logs the user out",
            notes = "Logs the user out and deletes the refresh token")
    public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest){
        refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken());


        return ResponseEntity.status(HttpStatus.OK).body("Refresh Token Deleted Succesfully!!");
    }

}
