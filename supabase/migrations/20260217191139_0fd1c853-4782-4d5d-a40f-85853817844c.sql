
-- 1. Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'agent');

-- 2. User roles table (roles stored separately for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Agents/profiles table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- 4. Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  whatsapp_opt_in BOOLEAN NOT NULL DEFAULT false,
  preferred_contact_time TEXT,
  interest_types TEXT[] NOT NULL DEFAULT '{}',
  locations TEXT[] NOT NULL DEFAULT '{}',
  budget_min BIGINT,
  budget_max BIGINT,
  budget_flexible BOOLEAN NOT NULL DEFAULT false,
  intentions TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website','call','whatsapp','walk-in','referral','social')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','site-visit','negotiation','won','lost')),
  assigned_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 5. Lead activity log
CREATE TABLE public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- 'note', 'call', 'status_change', 'assignment'
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- 6. Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 7. Helper: get agent id for current user
CREATE OR REPLACE FUNCTION public.get_agent_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.agents WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 8. Timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. RLS Policies: user_roles
CREATE POLICY "Users can view own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10. RLS Policies: agents
CREATE POLICY "Anyone authenticated can view agents"
  ON public.agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert agents"
  ON public.agents FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins or self can update agent"
  ON public.agents FOR UPDATE
  TO authenticated
  USING (public.is_admin() OR user_id = auth.uid());

CREATE POLICY "Admins can delete agents"
  ON public.agents FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 11. RLS Policies: leads
CREATE POLICY "Admins can do all on leads"
  ON public.leads FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Agents can view assigned leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (assigned_agent_id = public.get_agent_id());

CREATE POLICY "Agents can insert leads"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin() OR 
    assigned_agent_id = public.get_agent_id() OR
    assigned_agent_id IS NULL
  );

CREATE POLICY "Agents can update assigned leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (assigned_agent_id = public.get_agent_id())
  WITH CHECK (assigned_agent_id = public.get_agent_id());

-- 12. RLS Policies: lead_activities
CREATE POLICY "Admins can do all on activities"
  ON public.lead_activities FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Agents can view activities on assigned leads"
  ON public.lead_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = lead_id AND leads.assigned_agent_id = public.get_agent_id()
    )
  );

CREATE POLICY "Agents can insert activities on assigned leads"
  ON public.lead_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.leads
      WHERE leads.id = lead_id AND leads.assigned_agent_id = public.get_agent_id()
    )
  );
