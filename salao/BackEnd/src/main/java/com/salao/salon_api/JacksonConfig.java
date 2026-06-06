package com.salao.salon_api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfig {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Bean
    public ObjectMapper objectMapper() {
        JavaTimeModule module = new JavaTimeModule();
        module.addSerializer(LocalDate.class, new LocalDateSerializer(FORMATTER));
        module.addDeserializer(LocalDate.class, new LocalDateDeserializer(FORMATTER));

        return new ObjectMapper()
                .registerModule(module)
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }
}
