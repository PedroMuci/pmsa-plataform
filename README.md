# PMSA Plataform

## Sobre o Projeto

O PMSA Plataform é uma aplicação web desenvolvida para simular o provisionamento automático de servidores multiplayer para jogos online.

A proposta do sistema é representar, de forma simplificada, o funcionamento de uma infraestrutura cloud voltada para jogos, onde usuários podem criar contas, escolher um jogo e serem automaticamente conectados a um servidor disponível.

O sistema realiza uma simulação de matchmaking e gerenciamento de servidores:
- Caso exista um servidor disponível para o jogo selecionado, o usuário é conectado automaticamente.
- Caso não exista nenhum servidor online no momento, a aplicação simula a criação de um novo servidor para atender o jogador.

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
