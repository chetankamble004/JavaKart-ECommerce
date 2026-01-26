package com.javakart.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7);
            
            try {
                // Simple token validation (for now)
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(secret.getBytes())
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();
                
                String username = claims.getSubject();
                
                // Create simple authentication
                org.springframework.security.core.Authentication authentication = 
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        username, null, List.of(() -> "ROLE_USER")
                    );
                
                org.springframework.security.core.context.SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
                    
            } catch (Exception e) {
                // Token validation failed, continue without authentication
                System.err.println("JWT validation failed: " + e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}