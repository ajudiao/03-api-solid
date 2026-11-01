# Configuração do Prisma

Este documento resume a configuração e as verificações feitas no Prisma deste projeto.

## Client

O client fica em `src/lib/prisma.ts`. Ele usa o adapter `@prisma/adapter-pg`, configurado com `DATABASE_URL` validado pela aplicação em `src/config/env.ts`, e importa o client gerado em `src/generated/prisma`.

O módulo exporta uma instância única:

```ts
import { prisma } from "./lib/prisma.js";
```

Reutilize essa instância nos serviços e repositórios, em vez de criar um novo `PrismaClient` em cada arquivo. O client gerado está em `src/generated/prisma`, diretório ignorado pelo Git; regenere-o quando o schema mudar:

```bash
npm exec prisma generate
```

## Configuração do CLI

O arquivo `prisma7.config.ts` aponta para `prisma/schema.prisma`, define o diretório de migrations e obtém a URL com `env("DATABASE_URL")`, helper do Prisma que valida a variável na configuração.

O schema usa PostgreSQL e define os modelos `User`, `CheckIn` e `Gym`. A validação do schema e a geração do client foram executadas com Prisma 7.10.1.

## Verificações e pendências

- `npm exec prisma validate`: passou.
- `npm exec prisma generate`: passou.
- `npm exec tsc -- --noEmit`: passou após ajustar a leitura de `DATABASE_URL` na configuração do Prisma.
- A consulta de teste pelo client não conectou: o PostgreSQL rejeitou a senha do usuário `docker` (`28P01`). Confira as credenciais de `DATABASE_URL` no `.env`.
- `npm run build` gerou os bundles, mas falhou na geração de declarações: o `tsup` exige a API do compilador TypeScript, que não está disponível na versão 7 instalada. A mensagem indica `@typescript/typescript6` como compatibilidade possível; essa dependência não foi instalada.

## Observação sobre relações

No schema atual, `CheckIn` não tem campos de relação com `User` ou `Gym`. Portanto, o modelo ainda não associa check-ins a usuários ou academias.
