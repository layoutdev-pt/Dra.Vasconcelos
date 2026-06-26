import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    // NOVO: Adicionado o list_id para ser recebido do front-end
    const { email, name, phone, list_id } = body;

    if (!email) {
      throw new Error("O parâmetro 'email' é obrigatório no payload do pedido.");
    }

    const CLOSUM_API_KEY = Deno.env.get('CLOSUM_API_KEY');

    if (!CLOSUM_API_KEY) {
      throw new Error("Variável CLOSUM_API_KEY não definida no ambiente Supabase.");
    }

    const requestUrl = `https://api.closum.com/v2/lead/add/?api-key=${CLOSUM_API_KEY}`;
    
    // Payload dinâmico base
    const closumPayload: Record<string, unknown> = {
      email: email,
      consent_email: true,
      consent_sms: phone ? true : false // Assume consentimento SMS se o telemóvel for fornecido ativamente no formulário
    };

    if (name) {
      closumPayload.name = name;
    }

    if (phone) {
      closumPayload.mobile_number = phone;
    }

    // NOVO: Se o site enviar um list_id, adicionamos ao payload do Closum
    if (list_id) {
      closumPayload.list_id = list_id;
    }

    const closumResponse = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(closumPayload)
    });

    const rawResponseText = await closumResponse.text();

    if (!closumResponse.ok) {
      console.warn(`Aviso do Closum: ${rawResponseText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});