-- Inserir Serviços Iniciais
INSERT INTO servicos (nome, descricao, preco, duracao_minutos, status) VALUES 
('Corte Feminino', 'Corte e finalização com escova', 80.00, 60, 'ATIVO'),
('Corte Masculino', 'Corte com máquina e tesoura', 40.00, 30, 'ATIVO'),
('Manicure', 'Cutilagem e esmaltação', 35.00, 45, 'ATIVO'),
('Pedicure', 'Cutilagem e esmaltação dos pés', 40.00, 45, 'ATIVO'),
('Luzes', 'Descoloração em mechas', 250.00, 180, 'ATIVO'),
('Limpeza de Pele', 'Extração profunda e hidratação', 120.00, 90, 'ATIVO');

-- Inserir Funcionários (senha para todos: Senha@123)
-- Administrador
INSERT INTO funcionarios (nome_completo, login, senha, perfil, telefone, email, status, horario_trabalho) VALUES 
('Administrador do Sistema', 'admin', '$2a$12$zdVzwjgYMf6wcQ2Qp7lfr.9Qiqvwz8BkOfZNe5ARMxV1Y1t/tpULq', 'ADMINISTRADOR', '(00) 00000-0000', 'admin@salao.com', 'ATIVO', '08:00 às 18:00');

-- Recepcionista
INSERT INTO funcionarios (nome_completo, login, senha, perfil, telefone, email, status, horario_trabalho) VALUES 
('Mariana Silva', 'mariana.recep', '$2a$12$1BTSMiygwuqEx7zmvO8Xzu1EBU4EAN1TF.Xu4KlsNOU7JwcrJiHHO', 'RECEPCIONISTA', '(11) 98888-1111', 'mariana@salao.com', 'ATIVO', '08:00 às 18:00');

-- Profissionais
INSERT INTO funcionarios (nome_completo, login, senha, perfil, telefone, email, status, especialidade, horario_trabalho) VALUES 
('Carlos Souza', 'carlos.cabelo', '$2a$12$1BTSMiygwuqEx7zmvO8Xzu1EBU4EAN1TF.Xu4KlsNOU7JwcrJiHHO', 'PROFISSIONAL', '(11) 98888-2222', 'carlos@salao.com', 'ATIVO', 'CABELO', '09:00 às 19:00'),
('Ana Paula', 'ana.manicure', '$2a$12$1BTSMiygwuqEx7zmvO8Xzu1EBU4EAN1TF.Xu4KlsNOU7JwcrJiHHO', 'PROFISSIONAL', '(11) 98888-3333', 'ana@salao.com', 'ATIVO', 'MANICURE', '08:00 às 18:00'),
('Julia Mendes', 'julia.estetica', '$2a$12$1BTSMiygwuqEx7zmvO8Xzu1EBU4EAN1TF.Xu4KlsNOU7JwcrJiHHO', 'PROFISSIONAL', '(11) 98888-4444', 'julia@salao.com', 'ATIVO', 'ESTETICA', '10:00 às 20:00');

-- Inserir Clientes (senha para todos: Senha@123)
INSERT INTO clientes (nome_completo, data_nascimento, login, senha, telefone, email, status) VALUES 
('Fernanda Costa', '1995-05-15', 'fernanda.costa', '$2a$12$1BTSMiygwuqEx7zmvO8Xzu1EBU4EAN1TF.Xu4KlsNOU7JwcrJiHHO', '(11) 97777-1111', 'fernanda@gmail.com', 'ATIVO'),
('Roberto Dias', '1988-11-20', 'roberto.dias', '$2a$12$1BTSMiygwuqEx7zmvO8Xzu1EBU4EAN1TF.Xu4KlsNOU7JwcrJiHHO', '(11) 97777-2222', 'roberto@hotmail.com', 'ATIVO'),
('Camila Oliveira', '2001-02-10', 'camila.oli', '$2a$12$1BTSMiygwuqEx7zmvO8Xzu1EBU4EAN1TF.Xu4KlsNOU7JwcrJiHHO', '(11) 97777-3333', 'camila@yahoo.com', 'ATIVO');
