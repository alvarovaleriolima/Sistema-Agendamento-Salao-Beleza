# Sistema de Agendamento para Salão de Beleza

Este é um projeto acadêmico desenvolvido para a disciplina de Engenharia de Software I, focado no levantamento de requisitos, análise e gerenciamento de configuração de um sistema de agendamentos e gestão para salões de beleza.

---

## 👥 Equipe de Desenvolvimento
* **Alvaro**
* **Clara** 
* **Pietro** 
* **Samuel** 
* **Wladia** 

---

## 📂 Estrutura do Repositório

O repositório está estruturado e organizado da seguinte forma:

* 📁 **Docs/**: Contém todos os artefatos oficiais produzidos e validados pela equipe.
  * 📄 `DocumentoRequisitos.docx`: Documento de Requisitos (DRE) detalhando as regras de negócio, escopo e requisitos do sistema.
  * 📊 `Tabela de Estimativa de Projeto.xlsx`: Planilha com a Estimativa de Tamanho (EST) do projeto.
  * 📅 `CronogramaSalão.pod`: Cronograma do Projeto (CRO) estruturado e gerenciado no ProjectLibre.
* 📄 `Baseline_Analise_v1.0.md`: Termo de encerramento, aprovação e controle de versões da primeira baseline.
* 📄 `README.md`: Guia geral de informações do repositório (este arquivo).

---

## 🚀 Linhas de Base (Baselines / Tags)

O ciclo de vida e as entregas oficiais do projeto são controlados e congelados através de Git Tags (Releases):

* **[Release 00] Baseline de Análise 1.0**: Consolidação e congelamento da primeira versão oficial dos artefatos da fase de análise (DRE, EST e CRO) aprovada por todos os integrantes da equipe.

---

## 🛠️ Ferramentas Utilizadas
* **Microsoft Word / Excel**: Para a especificação de requisitos e matrizes de estimativa.
* **ProjectLibre**: Para o planejamento temporal e gerenciamento do cronograma do projeto (`.pod`).
* **Markdown**: Fornece uma documentação legível e profissional diretamente na interface do repositório.
* **Git & GitHub**: Utilizados para o controle de versão, distribuição do trabalho e gerência de configuração de software.

💇 SASB2026 — Sistema de Agendamento para Salão de Beleza
Sistema web para gerenciamento de agendamentos, clientes, funcionários e serviços de um salão de beleza.

🛠️ Tecnologias
Backend

Java 21
Spring Boot 3.2.5
Spring Data JPA
Spring Validation
H2 Database (desenvolvimento)
Lombok
Swagger / SpringDoc OpenAPI

Frontend

React + TypeScript
Vite
Tailwind CSS
shadcn/ui
pnpm


📁 Estrutura do Projeto
Sistema-Agendamento-Salao-Beleza \
├── BackEnd \
│   └── salon-api \
│       ├── src/main/java/com/salao/salon_api \
│       │   ├── controller \
│       │   ├── services \
│       │   ├── models \
│       │   ├── repositories \
│       │   ├── dto \
│       │   │   ├── funcionario \
│       │   │   └── cliente \
│       │   ├── enums \
│       │   └── exceptions \
│       └── src/main/resources \
│           └── application.properties \
└── FrontEnd \
    ├── src \
    │   ├── app \
    │   ├── components \
    │   ├── services \
    │   └── styles \
    └── package.json 

⚙️ Pré-requisitos

Java 21+
Node.js LTS
pnpm

bash# Instalar pnpm após instalar o Node.js
npm install -g pnpm

🚀 Como rodar o projeto
1. Clone o repositório
bashgit clone https://github.com/seu-usuario/Sistema-Agendamento-Salao-Beleza.git
cd Sistema-Agendamento-Salao-Beleza
2. Rode o Backend
Abra um terminal na pasta raiz do projeto:
bashcd BackEnd/salon-api

# Linux/Mac
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
O backend sobe em: http://localhost:8080
3. Rode o Frontend
Abra outro terminal na pasta raiz:
bashcd FrontEnd
pnpm install
pnpm approve-builds   # apenas na primeira vez
pnpm install          # rode novamente após approve-builds
pnpm dev
O frontend sobe em: http://localhost:5173

📖 Documentação da API
Com o backend rodando, acesse:

Swagger UI: http://localhost:8080/swagger-ui.html
H2 Console: http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:sasb_db
Usuário: sa
Senha: (deixar em branco)




📋 Funcionalidades implementadas
CódigoDescriçãoPrioridadeRFS01Inserir FuncionárioEssencialRFS02Consultar FuncionárioEssencialRFS03Editar FuncionárioEssencialRFS04Inativar FuncionárioEssencialRFS05Inserir ClienteEssencialRFS06Consultar ClienteEssencialRFS07Editar ClienteEssencialRFS08Inativar ClienteEssencial

👥 Perfis de usuário
PerfilPermissõesAdministradorAcesso total ao sistemaRecepcionistaGerencia clientes e agendamentosProfissionalVisualiza sua própria agendaClienteRealiza e consulta seus agendamentos

👨‍💻 Autores
Desenvolvido Samuel


-------------------------------------------------------------------------------------------------------------------------------------------------------------------
# 💇 SASB2026 — Sistema de Agendamento para Salão de Beleza

Sistema web desenvolvido para gerenciamento de agendamentos, clientes, funcionários e serviços de um salão de beleza.

Este projeto foi desenvolvido no contexto da disciplina de Engenharia de Software I, abrangendo atividades de levantamento de requisitos, análise, planejamento, gerenciamento de configuração e implementação do sistema.

---

## 👥 Equipe de Desenvolvimento

- Alvaro
- Clara
- Pietro
- Samuel
- Wladia

---

## 📂 Estrutura do Repositório

```text
Sistema-Agendamento-Salao-Beleza
├── Docs
│   ├── DocumentoRequisitos.docx
│   ├── Tabela_Estimativa_Projeto.xlsx
│   ├── CronogramaSalao.pod
│   └── Baseline_Analise_v1.0.md
├── BackEnd
│   └── salon-api
└── FrontEnd
```

### Documentação

A pasta `Docs/` contém os principais artefatos produzidos durante a fase de análise:

- **Documento de Requisitos (DRE)**: especificação dos requisitos funcionais e não funcionais do sistema.
- **Estimativa de Tamanho (EST)**: planilha utilizada para estimativa do esforço do projeto.
- **Cronograma do Projeto (CRO)**: planejamento temporal desenvolvido no ProjectLibre.
- **Baseline de Análise**: documento de aprovação e congelamento dos artefatos produzidos.

---

## 🚀 Baselines e Controle de Configuração

O projeto utiliza Git e GitHub para controle de versão e gerenciamento de configuração.

### Release 1.0 — Baseline de Análise

Primeira versão oficial dos artefatos da fase de análise, contendo:

- Documento de Requisitos (DRE)
- Estimativa de Tamanho (EST)
- Cronograma do Projeto (CRO)

Todos os artefatos foram revisados e aprovados pela equipe antes da criação da baseline.

---

## 🛠️ Tecnologias Utilizadas

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

## 📁 Estrutura do Projeto

```text
Sistema-Agendamento-Salao-Beleza
├── BackEnd
│   └── salon-api
│       ├── src/main/java/com/salao/salon_api
│       │   ├── controller
│       │   ├── services
│       │   ├── models
│       │   ├── repositories
│       │   ├── dto
│       │   │   ├── funcionario
│       │   │   └── cliente
│       │   ├── enums
│       │   └── exceptions
│       └── src/main/resources
│           └── application.properties
└── FrontEnd
    ├── src
    │   ├── app
    │   ├── components
    │   ├── services
    │   └── styles
    └── package.json
```

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, instale:

- Java 21 ou superior
- Node.js (versão LTS)
- pnpm

Instalação do pnpm:

```bash
npm install -g pnpm
```

---

## 🚀 Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/Sistema-Agendamento-Salao-Beleza.git

cd Sistema-Agendamento-Salao-Beleza
```

### 2. Executar o Backend

```bash
cd BackEnd/salon-api
```

Linux/Mac:

```bash
./mvnw spring-boot:run
```

Windows:

```bash
mvnw.cmd spring-boot:run
```

O backend será iniciado em:

```text
http://localhost:8080
```

### 3. Executar o Frontend

Em outro terminal:

```bash
cd FrontEnd

pnpm install

pnpm approve-builds

pnpm install

pnpm dev
```

O frontend será iniciado em:

```text
http://localhost:5173
```

---

## 📖 Documentação da API

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
JDBC URL: jdbc:h2:mem:sasb_db
Usuário: sa
Senha: (em branco)
```

---

## 📋 Funcionalidades Implementadas

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

## 👥 Perfis de Usuário

| Perfil | Permissões |
|----------|------------|
| Administrador | Acesso total ao sistema |
| Recepcionista | Gerenciamento de clientes e agendamentos |
| Profissional | Visualização da própria agenda |
| Cliente | Realização e consulta de agendamentos |

---

## 👨‍💻 Autores

Desenvolvido por:

- Samuel
- Alvaro
- Clara
- Pietro
- Wladia

---

## 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos na disciplina de Engenharia de Software I.
