// // api/og-bot.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseKey);

// export default async function handler(req: any, res: any) {
//   const { slug } = req.query;

//   // 1. Consultar a base de dados pelo curso específico
//   const { data, error } = await supabase
//     .from('courses') // Substitua pelo nome exato da sua tabela de cursos
//     .select('title, description, image_url') // Substitua pelos nomes exatos das colunas
//     .eq('slug', slug)
//     .single();

//   // 2. Se falhar ou não encontrar o curso, devolve o fallback
//   if (error || !data) {
//     return res.status(200).send(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta property="og:title" content="Dra. Alexandra Vasconcelos - Cursos" />
//         </head>
//         <body></body>
//       </html>
//     `);
//   }

//   // 3. Devolver HTML cru injetado com os dados dinâmicos do Supabase
//   const html = `
//     <!doctype html>
//     <html lang="pt-PT">
//       <head>
//         <meta charset="UTF-8" />
//         <title>${data.title} | Dra. Vasconcelos</title>
//         <meta property="og:title" content="${data.title}" />
//         <meta property="og:description" content="${data.description}" />
//         <meta property="og:image" content="${data.image_url}" />
//         <meta property="og:url" content="https://www.draalexandravasconcelos.pt/cursos/${slug}" />
//         <meta property="og:type" content="website" />
//         <meta name="twitter:card" content="summary_large_image" />
//       </head>
//       <body>
//         </body>
//     </html>
//   `;

//   // Define cache agressiva na Vercel para não sobrecarregar o Supabase em partilhas virais
//   res.setHeader('Content-Type', 'text/html; charset=utf-8');
//   res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
//   res.status(200).send(html);
// }