package com.sain.ecommerce.repository;

import com.sain.ecommerce.model.ERole;
import com.sain.ecommerce.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role,Integer> {


    Optional<Role> findByName(ERole name);
}
