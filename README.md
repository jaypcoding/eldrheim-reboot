# ELDRHEIM

Base inicial de um RPG de navegador com React, TypeScript e Vite. Esta etapa entrega a tela de menu e a estrutura do projeto; ainda não há aventura jogável, salvamento, autenticação, banco de dados ou comunicação multiplayer. Nenhum elemento de lore foi inventado.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Instalação

Na pasta do projeto, instale as dependências:

```bash
npm install
```

## Executar no navegador

```bash
npm run dev
```

Abra o endereço local exibido pelo Vite (normalmente `http://localhost:5173`). A tela oferece “Nova jornada” e “Continuar jornada”; ambas explicam com clareza que os sistemas correspondentes ainda não estão disponíveis.

## Testes

Execute os testes automatizados uma vez:

```bash
npm test
```

Para acompanhar os testes durante o desenvolvimento:

```bash
npm run test:watch
```

## Compilação de produção

```bash
npm run build
```

Os arquivos compilados são gerados em `dist/`. Para visualizar a compilação localmente:

```bash
npm run preview
```

## Organização

- `src/app` e `src/components`: interface e componentes visuais.
- `src/game`: ações e lógica local do jogo.
- `src/narrative`: ponto separado para conteúdo narrativo oficial.
- `src/server`: contratos TypeScript previstos para comunicação futura; sem integração ativa.

## Autenticação Supabase

O login e o cadastro usam Supabase Auth. Para executar em outro ambiente:

1. Copie `.env.example` para `.env.local`.
2. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` com os valores públicos do projeto Supabase.
3. Reinicie o servidor Vite após alterar as variáveis.

`.env.local` está no `.gitignore`. Use somente a chave publicável no frontend; nunca coloque uma chave `service_role` ou a senha do banco neste projeto. O cadastro salva o nome de usuário nos metadados de autenticação.

Para exigir confirmação por e-mail, habilite a confirmação de e-mail nas configurações de Auth do painel Supabase e configure a URL de redirecionamento do site para a origem usada pelo jogo (por exemplo, `http://localhost:5173/**` no desenvolvimento). Com a confirmação ativada, o jogo só considera autenticada uma sessão emitida pelo Supabase; uma conta pendente recebe uma mensagem para confirmar o endereço antes de entrar.
