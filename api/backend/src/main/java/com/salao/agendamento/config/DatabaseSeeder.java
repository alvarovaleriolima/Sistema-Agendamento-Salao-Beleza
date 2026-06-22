package com.salao.agendamento.config;

import com.salao.agendamento.entity.Funcionario;
import com.salao.agendamento.enums.PerfilFuncionario;
import com.salao.agendamento.enums.Status;
import com.salao.agendamento.repository.FuncionarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(FuncionarioRepository funcionarioRepository) {
        return args -> {
            // Cria um administrador padrão se o banco estiver vazio
            if (funcionarioRepository.count() == 0) {
                Funcionario admin = new Funcionario();
                admin.setNomeCompleto("Administrador do Sistema");
                admin.setLogin("admin");
                admin.setSenha(org.mindrot.jbcrypt.BCrypt.hashpw("admin123", org.mindrot.jbcrypt.BCrypt.gensalt()));
                admin.setPerfil(PerfilFuncionario.ADMINISTRADOR);
                admin.setStatus(Status.ATIVO);
                admin.setTelefone("(00) 00000-0000");
                admin.setEmail("admin@salao.com");
                
                funcionarioRepository.save(admin);
                System.out.println("Usuário Administrador padrão criado: login='admin', senha='admin123'");
            }
        };
    }
}
