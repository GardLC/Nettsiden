import { defineCollection, z } from 'astro:content';

const artikler = defineCollection({
  type: 'content',
  schema: z.object({
    tittel: z.string(),
    ingress: z.string(),
    publisert: z.date(),
    oppdatert: z.date().optional(),
    tema: z.array(z.string()).optional(),
    utkast: z.boolean().default(false),
  }),
});

export const collections = { artikler };
