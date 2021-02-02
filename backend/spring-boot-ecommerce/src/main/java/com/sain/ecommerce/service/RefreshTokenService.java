package com.sain.ecommerce.service;


import com.sain.ecommerce.exceptions.EcommerceException;
import com.sain.ecommerce.model.RefreshToken;
import com.sain.ecommerce.repository.RefreshTokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;


@Service
@AllArgsConstructor
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    //generates refresh token with random UUID and saves to database
    public RefreshToken generateRefreshToken(){
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setCreatedDate(Instant.now());

        return refreshTokenRepository.save(refreshToken);
    }

    //checks if the refresh token exists or not
    public void validateRefreshToken(String token){
       RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
        .orElseThrow(()-> new EcommerceException("Invalid refresh token"));
    }

    //deletes the refresh token
    public void deleteRefreshToken(String token){
        refreshTokenRepository.deleteByToken(token);
    }
}
