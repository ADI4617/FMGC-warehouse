package com.fmgc.warehouse.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Centralized CORS configuration.
 *
 * A single CorsConfigurationSource bean is shared between:
 *   1. Spring Security (wired in SecurityConfig via .cors(c -> c.configurationSource(corsConfigurationSource())))
 *      — handles preflight OPTIONS before the JWT filter runs, so protected endpoints get CORS headers
 *   2. The servlet filter chain as a fallback
 *
 * IMPORTANT: Do NOT register a separate CorsFilter bean alongside this source.
 * Having both Spring Security's CORS support AND a CorsFilter servlet bean causes
 * double-processing and inconsistent header output. Use the source bean only.
 */
@Configuration
public class CorsConfig {

    private static final Logger log = LoggerFactory.getLogger(CorsConfig.class);

    @Value("${cors.origin:http://localhost:3000}")
    private String corsOriginsRaw;

    @PostConstruct
    public void logCorsOrigin() {
        // Safe to log the origin — it is not a secret
        log.info("CORS configured allowed origin(s): {}", corsOriginsRaw);
    }

    /**
     * Build a CorsConfiguration from the CORS_ORIGIN environment variable.
     * Supports a single origin or a comma-separated list.
     * Example: https://fmgc-warehouse-4511psx6t-adi-6e53.vercel.app
     * Example: https://app.example.com,https://staging.example.com
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Parse comma-separated origins (trim whitespace around each)
        List<String> origins = Arrays.stream(corsOriginsRaw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
