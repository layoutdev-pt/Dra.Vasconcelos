import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { email, name, phone, list_id } = body;

    if (!email) {
      throw new Error("O parâmetro 'email' é obrigatório.");
    }

    const CLOSUM_API_KEY = Deno.env.get('CLOSUM_API_KEY');

    if (!CLOSUM_API_KEY) {
      throw new Error("Variável CLOSUM_API_KEY não definida no ambiente.");
    }

    const requestUrl = `https://api.closum.com/v2/lead/add/?api-key=${CLOSUM_API_KEY}`;
    
    const closumPayload: Record<string, unknown> = {
      email: email,
      consent_email: true,
      consent_sms: !!phone,
      update_enabled: true // Evita erros se a lead já existir
    };

    if (name) closumPayload.name = name;
    if (phone) closumPayload.mobile_number = phone;
    
    // A JOGADA DE MESTRE: Transformar a intenção do list_id numa TAG
    if (list_id) {
      closumPayload.tags = ["Newsletter"]; 
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
      throw new Error(`HTTP Error: ${closumResponse.status} - ${rawResponseText}`);
    }

    try {
      const jsonResponse = JSON.parse(rawResponseText);
      if (jsonResponse.success === false) {
        throw new Error(`O Closum rejeitou: ${rawResponseText}`);
      }
    } catch (e) {
      // Ignora erro de parse caso a resposta não seja um JSON puro
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: unknown) {
    console.error("Erro na função:", error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, 
    });
  }
});