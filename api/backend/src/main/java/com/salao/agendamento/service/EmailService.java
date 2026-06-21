package com.salao.agendamento.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendCancelationEmail(String to, String clientName, String serviceName, String professionalName, String appointmentDate, String appointmentTime) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Cancelamento de Agendamento");
        message.setText(
                "Olá " + clientName + ",\n\n" +
                "Informamos que o seu agendamento foi cancelado.\n\n" +
                "Detalhes do agendamento cancelado:\n" +
                "Cliente: " + clientName + "\n" +
                "Serviço: " + serviceName + "\n" +
                "Profissional: " + professionalName + "\n" +
                "Data: " + appointmentDate + "\n" +
                "Horário: " + appointmentTime + "\n\n" +
                "Pedimos desculpas pelo inconveniente.\n\n" +
                "Atenciosamente,\n" +
                "Salão de Beleza"
        );
        javaMailSender.send(message);
    }
}
