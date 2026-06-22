# SASB2026 — Sistema de Agendamento para Salão de Beleza

Sistema web desenvolvido para gerenciamento de agendamentos, clientes, funcionários e serviços de um salão de beleza.

Este projeto foi desenvolvido no contexto da disciplina de Engenharia de Software I, abrangendo atividades de levantamento de requisitos, análise, planejamento, gerenciamento de configuração e implementação do sistema.

## Estrutura do Repositório

```text
Sistema-Agendamento-Salao-Beleza
├── Docs
│   ├── DocumentoRequisitos.docx
│   ├── Tabela_Estimativa_Projeto.xlsx
│   ├── CronogramaSalao.pod
│   └── Baseline_Analise_v1.0.md
├── api
│   ├── backend (Spring Boot Backend)
│   └── src (React/Vite Frontend)
├── Testes-Selenium
```

### Documentação

A pasta `Docs/` contém os principais artefatos produzidos durante a fase de análise:

- **Documento de Requisitos (DRE)**: especificação dos requisitos funcionais e não funcionais do sistema.
- **Estimativa de Tamanho (EST)**: planilha utilizada para estimativa do esforço do projeto.
- **Cronograma do Projeto (CRO)**: planejamento temporal desenvolvido no ProjectLibre.
- **Baseline de Análise**: documento de aprovação e congelamento dos artefatos produzidos.

---

## Baselines e Controle de Configuração

O projeto utiliza Git e GitHub para controle de versão e gerenciamento de configuração.

## Tecnologias Utilizadas

### Backend

- Java 21
- Spring Boot 3.2.5
- Spring Data JPA
- Spring Validation
- H2 Database
- Lombok
- Swagger / SpringDoc OpenAPI

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- pnpm

### Ferramentas de Engenharia de Software

- Microsoft Word
- Microsoft Excel
- ProjectLibre
- Markdown
- Git
- GitHub

---

## Estrutura do Projeto

```text
Sistema-Agendamento-Salao-Beleza
├── api
│   ├── backend
│   │   ├── src/main/java/com/salao/agendamento
│   │   └── src/main/resources
│   │       └── application.properties
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── services
│   │   └── styles
│   └── package.json
├── Testes-Selenium
│   └── test_login.py
```

---

## Pré-requisitos

Antes de executar o projeto, instale:

- Java 21 ou superior
- Node.js (versão LTS)
- pnpm

Instalação do pnpm:

```bash
npm install -g pnpm
```

---

## Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/alvarovaleriolima/Sistema-Agendamento-Salao-Beleza.git

cd Sistema-Agendamento-Salao-Beleza
```

### 2. Executar o Backend

Requer o Maven instalado em sua máquina.

```bash
cd api/backend
mvn spring-boot:run
```

O backend será iniciado em:

```text
http://localhost:8080
```

### 3. Executar o Frontend

Em outro terminal, utilize o npm (Node.js) para rodar o projeto React com Vite:

```bash
cd api
npm install
npm run dev
```

O frontend será iniciado em:

```text
http://localhost:5173
```

### 4. Acesso ao Sistema

Após a inicialização, você poderá acessar o frontend pelo navegador. O sistema já conta com um usuário Administrador padrão criado automaticamente:
- **Login:** `admin`
- **Senha:** `admin123`

---

## Documentação da API

Com o backend em execução:

### Swagger UI

```text
http://localhost:8080/swagger-ui.html
```

### Console H2

```text
http://localhost:8080/h2-console
```

Configurações:

```text
JDBC URL: jdbc:h2:mem:testdb
Usuário: sa
Senha: password
```

---

## Funcionalidades Implementadas

| Código | Funcionalidade | Prioridade |
|---------|---------------|------------|
| RFS01 | Inserir Funcionário | Essencial |
| RFS02 | Consultar Funcionário | Essencial |
| RFS03 | Editar Funcionário | Essencial |
| RFS04 | Inativar Funcionário | Essencial |
| RFS05 | Inserir Cliente | Essencial |
| RFS06 | Consultar Cliente | Essencial |
| RFS07 | Editar Cliente | Essencial |
| RFS08 | Inativar Cliente | Essencial |

---

## Perfis de Usuário

| Perfil | Permissões |
|----------|------------|
| Administrador | Acesso total ao sistema |
| Recepcionista | Gerenciamento de clientes e agendamentos |
| Profissional | Visualização da própria agenda |
| Cliente | Realização e consulta de agendamentos |

---

## Autores

Desenvolvido por:

- Alvaro
- Clara
- Pietro
- Samuel
- Wladia
