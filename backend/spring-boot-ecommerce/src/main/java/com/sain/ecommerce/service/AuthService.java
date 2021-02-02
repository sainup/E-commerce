package com.sain.ecommerce.service;

import com.sain.ecommerce.dto.AuthenticationResponse;
import com.sain.ecommerce.dto.LoginRequest;
import com.sain.ecommerce.dto.RefreshTokenRequest;
import com.sain.ecommerce.dto.RegisterRequest;
import com.sain.ecommerce.exceptions.EcommerceException;
import com.sain.ecommerce.model.NotificationEmail;
import com.sain.ecommerce.model.User;
import com.sain.ecommerce.model.VerificationToken;
import com.sain.ecommerce.repository.UserRepository;
import com.sain.ecommerce.repository.VerificationRepository;
import com.sain.ecommerce.security.JwtProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;


    //Registers the users and saves in the database
    public void signUp(RegisterRequest registerRequest){
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setCreated(Instant.now());
        user.setEnabled(false);

        userRepository.save(user);


        String token = generateVerificationToken(user);

        //sends the mail with activation token to the user
        mailService.sendMail(new NotificationEmail("Please Activate your Account",
                user.getEmail(),"Thank you for signing up to Our Ecommerce Project, " +
                "Please click on the below url to activate your account : " +
                "http://localhost:8080/api/auth/accountVerification/"+token));

    }

    //generates verification token for the user and saves in the database
    private String generateVerificationToken(User user){
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();

        verificationToken.setToken(token);
        verificationToken.setUser(user);

        verificationRepository.save(verificationToken);
        return token;
    }

    //enables the user after successfully verified
    private void fetchUserAndEnable(VerificationToken verificationToken){
        String username = verificationToken.getUser().getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new EcommerceException("User not found with name - " + username));

        user.setEnabled(true);
        userRepository.save(user);
    }

    public void verifyAccount(String token){
        Optional<VerificationToken> verificationToken = verificationRepository.findByToken(token);
        fetchUserAndEnable(verificationToken.orElseThrow(()-> new EcommerceException("Invalid token")));
    }

    //authenticates the user and generates token
    public AuthenticationResponse login(LoginRequest loginRequest){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);

        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(loginRequest.getUsername())
                .build();
    }


    //finds and returns the current logged in user
    public User getCurrentUser(){
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        return userRepository.findByUsername(principal.getUsername())
                .orElseThrow(()-> new UsernameNotFoundException("User name not found - " + principal.getUsername()));
    }

    //returns if a user is logged in or not
    public boolean isLoggedIn(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) && authentication.isAuthenticated();
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest){

        refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        String token = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenRequest.getRefreshToken())
                .expiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()))
                .username(refreshTokenRequest.getUsername())
                .build();

    }



}
