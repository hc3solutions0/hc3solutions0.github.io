# HC3 Solutions — site

Site público da HC3 Solutions em <https://hc3solutions0.github.io>: página inicial e a política de privacidade de cada app.

## Adicionar um app

Crie `src/content/apps/<slug>.md` com o frontmatter abaixo e a política de privacidade no corpo. A política fica em `/<slug>/privacidade`.

```md
---
nome: Nome do app
frase: Uma frase curta sobre o app.
icone: /apps/<slug>.svg   # imagem em public/apps/
loja: https://play.google.com/store/apps/details?id=br.com.hc3solutions.<slug>   # só depois de publicado
atualizadoEm: 2026-11-20
ordem: 2
---
```

## Comandos

```sh
npm install
npm run dev              # servidor local
npm test                 # gera o site e verifica (o mesmo que o deploy roda)
npm run verificar:apps   # verifica o comportamento com apps de exemplo
```

Um push na `main` publica o site pelo GitHub Actions (`.github/workflows/deploy.yml`).
