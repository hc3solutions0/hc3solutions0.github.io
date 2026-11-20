// Verifica o site gerado em dist/ contra a spec (.specs/features/site-hc3solutions/spec.md).
// Uso: `npm test` (gera o site e roda as verificações do conteúdo real) e `npm run verificar:apps`
// (gera cópias do site com apps de exemplo para provar SITE-02, SITE-04 e SITE-09).
// Cada verificação imprime "✓ <nome>" ou "✗ <nome>: <motivo>"; qualquer falha sai com código 1.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const RAIZ = resolve(import.meta.dirname, '..');
let falhas = 0;

function checar(nome, condicao, motivo) {
  if (condicao) {
    console.log(`✓ ${nome}`);
  } else {
    falhas += 1;
    console.log(`✗ ${nome}: ${motivo}`);
  }
}

function ler(dist, caminho) {
  const arquivo = join(dist, caminho);
  return existsSync(arquivo) ? readFileSync(arquivo, 'utf8') : '';
}

// Texto visível da página, sem tags e com espaços normalizados.
function texto(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|\s+/g, ' ');
}

function arquivosHtml(pasta) {
  return readdirSync(pasta, { recursive: true })
    .map(String)
    .filter((nome) => nome.endsWith('.html'));
}

// Copia o projeto para uma pasta temporária, com os apps de exemplo no lugar dos reais, e gera o
// site lá. Devolve { ok, saida, dist }.
function gerarComApps(apps) {
  const pasta = mkdtempSync(join(tmpdir(), 'site-hc3-'));
  for (const item of ['astro.config.mjs', 'package.json', 'tsconfig.json', 'src', 'public']) {
    cpSync(join(RAIZ, item), join(pasta, item), { recursive: true });
  }
  symlinkSync(join(RAIZ, 'node_modules'), join(pasta, 'node_modules'));
  const conteudo = join(pasta, 'src', 'content', 'apps');
  rmSync(conteudo, { recursive: true });
  cpSync(join(RAIZ, 'src', 'content', 'apps'), conteudo, { recursive: true, filter: () => true });
  for (const arquivo of readdirSync(conteudo)) rmSync(join(conteudo, arquivo));
  for (const [slug, md] of Object.entries(apps)) writeFileSync(join(conteudo, `${slug}.md`), md);
  try {
    const saida = execFileSync('npx', ['astro', 'build'], { cwd: pasta, encoding: 'utf8', stdio: 'pipe' });
    return { ok: true, saida, dist: join(pasta, 'dist'), pasta };
  } catch (erro) {
    return { ok: false, saida: `${erro.stdout ?? ''}${erro.stderr ?? ''}`, dist: join(pasta, 'dist'), pasta };
  }
}

function verificarSiteReal() {
  const dist = join(RAIZ, 'dist');
  const politica = texto(ler(dist, 'osoficina/privacidade/index.html'));
  checar(
    'SITE-01 política do OS Oficina em /osoficina/privacidade',
    [
      'Política de privacidade · OS Oficina',
      'Quais informações o app guarda',
      'Dados da oficina: nome e WhatsApp',
      'Clientes: nome, WhatsApp e observações',
      'Veículos: placa, marca, modelo, ano, cor, combustível, chassi e observações',
      'Ordens de serviço e orçamentos: quilometragem de entrada',
      'Fornecedores: nome e WhatsApp',
      'marcado como excluído',
      'Última atualização: 20/11/2026',
      'os dados ficam só no seu celular',
      'não envia nada para servidores',
      'Não mostra anúncios',
      'Permissões',
      'Fotos e mídia: usada apenas para salvar na galeria a imagem do orçamento',
      'não lê e não envia as fotos da sua galeria',
      'hc3solutions0@gmail.com',
    ].every((trecho) => politica.includes(trecho)),
    'página ausente ou sem algum trecho obrigatório',
  );

  const slugs = readdirSync(join(RAIZ, 'src', 'content', 'apps'))
    .filter((nome) => nome.endsWith('.md'))
    .map((nome) => nome.replace(/\.md$/, ''));
  checar(
    'SITE-02 cada app do conteúdo tem a página de política',
    slugs.length > 0 && slugs.every((slug) => existsSync(join(dist, slug, 'privacidade', 'index.html'))),
    `faltando: ${slugs.filter((slug) => !existsSync(join(dist, slug, 'privacidade', 'index.html'))).join(', ')}`,
  );

  const inicioHtml = ler(dist, 'index.html');
  const inicio = texto(inicioHtml);
  checar(
    'SITE-03 página inicial com HC3 Solutions, Sobre e a lista de apps',
    inicio.includes('HC3 Solutions') &&
      inicio.includes('Sobre') &&
      inicio.includes('pequenos problemas do dia a dia') &&
      inicio.includes('Nossos apps') &&
      inicioHtml.includes('data-app="osoficina"'),
    'falta nome, Sobre ou o cartão do OS Oficina',
  );

  const cartao = inicioHtml.match(/<li[^>]*data-app="osoficina"[\s\S]*?<\/li>/)?.[0] ?? '';
  const frase = readFileSync(join(RAIZ, 'src', 'content', 'apps', 'osoficina.md'), 'utf8').match(/^frase: (.+)$/m)?.[1] ?? '';
  checar(
    'SITE-04 cartão sem link da loja mostra Em breve e a política',
    cartao.includes('OS Oficina') &&
      frase !== '' &&
      texto(cartao).includes(frase) &&
      texto(cartao).includes('Em breve') &&
      !cartao.includes('Baixar na Google Play') &&
      cartao.includes('href="/osoficina/privacidade"') &&
      cartao.includes('src="/apps/osoficina.svg"'),
    'cartão do OS Oficina incompleto',
  );

  // Recursos carregados de outro endereço: em HTML (fora de <a>), CSS e SVG gerados.
  const externos = [];
  const EXTERNO = /^(https?:)?\/\//;
  const arquivos = readdirSync(dist, { recursive: true })
    .map(String)
    .filter((nome) => /\.(html|css|svg|js)$/.test(nome));
  for (const arquivo of arquivos) {
    const conteudo = readFileSync(join(dist, arquivo), 'utf8');
    const semLinks = conteudo.replace(/<a\s[^>]*>/g, '<a>');
    const recursos = [
      ...semLinks.matchAll(/\s(?:src|href|data|poster|action|xlink:href)\s*=\s*["']?([^"'\s>]+)/g),
      ...semLinks.matchAll(/\ssrcset\s*=\s*["']?([^"'>]+)/g),
      ...semLinks.matchAll(/url\(\s*['"]?([^'")]+)/g),
      ...semLinks.matchAll(/@import\s*(?:url\()?\s*['"]?([^'");\s]+)/g),
    ].flatMap((achado) => achado[1].split(',').map((parte) => parte.trim().split(/\s+/)[0]));
    for (const recurso of recursos) {
      if (EXTERNO.test(recurso) && !recurso.startsWith('http://www.w3.org/')) externos.push(`${arquivo}: ${recurso}`);
    }
    // Larguras fixas acima de 320 px (fora das condições de @media) causam rolagem lateral no celular.
    for (const [, propriedade, valor] of conteudo.matchAll(/[{;]\s*(min-width|width)\s*:\s*(\d+)px/g)) {
      if (Number(valor) > 320) externos.push(`${arquivo}: ${propriedade} ${valor}px`);
    }
    if (arquivo.endsWith('.html') && !conteudo.includes('<meta name="viewport" content="width=device-width, initial-scale=1"')) {
      externos.push(`${arquivo}: sem meta viewport`);
    }
  }
  checar('SITE-05 nenhum recurso de terceiros e viewport de celular', externos.length === 0, externos.join('; '));

  const workflow = ler(RAIZ, '.github/workflows/deploy.yml');
  checar(
    'SITE-06 push na main gera e publica o site',
    /on:\s*\n\s*push:\s*\n\s*branches: \[main\]/.test(workflow) &&
      workflow.includes('run: npm test') &&
      workflow.includes('actions/upload-pages-artifact') &&
      workflow.includes('actions/deploy-pages') &&
      workflow.includes('path: dist'),
    'workflow sem gatilho na main, build ou deploy',
  );
  checar(
    'SITE-07 deploy só roda depois do build',
    /deploy:\s*\n\s*needs: build/.test(workflow) &&
      !/^\s*if:/m.test(workflow.slice(workflow.indexOf('\n  deploy:'))) &&
      workflow.indexOf('npm test') < workflow.indexOf('upload-pages-artifact'),
    'deploy não depende do build',
  );

  const pagina404 = ler(dist, '404.html');
  checar(
    'SITE-08 página 404 com link para o início',
    texto(pagina404).includes('Página não encontrada') &&
      /<a href="\/">Voltar para a página inicial<\/a>/.test(pagina404),
    '404.html ausente ou sem link para /',
  );
}

const APP_PUBLICADO = `---
nome: App Publicado
frase: Um app que já está na loja.
icone: /apps/osoficina.svg
loja: https://play.google.com/store/apps/details?id=br.com.hc3solutions.publicado
atualizadoEm: 2026-01-02
---

Texto da política do app publicado.
`;

function verificarAppsDeExemplo() {
  const novo = gerarComApps({ publicado: APP_PUBLICADO });
  const politica = texto(ler(novo.dist, 'publicado/privacidade/index.html'));
  checar(
    'SITE-02 app novo ganha /<slug>/privacidade só com o arquivo Markdown',
    novo.ok &&
      politica.includes('Política de privacidade · App Publicado') &&
      politica.includes('Última atualização: 02/01/2026') &&
      politica.includes('Texto da política do app publicado.'),
    novo.ok ? 'página do app novo ausente ou incompleta' : novo.saida.slice(-500),
  );
  const cartao = ler(novo.dist, 'index.html').match(/<li[^>]*data-app="publicado"[\s\S]*?<\/li>/)?.[0] ?? '';
  checar(
    'SITE-04 cartão com link da loja mostra Baixar na Google Play',
    cartao.includes('href="https://play.google.com/store/apps/details?id=br.com.hc3solutions.publicado"') &&
      texto(cartao).includes('Baixar na Google Play') &&
      !texto(cartao).includes('Em breve') &&
      cartao.includes('href="/publicado/privacidade"'),
    'cartão do app publicado sem o link da loja',
  );
  rmSync(novo.pasta, { recursive: true, force: true });

  const faltando = [];
  for (const campo of ['nome', 'frase', 'icone', 'atualizadoEm']) {
    const md = APP_PUBLICADO.split('\n')
      .filter((linha) => !linha.startsWith(`${campo}:`))
      .join('\n');
    const resultado = gerarComApps({ incompleto: md });
    if (resultado.ok || !resultado.saida.includes(campo)) faltando.push(campo);
    rmSync(resultado.pasta, { recursive: true, force: true });
  }
  const semPolitica = gerarComApps({ vazio: APP_PUBLICADO.replace('Texto da política do app publicado.', '') });
  if (semPolitica.ok || !semPolitica.saida.includes('política de privacidade vazia')) faltando.push('política');
  rmSync(semPolitica.pasta, { recursive: true, force: true });
  const iconeInexistente = gerarComApps({ semicone: APP_PUBLICADO.replace('/apps/osoficina.svg', '/apps/nao-existe.svg') });
  if (iconeInexistente.ok || !iconeInexistente.saida.includes('icone')) faltando.push('icone inexistente');
  rmSync(iconeInexistente.pasta, { recursive: true, force: true });
  checar(
    'SITE-09 app sem campo obrigatório faz o build falhar nomeando o campo',
    faltando.length === 0,
    `build passou ou não nomeou: ${faltando.join(', ')}`,
  );
}

if (process.argv.includes('--apps')) {
  verificarAppsDeExemplo();
} else {
  verificarSiteReal();
}
process.exitCode = falhas === 0 ? 0 : 1;
