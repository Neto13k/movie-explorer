# 🎬 Movie Explorer

Aplicação Next.js para explorar filmes populares, com busca por título, filtro por gênero, rolagem infinita e detalhes completos de cada filme, usando dados reais da [TMDB (The Movie Database)](https://www.themoviedb.org/).

Construído como projeto de aprendizado de Next.js (App Router) e peça de portfólio.

**Demo:** [[link do deploy na Vercel](https://movie-explorer-br.vercel.app/)](#)

---

## Funcionalidades

- 🎞️ Listagem de filmes populares, atualizada direto da TMDB
- 🔍 Busca por título com debounce, consultando a API em tempo real (não só os filmes já carregados)
- 🎭 Filtro por gênero
- ♾️ Rolagem infinita (infinite scroll), carregando mais páginas conforme o usuário rola a tela
- 🎥 Página de detalhe com sinopse, nota, gêneros, data de lançamento e elenco (com rolagem horizontal)
- 🌗 Tema claro/escuro, com identidade visual própria (dourado e vermelho, inspirada em cinema)
- ⚡ Metadata dinâmica por página (título e descrição no detalhe de cada filme)
- 💀 Estado de carregamento e tela de erro com opção de tentar novamente

## Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Dados:** [API da TMDB](https://developer.themoviedb.org/reference/intro/getting-started)
- **Deploy:** Vercel

## Decisões técnicas

Alguns pontos da arquitetura que valem destacar:

- **A chave da TMDB nunca é exposta ao navegador.** As chamadas à API passam por Route Handlers próprias (`/api/popular`, `/api/search`), que guardam o token só no servidor. O client nunca vê a credencial.
- **Server e Client Components são usados deliberadamente.** A busca inicial de dados roda em Server Components (sem JavaScript enviado ao navegador para isso); só a interatividade real (filtro, busca, tema, scroll) roda em Client Components.
- **A busca por título consulta a API, não só a lista já carregada.** Isso garante que filmes fora da amostra de "populares" também apareçam na busca.
- **O infinite scroll usa `IntersectionObserver`** para detectar quando o usuário se aproxima do fim da lista, sem bibliotecas externas, e descarta duplicatas entre páginas (a popularidade da TMDB muda quase em tempo real).
- **A barra de busca/filtro é compartilhada entre páginas via `createPortal`**, permitindo que ela viva visualmente dentro do cabeçalho (presente em todo o site) mesmo sendo controlada pelo componente da listagem.

## Como rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/Neto13k/movie-explorer.git
   cd movie-explorer
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie uma conta em [themoviedb.org](https://www.themoviedb.org/) e gere seu **Access Token (v4)** em [Configurações de API](https://www.themoviedb.org/settings/api).

4. Crie um arquivo `.env.local` na raiz do projeto:
   ```
   TMDB_API_KEY=seu_access_token_v4_aqui
   ```

5. Rode o projeto:
   ```bash
   npm run dev
   ```

6. Acesse [http://localhost:3000](http://localhost:3000)

## Deploy

Hospedado na [Vercel](https://vercel.com/). Ao fazer o deploy de um fork, lembre-se de configurar a variável de ambiente `TMDB_API_KEY` no painel do projeto (Settings → Environment Variables), já que o `.env.local` não é enviado para o repositório.

## Estrutura do projeto

```
src/app/
├── api/
│   ├── popular/route.ts     # Route Handler: proxy para filmes populares
│   └── search/route.ts      # Route Handler: proxy para busca por título
├── components/
│   ├── Header.tsx           # Cabeçalho fixo, logo e ponto de portal da busca
│   ├── FilterFilms.tsx      # Listagem, filtro, busca e infinite scroll
│   ├── SearchBar.tsx        # Input de busca com debounce
│   └── ThemeToggle.tsx      # Alternância de tema claro/escuro
├── movie/[id]/page.tsx      # Página de detalhe do filme
├── types/index.ts           # Tipos TypeScript da resposta da TMDB
├── layout.tsx
├── page.tsx                 # Home
├── loading.tsx
└── error.tsx
```

## Autor

**José Hermes**
[GitHub](https://github.com/Neto13k)

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
