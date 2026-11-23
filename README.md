# GymPass API

API REST para uma aplicação de gestão de check-ins em academias, inspirada no modelo de negócio do GymPass.

## Requisitos Funcionais (RFs)

- [x] Deve ser possível registar um novo utilizador.
- [x] Deve ser possível autenticar um utilizador.
- [x] Deve ser possível obter o perfil do utilizador autenticado.
- [x] Deve ser possível obter o número de check-ins realizados pelo utilizador autenticado.
- [x] Deve ser possível consultar o histórico de check-ins do utilizador autenticado.
- [ ] Deve ser possível listar academias próximas da localização do utilizador.
- [x] Deve ser possível pesquisar academias pelo nome.
- [ ] Deve ser possível obter os detalhes de uma academia.
- [ ] Deve ser possível listar as academias cadastradas.
- [x] Deve ser possível realizar check-in numa academia.
- [ ] Deve ser possível validar um check-in.
- [x] Deve ser possível cadastrar uma academia.

## Regras de Negócio (RNs)

- [x] Um utilizador não pode registar-se com um endereço de e-mail já existente.
- [x] Um utilizador não pode realizar mais de um check-in no mesmo dia.
- [x] Um utilizador só pode realizar check-in se estiver a uma distância máxima de 100 metros da academia.
- [ ] Um check-in só pode ser validado por um administrador.
- [ ] Apenas administradores podem cadastrar academias.
- [ ] Um check-in só pode ser validado dentro de um período de 20 minutos após a sua realização.
- [ ] Um check-in não validado dentro do período estabelecido deve expirar.

### Estados do Check-in

| Estado | Descrição |
|---|---|
| `PENDING` | Check-in realizado, aguardando validação. |
| `VALIDATED` | Check-in validado por um administrador. |
| `EXPIRED` | Check-in expirado sem validação. |

## Requisitos Não Funcionais (RNFs)

- [ ] As senhas dos utilizadores devem ser armazenadas de forma segura, utilizando algoritmos de hash como bcrypt ou Argon2.
- [ ] Os dados da aplicação devem ser persistidos numa base de dados PostgreSQL.
- [ ] Todas as listas de dados devem implementar paginação, com 20 registos por página, por padrão.
- [ ] A autenticação deve utilizar JWT (JSON Web Token).
- [ ] A API deve garantir que apenas utilizadores autorizados acedam a recursos protegidos.
- [ ] A aplicação deve validar os dados recebidos nas requisições.

## Modelagem Inicial da Base de Dados

### User

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único |
| name | VARCHAR | Nome do utilizador |
| email | VARCHAR | E-mail único |
| password_hash | VARCHAR | Hash da senha |
| role | ENUM | Papel do utilizador (`ADMIN` ou `MEMBER`) |
| created_at | TIMESTAMP | Data de criação |

### Gym

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único |
| title | VARCHAR | Nome da academia |
| description | TEXT | Descrição |
| phone | VARCHAR | Contacto telefónico |
| latitude | DECIMAL | Latitude da academia