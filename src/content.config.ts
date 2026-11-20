// Um arquivo Markdown por app em src/content/apps/<slug>.md: os dados do cartão no frontmatter e a
// política de privacidade no corpo. O slug vira o endereço /<slug>/privacidade (SITE-02). Um campo
// faltante faz o build falhar com o nome do campo (SITE-09).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const apps = defineCollection({
  loader: glob({ base: './src/content/apps', pattern: '*.md' }),
  schema: z.object({
    nome: z.string().min(1),
    frase: z.string().min(1),
    // Caminho de uma imagem em public/, por exemplo /apps/osoficina.svg.
    icone: z.string().startsWith('/'),
    // Endereço do app na Google Play; ausente enquanto o app não foi publicado.
    loja: z.string().url().optional(),
    // Data da última atualização da política.
    atualizadoEm: z.coerce.date(),
    // Ordem na lista da página inicial.
    ordem: z.number().int().default(0),
  }),
});

export const collections = { apps };
