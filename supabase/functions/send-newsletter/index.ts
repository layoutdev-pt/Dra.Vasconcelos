// @ts-nocheck — Este ficheiro corre no Deno (Supabase Edge Functions), não no Node.js
// supabase/functions/send-newsletter/index.ts
// Sends newsletter email to all active subscribers when a new blog post is published
declare const Deno: { env: { get(key: string): string | undefined } };

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { newsletterEmail } from '../_shared/email-templates.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { post_id } = await req.json();

    if (!post_id) {
      return new Response(
        JSON.stringify({ error: 'post_id é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch the blog post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id, title, slug, summary, content, image_url')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      return new Response(
        JSON.stringify({ error: 'Post não encontrado', details: postError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Fetch all active subscribers
    const { data: subscribers, error: subsError } = await supabase
      .from('leads')
      .select('email')
      .eq('subscribed', true);

    if (subsError) {
      return new Response(
        JSON.stringify({ error: 'Erro ao buscar subscritores', details: subsError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'Nenhum subscritor ativo encontrado', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Generate the dynamic email HTML
    const emailHtml = newsletterEmail({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      image_url: post.image_url,
      content: post.content,
    });

    // 4. Send emails in batches of 50 (Resend batch limit)
    const emails = subscribers.map((s: { email: string }) => s.email);
    const BATCH_SIZE = 50;
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      
      // Send each email individually using Resend (BCC approach for privacy)
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Dra. Alexandra Vasconcelos <onboarding@resend.dev>',
          to: ['onboarding@resend.dev'], // Send to self
          bcc: batch, // All subscribers in BCC for privacy
          subject: `📬 ${post.title}`,
          html: emailHtml,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        totalSent += batch.length;
      } else {
        console.error('Resend batch error:', data);
        errors.push(`Batch ${i}-${i + batch.length}: ${JSON.stringify(data)}`);
      }
    }

    // 5. Mark the post as newsletter sent
    await supabase
      .from('posts')
      .update({ 
        newsletter_sent: true, 
        newsletter_sent_at: new Date().toISOString() 
      })
      .eq('id', post_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter enviada para ${totalSent} subscritores`,
        sent: totalSent,
        total_subscribers: emails.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
