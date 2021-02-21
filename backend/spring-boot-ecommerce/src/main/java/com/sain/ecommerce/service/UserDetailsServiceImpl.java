package com.sain.ecommerce.service;

import com.sain.ecommerce.model.User;
import com.sain.ecommerce.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    //finds username and if isEnabled grants authority
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new UsernameNotFoundException("No user " +
                        "found with username : " + username));
        return UserDetailsImpl.build(user);
    }

}
