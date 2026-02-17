import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const { email, password, name, phone, setupKey } = await req.json();

    // Simple setup protection — require a setup key
    if (setupKey !== Deno.env.get('ADMIN_SETUP_KEY')) {
      return new Response(JSON.stringify({ error: 'Invalid setup key' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!email || !password || !name) {
      return new Response(JSON.stringify({ error: 'email, password, name are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create auth user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email, password, email_confirm: true,
    });

    if (userError) throw userError;
    const userId = userData.user!.id;

    // Create agent profile
    const { data: agentData, error: agentError } = await supabaseAdmin
      .from('agents')
      .insert({ user_id: userId, name, phone: phone ?? null, email })
      .select('id')
      .single();

    if (agentError) throw agentError;

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' });

    if (roleError) throw roleError;

    return new Response(JSON.stringify({
      success: true,
      message: `Admin user "${name}" created successfully. You can now log in at /admin/login.`,
      userId,
      agentId: agentData.id,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
