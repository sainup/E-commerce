package com.sain.ecommerce.service;

import com.sain.ecommerce.config.AppConfig;
import com.sain.ecommerce.dto.AuthenticationResponse;
import com.sain.ecommerce.dto.LoginRequest;
import com.sain.ecommerce.dto.RefreshTokenRequest;
import com.sain.ecommerce.dto.RegisterRequest;
import com.sain.ecommerce.exceptions.EcommerceException;
import com.sain.ecommerce.model.*;
import com.sain.ecommerce.repository.RoleRepository;
import com.sain.ecommerce.repository.UserRepository;
import com.sain.ecommerce.repository.VerificationRepository;
import com.sain.ecommerce.security.JwtProvider;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    private final RoleRepository roleRepository;
    private final AppConfig appConfig;


    //Registers the users and saves in the database
    public void signUp(RegisterRequest registerRequest) {

        validateRequest(registerRequest);
        User user = createUser(registerRequest);
        String token = generateVerificationToken(user);
        sendVerificationToken(user, token);

    }

    //checks if username or email already exists, throws error if does
    private void validateRequest(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new EcommerceException("Username already exists");
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new EcommerceException("Email already exists");
        }
    }

    //creates new user with the request
    private User createUser(RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        Set<String> strRoles = registerRequest.getRole();
        Set<Role> roles = new HashSet<>();

        checkAndGiveRoles(strRoles, roles);

        user.setRoles(roles);
        user.setCreated(Instant.now());
        user.setEnabled(false);

        userRepository.save(user);
        return user;
    }

    //sets user role as default else assigns the specified role
    private void checkAndGiveRoles(Set<String> strRoles, Set<Role> roles) {
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new EcommerceException("Error: Role is not found"));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new EcommerceException("Error: Role is not found"));
                        roles.add(adminRole);
                        break;

                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new EcommerceException("Error: Role is not found."));
                        roles.add(modRole);
                        break;

                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new EcommerceException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }
    }

    //sends the mail with activation token to the user
    private void sendVerificationToken(User user, String token) {
        mailService.sendMail(new NotificationEmail("Please Activate your Account",
                user.getEmail(), "Thank you for signing up to Our Ecommerce Project, " +
                "Please click on the below url to activate your account : " +
                appConfig.getUrl() + "/api/auth/accountVerification/" + token));
    }

    //generates verification token for the user and saves in the database
    private String generateVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();

        verificationToken.setToken(token);
        verificationToken.setUser(user);

        verificationRepository.save(verificationToken);
        return token;
    }

    //enables the user after successfully verified
    private void fetchUserAndEnable(VerificationToken verificationToken) {
        String username = verificationToken.getUser().getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EcommerceException("User not found with name - " + username));

        user.setEnabled(true);
        userRepository.save(user);
    }

    public void verifyAccount(String token) {
        Optional<VerificationToken> verificationToken = verificationRepository.findByToken(token);
        fetchUserAndEnable(verificationToken.orElseThrow(() -> new EcommerceException("Invalid token")));
    }

    //authenticates the user and generates token
    public AuthenticationResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenService.generateRefreshToken().getToken())
                .expiresAt((LocalDateTime.now().plusMinutes(15L)))
                .username(userDetails.getUsername())
                .roles(roles)
                .build();
    }


    //finds and returns the current logged in user
    public User getCurrentUser() {
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User)
                SecurityContextHolder.getContext()
                        .getAuthentication().getPrincipal();

        return userRepository.findByUsername(principal.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User name not found - " + principal.getUsername()));
    }

    //returns if a user is logged in or not
    public boolean isLoggedIn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return !(authentication instanceof AnonymousAuthenticationToken) && authentication.isAuthenticated();
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {

        refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        String token = jwtProvider.generateTokenWithUserName(refreshTokenRequest.getUsername());
        return AuthenticationResponse.builder()
                .authenticationToken(token)
                .refreshToken(refreshTokenRequest.getRefreshToken())
                .expiresAt((LocalDateTime.now().plusMinutes(20L)))
                .username(refreshTokenRequest.getUsername())
                .build();

    }


}
