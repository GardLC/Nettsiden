import { defineCollection, z } from 'astro:content';

const artikler = defineCollection({
  type: 'content',
  schema: z.object({
    tittel: z.string(),
    publisert: z.date(),
    ingress: z.string(),
    type: z.enum(['artikkel', 'infographic']),
    headerbilde: z.string().optional(),
    tema: z.array(z.string()).optional(),
    utkast: z.boolean().default(false),
  }),
});

const prosjekter = defineCollection({
  type: 'content',
  schema: z.object({
    tittel: z.string(),
    oppdragsgiver: z.string(),
    år: z.number(),
    ingress: z.string(),
    metoder: z.array(z.string()),
    resultat: z.string(),
    rekkefølge: z.number(),
    utkast: z.boolean().default(false),
  }),
});

export const collections = { artikler, prosjekter };
