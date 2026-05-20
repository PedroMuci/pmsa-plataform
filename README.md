# PMSA Plataform

## Sobre o Projeto

O PMSA Plataform é uma aplicação web desenvolvida para simular o provisionamento automático de servidores multiplayer para jogos online.

A proposta do sistema é representar, de forma simplificada, o funcionamento de uma infraestrutura cloud voltada para jogos, onde usuários podem criar contas, escolher um jogo e serem automaticamente conectados a um servidor disponível.

O sistema realiza uma simulação de matchmaking e gerenciamento de servidores:

- Caso exista um servidor disponível para o jogo selecionado, o usuário é conectado automaticamente.
- Caso não exista nenhum servidor online no momento, a aplicação simula a criação de um novo servidor para atender o jogador.
- Um usuário não pode se conectar a mais de um servidor, ele precisará se desconectar do anterior para ir a um novo.

O projeto utiliza:

- Frontend em React
- Backend em FastAPI (Python)
- Banco de dados PostgreSQL
- Containers Docker
- Docker Compose para orquestração da aplicação

---

# Tecnologias Utilizadas

## Frontend

- React
- React Router
- Axios
- Nginx

## Backend

- Python
- FastAPI
- SQLAlchemy
- Uvicorn

## Banco de Dados

- PostgreSQL

## Containerização

- Docker
- Docker Compose

---

# Estrutura do Projeto

```text
pmsa-plataform/
│
├── backend/
│   ├── Dockerfile
│   └── ...
│
├── frontend/
│   ├── Dockerfile
│   └── ...
│
├── evidencias/
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

# Requisitos

Antes de executar o projeto, é necessário possuir instalado na máquina:

- Docker Desktop
- Python
- React / Node.js

---

# Clonando o Repositório

Clone o projeto utilizando o comando:

```bash
git clone https://github.com/PedroMuci/pmsa-plataform.git
```

Acesse a pasta do projeto:

```bash
cd pmsa-plataform
```

---

# Configuração do Ambiente

O projeto utiliza um arquivo `.env` para armazenar variáveis de ambiente.

Existe um arquivo chamado `.env.example` já disponível no projeto.

Crie uma cópia dele com o nome `.env`.

No Windows:

```bash
copy .env.example .env
```

No Linux:

```bash
cp .env.example .env
```

---

# Variáveis de Ambiente

O sistema utiliza variáveis de ambiente para configuração do banco de dados PostgreSQL.

| Variável | Descrição | Valor Padrão |
|---|---|---|
| POSTGRES_USER | Usuário do banco de dados | pmsa_user |
| POSTGRES_PASSWORD | Senha do banco de dados | pmsa_password |
| POSTGRES_DB | Nome do banco de dados | pmsa_db |

---

# Executando o Projeto

Com o Docker Desktop aberto, execute o seguinte comando na raiz do projeto:

```bash
docker compose up -d
```

O Docker irá:

- baixar as imagens necessárias
- criar os containers
- iniciar o banco de dados
- iniciar o backend
- iniciar o frontend

A primeira execução pode demorar alguns minutos.

---

# Acessando a Aplicação

Após os containers iniciarem corretamente, acesse:

```text
http://localhost
```

---

# Containers da Aplicação

O sistema é dividido em 3 containers:

| Container | Função |
|---|---|
| frontend | Interface React da aplicação |
| backend | API FastAPI responsável pelas regras do sistema |
| postgres | Banco de dados PostgreSQL |

---

# Portas Utilizadas

Os serviços da aplicação utilizam as seguintes portas:

| Serviço | Porta |
|---|---|
| Frontend | 80 |
| Backend | 8080 |
| PostgreSQL | 5432 |

---

# Arquitetura

O sistema é composto por 3 containers conectados em uma rede Docker interna chamada `pmsa_network`.

- O frontend (Nginx) recebe as requisições do usuário e se comunica com o backend
- O backend (FastAPI) processa as regras de negócio e acessa o banco de dados
- O postgres armazena os dados persistidos em um volume Docker chamado `postgres_data`

A persistência é garantida pelo volume `postgres_data`, permitindo que os dados permaneçam armazenados mesmo após reinicializações dos containers.

---

# Docker Compose

O arquivo `docker-compose.yml` é responsável por:

- iniciar os 3 containers da aplicação
- criar a rede `pmsa_network` conectando todos os containers
- configurar o volume `postgres_data` para persistência do banco
- configurar as variáveis de ambiente de cada serviço
- garantir que o backend só inicie após o postgres estar saudável

---

# Verificando Containers

Para verificar se todos os containers estão funcionando:

```bash
docker ps
```

Os 3 containers devem aparecer como ativos.

---

# Encerrando a Aplicação

Para parar os containers:

```bash
docker compose down
```

---

# Rebuild da Aplicação

Caso seja necessário reconstruir os containers:

```bash
docker compose up --build
```

---

# Funcionamento da Aplicação

## Cadastro

Ao acessar a aplicação:

- o usuário deve criar uma conta
- informar nome de usuário
- informar senha

Após o login, será possível acessar a lista de jogos disponíveis.

---

## Matchmaking

Ao selecionar um jogo:

- o sistema verifica se existe algum servidor disponível
- caso exista, o usuário é conectado ao servidor existente
- caso não exista, um novo servidor é criado automaticamente

O sistema também controla:

- quantidade de jogadores
- servidores online
- conexão atual do usuário

---

# Jogos Disponíveis

- Minecraft
- Counter-Strike
- Fortnite
- Rocket League

---

# Banco de Dados

O banco PostgreSQL é iniciado automaticamente pelo Docker Compose.

Nenhuma configuração manual adicional é necessária.

---

# API

O backend FastAPI é executado internamente na porta:

```text
8080
```

O frontend se comunica automaticamente com a API através do Docker Compose.

---

# Evidências

A pasta `evidencias` contém imagens e registros da aplicação em funcionamento.

---

# Autor

Pedro Muci Saraiva Abdonur

---

# Repositório

https://github.com/PedroMuci/pmsa-plataform
