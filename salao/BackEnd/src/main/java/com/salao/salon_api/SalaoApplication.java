package com.salao.salon_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
    "com.sasb.salao",
    "com.salao.salon_api"
})
public class SalaoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalaoApplication.class, args);
    }
}