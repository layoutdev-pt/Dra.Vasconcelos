import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Tipagem explícita 'Request' adicionada ao parâmetro 'req'
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      throw new Error("O parâmetro 'email' é obrigatório no payload do pedido.");
    }

    const CLOSUM_API_KEY = Deno.env.get('CLOSUM_API_KEY');

    if (!CLOSUM_API_KEY) {
      throw new Error("Variável CLOSUM_API_KEY não definida no ambiente Supabase.");
    }

    const closumResponse = await fetch('https://api.closum.com/v2/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CLOSUM_API_KEY}`
      },
      body: JSON.stringify({ email: email })
    });

    if (!closumResponse.ok) {
      const errorData = await closumResponse.text();
      throw new Error(`Rejeição da API do Closum: ${errorData}`);
    }

    return new Response(JSON.stringify({ success: true, message: "Subscrição validada." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  // Tipagem 'any' adicionada para contornar o tipo 'unknown'
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});