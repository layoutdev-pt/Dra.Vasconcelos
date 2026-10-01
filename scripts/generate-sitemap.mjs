// Gera public/sitemap.xml (protocolo sitemaps.org 0.9) a partir das rotas
// estáticas do site e dos cursos/artigos publicados no Supabase.
// Corre automaticamente antes de cada build (`npm run build`) ou à mão com
// `npm run sitemap`.
import 'dotenv/config';
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://www.draalexandravasconcelos.pt';
const OUTPUT = resolve(dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml');
const today = new Date().toISOString().slice(0, 10);

// Rotas públicas definidas em src/App.tsx (sem /entrar, /perfil e /admin).
const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/sobre', changefreq: 'monthly', priority: '0.8' },
  { path: '/consultas', changefreq: 'monthly', priority: '0.9' },
  { path: '/cursos', changefreq: 'weekly', priority: '0.9' },
  { path: '/livros', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/midia', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacidade', changefreq: 'yearly', priority: '0.2' },
  { path: '/cookies', changefreq: 'yearly', priority: '0.2' },
  { path: '/termos', changefreq: 'yearly', priority: '0.2' },
  { path: '/termos-envio', changefreq: 'yearly', priority: '0.2' },
  { path: '/resolucao-litigios', changefreq: 'yearly', priority: '0.2' },
];

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toDate = (...values) => {
  for (const value of values) {
    if (!value) continue;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  }
  return today;
};

const urlEntry = ({ path, lastmod, changefreq, priority }) => `  <url>
    <loc>${escapeXml(SITE_URL + encodeURI(path))}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

async function fetchDynamicRoutes() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY em falta');

  const supabase = createClient(url, key);

  const [courses, posts] = await Promise.all([
    supabase.from('courses').select('*').eq('is_published', true),
    supabase.from('blog_posts').select('*').eq('is_published', true),
  ]);
  if (courses.error) throw courses.error;
  if (posts.error) throw posts.error;

  const courseRoutes = courses.data.map((c) => ({
    path: `/cursos/${c.slug || c.id}`,
    lastmod: toDate(c.updated_at, c.published_at, c.created_at),
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const postRoutes = posts.data
    .filter((p) => p.slug)
    .map((p) => ({
      path: `/blog/${p.slug}`,
      lastmod: toDate(p.updated_at, p.published_at, p.created_at),
      changefreq: 'monthly',
      priority: '0.7',
    }));

  return [...courseRoutes, ...postRoutes];
}

async function main() {
  let dynamicRoutes;
  try {
    dynamicRoutes = await fetchDynamicRoutes();
  } catch (err) {
    // Sem acesso ao Supabase não estragamos o build: mantém-se o sitemap anterior.
    if (existsSync(OUTPUT)) {
      console.warn(`[sitemap] Supabase indisponível (${err.message}); mantém-se o sitemap existente.`);
      return;
    }
    console.warn(`[sitemap] Supabase indisponível (${err.message}); gerado só com as páginas estáticas.`);
    dynamicRoutes = [];
  }

  const seen = new Set();
  const routes = [...STATIC_ROUTES.map((r) => ({ ...r, lastmod: today })), ...dynamicRoutes].filter((r) => {
    if (seen.has(r.path)) return false;
    seen.add(r.path);
    return true;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(urlEntry).join('\n')}
</urlset>
`;

  writeFileSync(OUTPUT, xml, 'utf8');
  console.log(`[sitemap] ${routes.length} URLs escritas em public/sitemap.xml`);
}

main();
