package com.calendarconnect.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This tells Spring Boot: "If a URL asks for /uploads/something.jpg, 
        // look inside the local 'uploads' folder on the computer."
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}