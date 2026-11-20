# site-hc3solutions proofs

**HEAD**: 2bb50c1
**Tree**: clean
**Shell**: /bin/sh
**Result**: 11 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run site / ✓ SITE-01 política do OS Oficina em /osoficina/privacidade` | pass |
| C2 | `run apps / ✓ SITE-02 app novo ganha /<slug>/privacidade só com o arquivo Markdown` | pass |
| C3 | `run site / ✓ SITE-03 página inicial com HC3 Solutions, Sobre e a lista de apps` | pass |
| C4 | `run site / ✓ SITE-04 cartão sem link da loja mostra Em breve e a política` | pass |
| C5 | `run apps / ✓ SITE-04 cartão com link da loja mostra Baixar na Google Play` | pass |
| C6 | `run site / ✓ SITE-05 nenhum recurso de terceiros e viewport de celular` | pass |
| C7 | `run site / ✓ SITE-06 push na main gera e publica o site` | pass |
| C8 | `run site / ✓ SITE-07 deploy só roda depois do build` | pass |
| C9 | `run site / ✓ SITE-08 página 404 com link para o início` | pass |
| C10 | `run apps / ✓ SITE-09 app sem campo obrigatório faz o build falhar nomeando o campo` | pass |
| Build | `npx astro build` | pass |

## Output

`Run site` - exit 0

```
12:55:28   ├─ /osoficina/privacidade/index.html (+6ms) 
12:55:28   ├─ /index.html (+5ms) 
12:55:28 ✓ Completed in 91ms.

12:55:28 [build] ✓ Completed in 2.70s.
12:55:28 [build] 3 page(s) built in 4.34s
12:55:28 [build] Complete!
✓ SITE-01 política do OS Oficina em /osoficina/privacidade
✓ SITE-02 cada app do conteúdo tem a página de política
✓ SITE-03 página inicial com HC3 Solutions, Sobre e a lista de apps
✓ SITE-04 cartão sem link da loja mostra Em breve e a política
✓ SITE-05 nenhum recurso de terceiros e viewport de celular
✓ SITE-06 push na main gera e publica o site
✓ SITE-07 deploy só roda depois do build
✓ SITE-08 página 404 com link para o início
```

`Run apps` - exit 0

```
> hc3solutions-site@0.0.1 verificar:apps
> node scripts/verificar.mjs --apps

✓ SITE-02 app novo ganha /<slug>/privacidade só com o arquivo Markdown
✓ SITE-04 cartão com link da loja mostra Baixar na Google Play
✓ SITE-09 app sem campo obrigatório faz o build falhar nomeando o campo
```
