# Fábio Hiroshi · Portfólio

Portfólio pessoal (AI Engineer · Full Stack), em português e inglês.

**Site:** https://fatec-sjc-dsm-portfolio.github.io/ra1461392421043/

## Estrutura

Monorepo com npm workspaces:

| Pasta | O que é |
|---|---|
| `apps/web` | Site em React 18 + Vite + TypeScript, com CSS próprio (sem framework de UI) |
| `apps/api` | Dados dos projetos e tecnologias, e uma API REST em Express + TypeScript |
| `docs` | Build do site publicado no GitHub Pages (gerado por `npm run deploy`, não editar à mão) |

Os dados ficam em `apps/api/lib/data`. O site importa esses arquivos direto no build
(alias `@api`), então a versão publicada é totalmente estática e não depende da API
estar no ar. A API continua disponível para rodar localmente.

## Rodando localmente

Requer Node.js 20 ou mais recente.

```bash
npm install
npm run dev        # site em http://localhost:5173
npm run dev:api    # API opcional em http://localhost:3001/api/projects
npm run build      # build de produção em apps/web/dist
```

## Deploy

O GitHub Pages publica a pasta `docs/` da branch `main`
(Settings → Pages → Deploy from a branch → `main` / `/docs`). Para atualizar o site:

```bash
npm run deploy
git add docs && git commit -m "Atualiza o site" && git push
```

O `npm run deploy` gera o build com o caminho base do repositório dentro de `docs/`. Uma
cópia do `index.html` vira `404.html`, para que rotas como `/cursoPython` funcionem ao
abrir o link direto.

Para editar um projeto, altere `apps/api/lib/data/projects.ts` (textos em português) e
`apps/api/lib/data/projects.en.ts` (traduções), rode `npm run deploy` e faça push.
