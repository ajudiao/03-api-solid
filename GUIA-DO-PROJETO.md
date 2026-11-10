# Guia de estudo do projeto

Este guia explica a estrutura que já existe, o caminho de uma requisição e os conceitos de arquitetura e SOLID que podes reconhecer no código. A distinção entre **implementado** e **planeado** é importante: os requisitos do README principal são objetivos do produto, não uma lista de funcionalidades já concluídas.

## 1. O que é o projeto

É uma API REST para uma aplicação de gestão de academias e check-ins, construída com:

- **Node.js e TypeScript** para executar a aplicação com tipos estáticos.
- **Fastify** para receber e responder a pedidos HTTP.
- **Prisma ORM 7** para mapear modelos e aceder à base de dados.
- **PostgreSQL** como base de dados configurada.
- **Zod** para validar variáveis de ambiente e dados de entrada.
- **bcryptjs** para criar e comparar hashes de palavras-passe.
- **Vitest** para testes automatizados.

## 2. Estado atual: implementado versus planeado

### Implementado

- `POST /users` regista utilizadores.
- O corpo do registo é validado: `name`, e-mail válido e palavra-passe com pelo menos seis caracteres.
- O caso de uso impede um segundo registo com o mesmo e-mail.
- A palavra-passe é guardada como hash bcrypt, não como texto simples.
- Existem repositórios de utilizadores para Prisma e para memória.
- O caso de uso de autenticação consulta o utilizador e compara a palavra-passe com o hash.
- O schema Prisma define `User`, `Gym` e `CheckIn`, incluindo relações entre check-ins, utilizadores e academias.
- Existem testes unitários do caso de uso de registo, incluindo hash da palavra-passe e e-mail duplicado.

### Ainda não exposto ou não implementado

- O caso de uso de autenticação existe, mas ainda não há rota HTTP de login nem emissão de JWT.
- Não há rotas para perfil, consulta de academias, criação de academias, check-in ou validação de check-in.
- As regras de distância, limite de um check-in diário, autorização de administrador e expiração não estão implementadas.
- O schema atual não define um papel de utilizador, apesar de esse papel aparecer na modelagem planeada no README principal.
- O teste de autenticação está vazio.
- `CLIENT` é validado na configuração, mas a aplicação Prisma observada usa PostgreSQL; não há seleção efetiva de cliente para MySQL ou SQLite.

## 3. Estrutura de pastas

| Caminho | Responsabilidade |
|---|---|
| `src/server.ts` | Ponto de entrada: inicia o servidor HTTP. |
| `src/app.ts` | Cria a aplicação Fastify, regista rotas e trata erros. |
| `src/config/env.ts` | Lê e valida variáveis de ambiente com Zod. |
| `src/http/routes.ts` | Regista as rotas HTTP. |
| `src/http/controllers/` | Traduz pedidos HTTP para chamadas aos casos de uso e resultados HTTP. |
| `src/validators/` | Define schemas para validar dados de entrada. |
| `src/use-cases/` | Implementa operações e regras da aplicação, como registar e autenticar. |
| `src/use-cases/error/` | Erros específicos dos casos de uso. |
| `src/repositories/` | Define contratos e implementações para persistir/consultar utilizadores. |
| `src/lib/prisma.ts` | Configura e exporta a instância partilhada do Prisma Client. |
| `src/types/` | Tipos usados entre as camadas da aplicação. |
| `prisma/schema.prisma` | Modelos e relações da base de dados. |
| `prisma/migrations/` | Migrações versionadas da base de dados. |

O cliente Prisma gerado fica em `src/generated/prisma/` e é ignorado pelo Git. É um artefacto gerado, não código para editar manualmente.

## 4. Como funciona o registo

O pedido `POST /users` segue aproximadamente este caminho:

1. `src/http/routes.ts` liga a rota ao controller `register`.
2. O controller valida `request.body` com `registerBodySchema`.
3. O controller cria `PrismaUserRepository` e injeta-o em `RegisterUseCase`.
4. `RegisterUseCase` procura um utilizador com o mesmo e-mail.
5. Se já existir, lança `UserAlreadyExistsError`; o controller converte-o numa resposta HTTP `409`.
6. Caso contrário, o caso de uso calcula o hash da palavra-passe e pede ao repositório para criar o utilizador.
7. O controller responde com `201 Created`.

Erros de validação do controller devolvem `400`. O handler global de `src/app.ts` também trata `ZodError` e converte erros não tratados numa resposta `500`.

## 5. Patterns e decisões de arquitetura

### Repository Pattern

`UserRepository` define as operações de que os casos de uso precisam (`findByEmail` e `create`). `PrismaUserRepository` implementa esse contrato usando a base de dados; `InMemoryUserRepository` implementa-o usando uma lista em memória.

**Benefício:** a regra de registo não precisa de conhecer os detalhes das consultas Prisma. A implementação em memória torna os testes rápidos e independentes de uma base de dados.

### Use Case / Application Service

`RegisterUseCase` e `AuthenticateUseCase` representam ações da aplicação. Cada classe coordena o trabalho necessário para realizar uma ação e aplica regras como rejeitar e-mails já registados ou credenciais inválidas.

**Benefício:** a lógica da aplicação não precisa de ficar toda dentro dos controllers ou das rotas e pode ser testada sem fazer pedidos HTTP.

### Injeção de dependências pelo construtor

Os casos de uso recebem `UserRepository` no construtor. Nos testes, recebem `InMemoryUserRepository`; no controller de registo, recebem `PrismaUserRepository`.

Isto é injeção de dependências feita explicitamente, sem um container de DI.

### Separação por camadas

Há uma separação inicial entre HTTP, casos de uso, repositórios e persistência. O fluxo HTTP trata de protocolo e respostas; o caso de uso trata da ação da aplicação; o repositório esconde o mecanismo de persistência.

Não é uma arquitetura totalmente isolada: por exemplo, os casos de uso usam o tipo `User` gerado pelo Prisma e o controller escolhe diretamente a implementação Prisma.

### Test Double

`InMemoryUserRepository` funciona como uma implementação de teste (*test double*): guarda os utilizadores em memória para que os testes dos casos de uso não precisem de PostgreSQL.

## 6. SOLID aplicado no código

SOLID é um conjunto de princípios de desenho, não uma lista de funcionalidades. Há exemplos reais no projeto, mas alguns são parciais e podem evoluir.

### S — Single Responsibility Principle

**Presente parcialmente.** Há responsabilidades separadas: configuração de ambiente, rotas, controller, validação, caso de uso e acesso a dados estão em módulos distintos.

Por exemplo, `RegisterUseCase` concentra-se no fluxo de registo; `PrismaUserRepository` concentra-se em persistir e procurar utilizadores. O controller ainda instancia as dependências diretamente e também converte erros em respostas HTTP, pelo que a separação pode ser refinada.

### O — Open/Closed Principle

**Presente parcialmente.** O contrato `UserRepository` permite acrescentar outra implementação de persistência sem reescrever a regra de registo. O repositório em memória e o Prisma são dois exemplos.

O controller, porém, está ligado diretamente a `PrismaUserRepository`. Para trocar a implementação na aplicação sem alterar o controller, seria necessário mover essa composição para um ponto de configuração, ou *composition root*.

### L — Liskov Substitution Principle

**Aparece no contrato dos repositórios.** Qualquer implementação de `UserRepository` deve poder ser usada pelo caso de uso sem alterar as expectativas sobre `create` e `findByEmail`. O repositório em memória e o Prisma procuram cumprir esse contrato.

É um princípio sobre comportamento, não apenas sobre `implements`: as implementações devem respeitar as mesmas regras de retorno e erro.

### I — Interface Segregation Principle

**Razoavelmente aplicado.** `UserRepository` só expõe as operações necessárias à funcionalidade atual, em vez de obrigar o caso de uso a depender de uma interface grande com métodos não usados.

Se a interface crescer com operações de vários contextos, pode fazer sentido dividi-la em contratos menores orientados às necessidades dos casos de uso.

### D — Dependency Inversion Principle

**É o exemplo mais claro.** `RegisterUseCase` e `AuthenticateUseCase` dependem da abstração `UserRepository`, não diretamente de Prisma. A implementação concreta é fornecida de fora por injeção no construtor.

**Limite atual:** o controller de registo decide que a implementação será `PrismaUserRepository`. A regra de negócio está desacoplada da base de dados, mas a montagem da aplicação ainda está acoplada ao Prisma.

## 7. Executar localmente

### Pré-requisitos

- Node.js e npm.
- Docker, para iniciar o PostgreSQL, ou uma instância PostgreSQL compatível.
- Um ficheiro `.env` com `DATABASE_URL`.

Exemplo de `.env` para o `docker-compose.yml` atual:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5433/apisolid?schema=public"
PORT=3333
NODE_ENV=development
```

O Docker Compose publica a porta `5433` no computador e encaminha-a para a porta `5432` do container. Não partilhes o `.env`; ele está no `.gitignore`.

### Instalação e base de dados

```bash
npm install
docker compose up -d
npm exec prisma migrate deploy
npm exec prisma generate
```

O schema Prisma usa PostgreSQL. `prisma7.config.ts` lê a URL de `DATABASE_URL`.

### Desenvolvimento e testes

```bash
npm run start:dev
npm test
```

A rota atualmente disponível é `POST http://localhost:3333/users`, com um corpo semelhante a:

```json
{
  "name": "Ana",
  "email": "ana@example.com",
  "password": "segredo123"
}
```

### Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run start:dev` | Executa o servidor em modo de desenvolvimento com recarga. |
| `npm test` | Executa os testes uma vez. |
| `npm run test:watch` | Executa os testes em modo de observação. |
| `npm run test:coverage` | Executa os testes com cobertura. |
| `npm run build` | Tenta gerar a distribuição em `dist/`. |
| `npm start` | Executa `dist/server.js`; requer uma build bem-sucedida antes. |

## 8. Boas oportunidades para aprender e melhorar

1. Escrever testes para `AuthenticateUseCase`: autenticação correta, utilizador inexistente e palavra-passe incorreta.
2. Criar uma rota de login e decidir como assinar e validar tokens JWT.
3. Mover a criação de dependências do controller para um ponto de composição, mantendo os controllers fáceis de testar.
4. Avaliar se os casos de uso devem depender de tipos próprios da aplicação em vez do tipo `User` gerado pelo Prisma.
5. Tratar a condição de corrida no registo: duas requisições simultâneas podem passar a verificação de e-mail; a restrição única da base de dados deve ser tratada também.
6. Definir o modelo de autorização e os papéis antes de implementar operações de administrador.
7. Implementar cada regra de check-in com testes para limites temporais, distância e duplicação diária.
8. Rever a consistência das respostas de validação: o controller de registo valida manualmente e o handler global também conhece `ZodError`.

As oportunidades acima são ideias de evolução, não afirmações de que o projeto já as implementa.

## 9. Documentação relacionada

- [README.md](./README.md): requisitos e modelagem inicial do produto.
- [PRISMA.md](./PRISMA.md): notas sobre Prisma e verificações de configuração. Confirma as pendências descritas nesse arquivo com o estado atual do código antes de as tratar como atuais.
