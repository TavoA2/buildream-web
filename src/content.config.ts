import fs from 'node:fs';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const serviceId = z.enum(['cloud-devops', 'ai-strategy', 'web-chatbot', 'automation', 'workshops']);

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    id: serviceId,
    title: z.string(),
    summary: z.string(),
    icon: z.string(),
    order: z.number(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      type: z.enum(['own', 'demo', 'client']),
      tags: z.array(z.string()),
      url: z.url().optional(),
      repo: z.url().optional(),
      image: image().optional(),
      order: z.number(),
      draft: z.boolean().default(false),
    }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({ question: z.string(), order: z.number() }),
});

// Empty on purpose until real testimonials exist (see TODO-CONTENT.md).
// glob() logs a WARN when nothing matches, so skip it while the dir holds no .md files.
const testimonialsDir = './src/content/testimonials';
const hasTestimonials = (dir: string): boolean =>
  fs.existsSync(dir) &&
  fs.readdirSync(dir, { recursive: true, encoding: 'utf8' }).some((f) => f.endsWith('.md'));

const testimonials = defineCollection({
  loader: hasTestimonials(testimonialsDir)
    ? glob({ pattern: '**/*.md', base: testimonialsDir })
    : { name: 'empty-testimonials', load: async () => {} },
  schema: z.object({
    name: z.string(),
    role: z.string(),
    quote: z.string(),
    published: z.boolean().default(false),
  }),
});

export const collections = { services, projects, faq, testimonials };
