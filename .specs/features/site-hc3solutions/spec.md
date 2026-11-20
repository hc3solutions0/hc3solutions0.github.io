# Site HC3 Solutions Specification

**Approved**: 2026-11-20 - user: "spec aprovada, aqui o principal é resolver a política de privacidade depois poderemos melhorar a landing page."

## Problem Statement

A Play Store exige que cada app tenha uma política de privacidade numa URL pública, e a conta `hc3solutions0` vai publicar vários apps. Hoje não existe nenhum endereço público da empresa: nem para a política do OS Oficina, nem para apresentar a HC3 Solutions e seus apps. O repositório do app é privado e não serve para isso.

## Goals

- [ ] `https://hc3solutions0.github.io/` apresenta a HC3 Solutions e lista os apps.
- [ ] `https://hc3solutions0.github.io/osoficina/privacidade` publica a política de privacidade do OS Oficina, pronta para a ficha da Play Store.
- [ ] Um app novo entra no site com um arquivo de conteúdo, sem mexer no layout.

## Out of Scope

| Feature                              | Reason                                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| Domínio próprio (ex.: hc3solutions.com.br) | Não pedido; o GitHub Pages permite configurar depois sem mudar o conteúdo |
| Formulário de contato ou de ideias   | Usuário marcou só "Sobre" e "Lista de apps"                                    |
| Analytics, cookies e rastreamento    | O site não coleta dados; manter assim simplifica a própria política            |
| Termos de uso dos apps               | A Play exige só a política de privacidade                                      |
| Código dos apps neste repositório    | O repositório é público e guarda só o site                                     |

---

## Assumptions & Open Questions

| Assumption / decision    | Chosen default                                                                                                                                       | Rationale                                                                                       | Confirmed? |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------- |
| Repositório              | `hc3solutions0/hc3solutions0.github.io`, **público**, publicado em `https://hc3solutions0.github.io/`                                                | Usuário: repositório na conta dele, reaproveitado pelos outros projetos; Pages da conta gratuita só publica repositório público | y          |
| Nome da empresa          | "HC3 Solutions"                                                                                                                                      | Usuário escolheu "HC3 Solutions"                                                                | y          |
| Conteúdo da página       | Seção "Sobre" com o texto "aplicativos que resolvem pequenos problemas do dia a dia" e lista de apps                                                 | Usuário marcou "Sobre (texto da loja)" e "Lista de apps"                                        | y          |
| Gerador                  | Astro 6, com deploy pelo GitHub Actions (`npm ci` + `npm test` + `actions/upload-pages-artifact` + `actions/deploy-pages`; no lugar do `withastro/action`, para as verificações rodarem antes de publicar)                                                              | Usuário escolheu "Gerador"; Astro roda em Node como o resto dos projetos; não há Ruby na máquina para o Jekyll | y          |
| Texto do "Sobre"         | A versão média do texto gerado em 2026-11-20, na primeira pessoa do plural ("Desenvolvemos..."), sem a frase "funcionar mesmo sem internet"           | O site fala pela empresa; a frase sobre internet vale só para o OS Oficina                     | y          |
| Cartão de cada app       | Nome, frase curta, ícone, link "Política de privacidade" e, quando publicado, link "Baixar na Google Play"; app ainda não publicado mostra "Em breve"  | Mínimo para apresentar e cumprir a Play; o link da loja só existe depois da publicação          | y          |
| Um app = um arquivo      | Cada app é um arquivo Markdown numa content collection do Astro (`src/content/apps/<slug>.md`), com nome, frase, ícone, link da loja e a política no corpo | Novo app sem mexer no layout                                                                    | y          |
| Endereço da política     | `/<slug>/privacidade`; o slug do OS Oficina é `osoficina` (o fim do `applicationId` `br.com.hc3solutions.osoficina`)                                 | Mesmo padrão para todos os apps                                                                 | y          |
| Conteúdo da política do OS Oficina | Os dados (oficina, clientes, veículos, OS, orçamentos, fornecedores) ficam só no aparelho; registros excluídos ficam marcados como excluídos no aparelho; sem coleta, envio a servidores, anúncios ou compartilhamento; a imagem do orçamento vai para a galeria e o WhatsApp é aberto pelo usuário; permissão usada (galeria, para salvar a imagem do orçamento; o app não usa câmera nem fotos); contato; data da última atualização | Reflete o app validado pelo QA (base local, sem sincronização); muda quando a sincronização entrar | y          |
| E-mail de contato        | `hc3solutions0@gmail.com`, no rodapé e na política                                                                                                  | Usuário: "Usar o da conta GitHub" e informou o endereço                                         | y          |
| Idioma e visual          | Português; uma página leve, responsiva, tema claro e escuro, sem fontes ou scripts de terceiros                                                      | Público brasileiro; sem terceiros o site não coleta dados                                       | y          |

**Open questions:** none - all resolved or logged above (required before the spec is confirmed).

---

## User Stories

### P1: Política de privacidade por app ⭐ MVP

**User Story**: Como dono dos apps, quero a política de cada app numa URL pública e estável, para preencher a ficha da Play Store.

**Why P1**: Sem a URL a Play não aceita a ficha do OS Oficina.

**Acceptance Criteria**:

1. The site SHALL publicar a política do OS Oficina em `/osoficina/privacidade`, em português, com o que o app guarda, onde guarda, que nada é coletado nem enviado a servidores, as permissões usadas, o contato e a data da última atualização. (SITE-01)
2. WHEN um arquivo de app novo é adicionado em `src/content/apps/` THEN o site SHALL publicar a política dele em `/<slug>/privacidade` sem outra mudança. (SITE-02)

**Independent Test**: Abrir `https://hc3solutions0.github.io/osoficina/privacidade` num navegador anônimo e ler a política.

---

### P1: Landing page da empresa ⭐ MVP

**User Story**: Como visitante, quero entender o que a HC3 Solutions faz e ver seus apps.

**Why P1**: Pedido do usuário; é a página que a ficha da loja e a página de desenvolvedor apontam.

**Acceptance Criteria**:

1. The página inicial SHALL mostrar o nome "HC3 Solutions", a seção "Sobre" e a lista de apps. (SITE-03)
2. The lista SHALL mostrar um cartão por app com nome, frase, ícone (arquivo existente em `public/`) e o link da política; com link da loja, "Baixar na Google Play"; sem ele, "Em breve". (SITE-04)
3. The site SHALL funcionar a partir de 320 px de largura, sem rolagem horizontal, e não carregar scripts, fontes ou imagens de terceiros. (SITE-05)

**Independent Test**: Abrir a página inicial no celular, ver o OS Oficina com "Em breve" e o link da política.

---

### P1: Publicação automática ⭐ MVP

**User Story**: Como dono do site, quero que um push na `main` publique o site sozinho.

**Why P1**: Sem isso cada mudança exigiria passos manuais.

**Acceptance Criteria**:

1. WHEN um commit chega à `main` THEN o GitHub Actions SHALL gerar o site com Astro e publicá-lo no GitHub Pages. (SITE-06)
2. IF o build falhar THEN o workflow SHALL falhar e o site publicado SHALL continuar na versão anterior. (SITE-07)

**Independent Test**: Mudar a frase do OS Oficina, fazer push e ver a mudança no site em poucos minutos.

---

## Edge Cases

- WHEN alguém abre um endereço que não existe THEN o site SHALL mostrar uma página 404 com link para a página inicial. (SITE-08)
- IF um arquivo de app não tiver nome, frase, ícone (ou apontar para um ícone inexistente), data de atualização ou política no corpo THEN o build SHALL falhar nomeando o campo faltante. (SITE-09)

---

## Requirement Traceability

| Requirement ID | Story          | Phase | Status  |
| -------------- | -------------- | ----- | ------- |
| SITE-01        | P1: Política   | Execute | Implemented |
| SITE-02        | P1: Política   | Execute | Implemented |
| SITE-03        | P1: Landing    | Execute | Implemented |
| SITE-04        | P1: Landing    | Execute | Implemented |
| SITE-05        | P1: Landing    | Execute | Implemented |
| SITE-06        | P1: Publicação | Execute | Implemented |
| SITE-07        | P1: Publicação | Execute | Implemented |
| SITE-08        | Edge case      | Execute | Implemented |
| SITE-09        | Edge case      | Execute | Implemented |

**Coverage:** 9 total, 9 mapped to the execution plan, 0 unmapped

---

## Sources

- Conversa de 2026-11-20: política num repositório da conta reaproveitado por outros projetos, hospedado no GitHub Pages, com landing page da empresa; respostas "HC3 Solutions", "Sobre (texto da loja), Lista de apps", "Usar o da conta GitHub", "Gerador (Astro/Jekyll)".
- `sistema_os_oficina/.specs/features/entrega-play-store/spec.md` - a ficha da loja usa a URL da política (REL-17).
- Astro, deploy no GitHub Pages: <https://docs.astro.build/en/guides/deploy/github/> (`withastro/action@v6`).

---

## Success Criteria

- [ ] A URL da política do OS Oficina abre em qualquer navegador e é aceita na ficha da Play Store.
- [ ] Adicionar um app novo ao site é criar um arquivo Markdown e fazer push.

---

## Execution Plan

Tasks skipped: um passo só, site novo sem dependências.

1. Site Astro 6 (minimal): coleção `apps` com schema, layout, página inicial, política por app, 404, workflow do Pages e `scripts/verificar.mjs` → verify: run site, run apps → commit: `feat(site): landing da hc3 solutions e política do os oficina`

**Build**: `npx astro build`
**Run site**: `npm test`
**Run apps**: `npm run verificar:apps`

Astro fixado em 6.4.8: o Astro 7 exige Node 22.23.4 e a máquina tem 22.23.1.

---

## Checks

**C1** - The site SHALL publicar a política do OS Oficina em `/osoficina/privacidade` com os trechos obrigatórios. (SITE-01, AC 1)
Proof: run site | ✓ SITE-01 política do OS Oficina em /osoficina/privacidade

**C2** - WHEN um arquivo de app novo é adicionado THEN o site SHALL publicar `/<slug>/privacidade` sem outra mudança. (SITE-02, AC 2)
Proof: run apps | ✓ SITE-02 app novo ganha /<slug>/privacidade só com o arquivo Markdown

**C3** - The página inicial SHALL mostrar "HC3 Solutions", "Sobre" e a lista de apps. (SITE-03, AC 1)
Proof: run site | ✓ SITE-03 página inicial com HC3 Solutions, Sobre e a lista de apps

**C4** - The cartão SHALL mostrar "Em breve" sem link da loja. (SITE-04, AC 2)
Proof: run site | ✓ SITE-04 cartão sem link da loja mostra Em breve e a política

**C5** - The cartão SHALL mostrar "Baixar na Google Play" com link da loja. (SITE-04, AC 2)
Proof: run apps | ✓ SITE-04 cartão com link da loja mostra Baixar na Google Play

**C6** - The site SHALL não carregar recursos de terceiros e SHALL ter viewport de celular. (SITE-05, AC 3)
Proof: run site | ✓ SITE-05 nenhum recurso de terceiros e viewport de celular

**C7** - WHEN um commit chega à `main` THEN o workflow SHALL gerar e publicar o site. (SITE-06, AC 1)
Proof: run site | ✓ SITE-06 push na main gera e publica o site

**C8** - IF o build falhar THEN o deploy SHALL não rodar. (SITE-07, AC 2)
Proof: run site | ✓ SITE-07 deploy só roda depois do build

**C9** - WHEN o endereço não existe THEN o site SHALL mostrar a 404 com link para o início. (SITE-08)
Proof: run site | ✓ SITE-08 página 404 com link para o início

**C10** - IF faltar um campo obrigatório THEN o build SHALL falhar nomeando o campo. (SITE-09)
Proof: run apps | ✓ SITE-09 app sem campo obrigatório faz o build falhar nomeando o campo
