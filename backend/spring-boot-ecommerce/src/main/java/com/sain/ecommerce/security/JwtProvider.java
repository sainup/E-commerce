package com.sain.ecommerce.security;

import com.sain.ecommerce.exceptions.EcommerceException;
import com.sain.ecommerce.service.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.security.*;
import java.security.cert.CertificateException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import static io.jsonwebtoken.Jwts.parser;

@Service
@Slf4j
public class JwtProvider {

    private KeyStore keyStore;

    @Value("9000000")
    private Long jwtExpirationInMillis;

    //loads keystore from "springblog.jks" file. if not found throws exception
    @PostConstruct
    public void init() {
        try {
            keyStore = KeyStore.getInstance("JKS");
            InputStream resourceAsStream = getClass().getResourceAsStream("/springblog.jks");
            keyStore.load(resourceAsStream, "secret".toCharArray());
        } catch (KeyStoreException | CertificateException | NoSuchAlgorithmException | IOException e) {
            throw new EcommerceException("Exception occured while loading keystore", e);
        }
    }

    //generates token
    public String generateToken(Authentication authentication) {
        UserDetailsImpl principal = (UserDetailsImpl) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject(principal.getUsername())
                .setIssuedAt(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()))
                .signWith(getPrivateKey())
                .setExpiration(Date.from(LocalDateTime.now().plusMinutes(15L).atZone(ZoneId.systemDefault()).toInstant()))
                .compact();
    }

    //generates token with username
    public String generateTokenWithUserName(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()))
                .signWith(getPrivateKey())
                .setExpiration(Date.from(LocalDateTime.now().plusMinutes(15L).atZone(ZoneId.systemDefault()).toInstant()))
                .compact();
    }

    //retrieves private key from keystore
    private PrivateKey getPrivateKey() {
        try {
            return (PrivateKey) keyStore.getKey("springblog", "secret".toCharArray());
        } catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
            throw new EcommerceException("Exception occurred while retrieving private key from keyStore", e);
        }
    }

    //retrieves public key from keystore
    private PublicKey getPublicKey() {
        try {
            return keyStore.getCertificate("springblog").getPublicKey();
        } catch (KeyStoreException e) {
            throw new EcommerceException("Exception occurred while retrieving public key from keyStore", e);
        }
    }

    //validates the token
    public boolean validateToken(String jwt) {
        try{
            parser().setSigningKey(getPublicKey()).parseClaimsJws(jwt);
            return true;
        }catch (MalformedJwtException e){
            log.info("Invalid JWT token : " + e.getMessage());
        }

        return false;
    }

    //retrieves username from Jwt
    public String getUsernameFromJwt(String token) {
        Claims claims = parser()
                .setSigningKey(getPublicKey())
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();

    }

    //returns the expiration time
    public Long getJwtExpirationInMillis() {
        return jwtExpirationInMillis;
    }
}
