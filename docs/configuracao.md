# Rascunhos de Mim

Blog pessoal: textos, pensamentos e fotos, numa coluna só, escuro por padrão e com um modo "papel envelhecido".
Só o dono entra (com a conta Google) e escreve; todo mundo pode ler.

Feito com Next.js, hospedado na Vercel, com Supabase para login, posts e fotos. Tudo cabe no plano grátis dos dois.

## O que tem

- **Início**: posts um embaixo do outro, com uma frase fixa no topo (edite em `lib/frases.ts`).
- **Três tipos de post**: texto, foto (com grão e cor apagada) e frase solta.
- **Página de cada post**, com anterior e próximo.
- **Arquivo** por mês, **tags** e **sobre mim** (editável em `/escrever` > editar sobre mim).
- **Área de escrever** (`/escrever`): escolher o tipo, escrever, subir foto, pôr tags, publicar ou guardar rascunho, editar e apagar.
- Funciona bem no celular: menu recolhido, botões grandes, fotos reduzidas no próprio aparelho antes de subir.

Sem o Supabase configurado, o site abre em **modo demonstração**, com posts de exemplo.

## Como colocar no ar

### 1. Supabase (banco, fotos e login)

1. Crie uma conta em [supabase.com](https://supabase.com) e um projeto novo (região São Paulo).
2. Em **SQL Editor**, cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e rode.
3. Ainda no SQL Editor, rode com o seu e-mail Google:
   ```sql
   insert into public.site_owners (email) values ('seu-email@gmail.com');
   ```
4. No botão **Connect** (topo do painel) > **Framework** > **Next.js**, copie a URL do projeto e a chave *publishable* (em projetos antigos, *anon*).

### 2. Login com Google

1. No [Google Cloud Console](https://console.cloud.google.com/apis/credentials), crie um projeto, configure a tela de consentimento (tipo "Externo") e crie uma credencial **ID do cliente OAuth** do tipo "Aplicativo da Web".
2. Em **URIs de redirecionamento autorizados**, coloque `https://SEU-PROJETO.supabase.co/auth/v1/callback`.
3. No Supabase, em **Authentication > Sign In / Providers > Google**, ative e cole o *Client ID* e o *Client Secret*.
4. Em **Authentication > URL Configuration**, ponha o endereço do site em *Site URL* e adicione `https://SEU-SITE/auth/callback` (e `http://localhost:3000/auth/callback` para testar no computador) em *Redirect URLs*.

### 3. Vercel

1. Em [vercel.com](https://vercel.com), entre com o GitHub e importe este repositório.
2. Em **Environment Variables**, adicione:

   | nome | valor |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | a Project URL do Supabase |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | a chave publishable (ou use `NEXT_PUBLIC_SUPABASE_ANON_KEY` com a chave anon) |
   | `OWNER_EMAIL` | o seu e-mail Google |
   | `NEXT_PUBLIC_SITE_URL` | o endereço do site, ex. `https://rascunhosdemim.vercel.app` |

3. Clique em **Deploy**. Depois, entre em `/entrar` no site.

## Atualizações do banco

Quem já rodou o `schema.sql` antes de uma mudança roda só os arquivos novos de `supabase/migrations/`, em ordem, no SQL Editor.

- `002_sobre.sql`: texto editável do "sobre mim".

## Rodar no computador

```bash
npm install
cp .env.example .env.local   # preencha com os valores acima
npm run dev
```

Abra http://localhost:3000.

## Segurança

Quem pode escrever é decidido em dois lugares: a variável `OWNER_EMAIL` (no site) e a tabela `site_owners` (no banco, com
Row Level Security). Mesmo que alguém consiga entrar com outra conta Google, o banco recusa qualquer escrita.
