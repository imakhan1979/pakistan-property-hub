import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are an expert real estate assistant for Estate Bnk, a premium real estate company operating in Karachi, Pakistan. You specialize in areas like DHA (Defence Housing Authority), Clifton, Bahria Town, PECHS, Gulshan-e-Iqbal, and other prime Karachi locations.

Your role:
1. Help customers find properties (houses, apartments, offices, plots) for sale or rent
2. Answer questions about areas, prices, buying/renting process in Pakistan
3. Collect lead information (name + mobile) when users want to speak to an agent
4. Recommend property types based on budget and requirements
5. Explain legal processes, documentation, and transfer procedures in Pakistan

Key facts about Estate Bnk:
- Office: DHA Phase 5, Main Gizri Road, Karachi
- Phone: +92-21-3580-0000
- WhatsApp: +92-300-1234567
- Office Hours: Mon–Sat 9AM–7PM, Sunday 11AM–4PM
- Specializes in: DHA, Clifton, Bahria Town, PECHS, Gulshan-e-Iqbal
- Services: Buying, Selling, Renting, Investment advisory, Legal due diligence

Price ranges (PKR):
- Apartments for rent: 50K–200K/month
- Houses for rent: 80K–500K/month
- Apartments for sale: 1–5 Crore
- Houses for sale: 3–20+ Crore
- Commercial plots: 5–50+ Crore

Always be helpful, professional, and respond in the same language the customer uses (Urdu or English). Keep responses concise. If a user wants to speak to an agent, ask for their name and mobile number.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { messages } = await req.json();

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI gateway error: ${err}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't process your request. Please contact us directly at +92-21-3580-0000.";

    return new Response(JSON.stringify({ reply }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({
        reply: "I'm having trouble connecting right now. Please call us at +92-21-3580-0000 or WhatsApp +92-300-1234567.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
