import { defineCollection, z } from 'astro:content';

const artikler = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    description: z.string(),
    type: z.enum(['artikkel', 'infographic']),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const prosjekter = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    year: z.number(),
    description: z.string(),
    methods: z.array(z.string()),
    outcome: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { artikler, prosjekter };
