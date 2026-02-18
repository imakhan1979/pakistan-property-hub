
-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('house', 'apartment', 'office', 'plot')),
  purpose TEXT NOT NULL CHECK (purpose IN ('buy', 'rent')),
  price NUMERIC NOT NULL,
  price_label TEXT NOT NULL,
  area NUMERIC NOT NULL,
  area_unit TEXT NOT NULL DEFAULT 'sqft' CHECK (area_unit IN ('sqft', 'sqyd', 'marla', 'kanal')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking INTEGER,
  furnished BOOLEAN DEFAULT false,
  city TEXT NOT NULL DEFAULT 'Karachi',
  location TEXT NOT NULL,
  block TEXT,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  whatsapp TEXT,
  video_link TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  featured BOOLEAN DEFAULT false,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Published properties are readable by everyone
CREATE POLICY "Anyone can view published properties"
  ON public.properties FOR SELECT
  USING (status = 'published');

-- Admins can view all properties
CREATE POLICY "Admins can view all properties"
  ON public.properties FOR SELECT
  USING (public.is_admin());

-- Admins can insert properties
CREATE POLICY "Admins can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (public.is_admin());

-- Admins can update properties
CREATE POLICY "Admins can update properties"
  ON public.properties FOR UPDATE
  USING (public.is_admin());

-- Admins can delete properties
CREATE POLICY "Admins can delete properties"
  ON public.properties FOR DELETE
  USING (public.is_admin());

-- Agents can view properties assigned to them or all published
CREATE POLICY "Agents can view their own properties"
  ON public.properties FOR SELECT
  USING (agent_id = public.get_agent_id());

-- Agents can insert properties
CREATE POLICY "Agents can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (agent_id = public.get_agent_id());

-- Agents can update their own properties
CREATE POLICY "Agents can update their own properties"
  ON public.properties FOR UPDATE
  USING (agent_id = public.get_agent_id());

-- Create profiles table for user display names
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger function (create if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for properties
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed sample properties from Pakistan real estate market
INSERT INTO public.properties (title, type, purpose, price, price_label, area, area_unit, bedrooms, bathrooms, parking, furnished, city, location, block, description, images, features, whatsapp, status, featured) VALUES
(
  '5 Bedroom Luxury Villa — DHA Phase 6',
  'house', 'buy', 85000000, 'PKR 8.5 Crore', 500, 'sqyd', 5, 6, 3, false,
  'Karachi', 'DHA Phase 6', 'Block K',
  'Stunning corner villa with spacious lawns, modern kitchen, and premium finishes throughout. Ideal for families seeking luxury living in DHA Phase 6.',
  ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
  ARRAY['Corner Plot','Servant Quarters','Backup Generator','Solar Panels','Marble Flooring','Home Automation'],
  '+923001234567', 'published', true
),
(
  'Modern 3BR Apartment — Clifton Block 5',
  'apartment', 'rent', 120000, 'PKR 1.2 Lac/month', 2200, 'sqft', 3, 3, 1, true,
  'Karachi', 'Clifton Block 5', NULL,
  'Fully furnished sea-facing apartment with panoramic views, modern kitchen, and 24/7 security. Walking distance to top restaurants and malls.',
  ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
  ARRAY['Sea View','Fully Furnished','Gym Access','24/7 Security','Backup Generator','Covered Parking'],
  '+923219876543', 'published', true
),
(
  'Prime Commercial Office — PECHS Block 6',
  'office', 'buy', 45000000, 'PKR 4.5 Crore', 3500, 'sqft', NULL, NULL, 5, false,
  'Karachi', 'PECHS', 'Block 6',
  'Premium commercial space on main Shahrah-e-Faisal ideal for corporate offices, banks, or high-footfall businesses.',
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80','https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80'],
  ARRAY['Main Road Frontage','Open Plan','Dedicated Parking','Fiber Internet','Central AC','Security Cameras'],
  '+923335551234', 'published', false
),
(
  '4 Bedroom House — Bahria Town',
  'house', 'buy', 55000000, 'PKR 5.5 Crore', 10, 'marla', 4, 4, 2, false,
  'Karachi', 'Bahria Town', 'Precinct 15',
  'Beautifully designed 10 Marla house in gated community with 24/7 security, underground electricity, and community amenities.',
  ARRAY['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80','https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
  ARRAY['Gated Community','Underground Electricity','Masjid Nearby','Park Facing','Roof Deck','Store Room'],
  '+923001234567', 'published', true
),
(
  'Commercial Plot — DHA Phase 8',
  'plot', 'buy', 120000000, 'PKR 12 Crore', 1000, 'sqyd', NULL, NULL, NULL, false,
  'Karachi', 'DHA Phase 8', 'Zone A',
  '1000 Sq Yd commercial corner plot on main boulevard in DHA Phase 8. Ideal for mixed-use development, retail, or corporate HQ.',
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
  ARRAY['Corner Plot','Main Boulevard','Commercial Zoning','All Utilities','Easy Access'],
  '+923457778901', 'published', false
),
(
  '2BR Serviced Apartment — Clifton Block 9',
  'apartment', 'rent', 75000, 'PKR 75K/month', 1400, 'sqft', 2, 2, NULL, true,
  'Karachi', 'Clifton Block 9', NULL,
  'Stylish serviced apartment with modern décor, all appliances included. Monthly maid service and maintenance included in rent.',
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80','https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
  ARRAY['Fully Furnished','Maid Service Included','High-Speed WiFi','Cable TV','Gym Access','Rooftop Pool'],
  '+923219876543', 'published', false
);

-- Also allow agents to view all published (merge with admin policy using OR logic)
-- Drop conflicting select policies and recreate a clean unified one
DROP POLICY IF EXISTS "Anyone can view published properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON public.properties;
DROP POLICY IF EXISTS "Agents can view their own properties" ON public.properties;

CREATE POLICY "Select policy for properties"
  ON public.properties FOR SELECT
  USING (
    status = 'published'
    OR public.is_admin()
    OR agent_id = public.get_agent_id()
  );
