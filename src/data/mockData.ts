export interface Property {
  id: string;
  title: string;
  type: 'house' | 'apartment' | 'office' | 'plot';
  purpose: 'buy' | 'rent';
  price: number;
  priceLabel: string;
  area: number;
  areaUnit: 'sqft' | 'sqyd' | 'marla' | 'kanal';
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  furnished?: boolean;
  city: string;
  location: string;
  block?: string;
  description: string;
  images: string[];
  features: string[];
  agent: Agent;
  status: 'draft' | 'review' | 'published';
  featured: boolean;
  createdAt: string;
  whatsapp?: string;
  videoLink?: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  leadsCount?: number;
  role: 'admin' | 'agent';
}

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  whatsappOptIn: boolean;
  preferredContactTime?: string;
  interestTypes: string[];
  locations: string[];
  budgetMin?: number;
  budgetMax?: number;
  budgetFlexible: boolean;
  intentions: string[];
  notes?: string;
  source: 'website' | 'call' | 'whatsapp' | 'walk-in' | 'referral' | 'social';
  status: 'new' | 'contacted' | 'qualified' | 'site-visit' | 'negotiation' | 'won' | 'lost';
  assignedAgent?: string;
  createdAt: string;
  lastActivity: string;
}

export const LOCATIONS = ['DHA Phase 1', 'DHA Phase 2', 'DHA Phase 5', 'DHA Phase 6', 'DHA Phase 8', 'Clifton Block 1', 'Clifton Block 5', 'Clifton Block 9', 'Gulshan-e-Iqbal', 'PECHS', 'Bahria Town', 'North Nazimabad', 'Scheme 33', 'Malir Cantonment', 'Saddar'];

export const INTEREST_TYPES = ['Office Buyout', 'Office Rental', 'House Buyout', 'House Rental', 'Apartment Buyout', 'Apartment Rental', 'Plot Buyout'];

export const INTENTIONS = ['Personal Living', 'Investment', 'Buy & Rent', 'Short-term Rental', 'Long-term Rental'];

export const PIPELINE_STAGES = ['new', 'contacted', 'qualified', 'site-visit', 'negotiation', 'won', 'lost'] as const;

export const agents: Agent[] = [
  { id: 'a1', name: 'Ahmed Raza', phone: '+92-300-1234567', email: 'ahmed@eliteproperties.pk', leadsCount: 12, role: 'agent' },
  { id: 'a2', name: 'Fatima Khan', phone: '+92-321-9876543', email: 'fatima@eliteproperties.pk', leadsCount: 8, role: 'agent' },
  { id: 'a3', name: 'Usman Ali', phone: '+92-333-5551234', email: 'usman@eliteproperties.pk', leadsCount: 15, role: 'agent' },
  { id: 'a4', name: 'Sara Sheikh', phone: '+92-345-7778901', email: 'sara@eliteproperties.pk', leadsCount: 6, role: 'admin' },
];

export const properties: Property[] = [
  {
    id: 'p1',
    title: '5 Bedroom Luxury Villa — DHA Phase 6',
    type: 'house',
    purpose: 'buy',
    price: 85000000,
    priceLabel: 'PKR 8.5 Crore',
    area: 500,
    areaUnit: 'sqyd',
    bedrooms: 5,
    bathrooms: 6,
    parking: 3,
    furnished: false,
    city: 'Karachi',
    location: 'DHA Phase 6',
    block: 'Block K',
    description: 'Stunning corner villa with spacious lawns, modern kitchen, and premium finishes throughout. Ideal for families seeking luxury living in DHA Phase 6.',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    features: ['Corner Plot', 'Servant Quarters', 'Backup Generator', 'Solar Panels', 'Marble Flooring', 'Home Automation'],
    agent: agents[0],
    status: 'published',
    featured: true,
    createdAt: '2024-12-01',
    whatsapp: '+923001234567',
  },
  {
    id: 'p2',
    title: 'Modern 3BR Apartment — Clifton Block 5',
    type: 'apartment',
    purpose: 'rent',
    price: 120000,
    priceLabel: 'PKR 1.2 Lac/month',
    area: 2200,
    areaUnit: 'sqft',
    bedrooms: 3,
    bathrooms: 3,
    parking: 1,
    furnished: true,
    city: 'Karachi',
    location: 'Clifton Block 5',
    description: 'Fully furnished sea-facing apartment with panoramic views, modern kitchen, and 24/7 security. Walking distance to top restaurants and malls.',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
    features: ['Sea View', 'Fully Furnished', 'Gym Access', '24/7 Security', 'Backup Generator', 'Covered Parking'],
    agent: agents[1],
    status: 'published',
    featured: true,
    createdAt: '2024-12-05',
    whatsapp: '+923219876543',
  },
  {
    id: 'p3',
    title: 'Prime Commercial Office — PECHS Block 6',
    type: 'office',
    purpose: 'buy',
    price: 45000000,
    priceLabel: 'PKR 4.5 Crore',
    area: 3500,
    areaUnit: 'sqft',
    city: 'Karachi',
    location: 'PECHS',
    block: 'Block 6',
    description: 'Premium commercial space on main Shahrah-e-Faisal ideal for corporate offices, banks, or high-footfall businesses. Ground floor with dedicated signage.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80'],
    features: ['Main Road Frontage', 'Open Plan', 'Dedicated Parking', 'Fiber Internet', 'Central AC', 'Security Cameras'],
    agent: agents[2],
    status: 'published',
    featured: false,
    createdAt: '2024-11-28',
    whatsapp: '+923335551234',
  },
  {
    id: 'p4',
    title: '4 Bedroom House — Bahria Town',
    type: 'house',
    purpose: 'buy',
    price: 55000000,
    priceLabel: 'PKR 5.5 Crore',
    area: 10,
    areaUnit: 'marla',
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    furnished: false,
    city: 'Karachi',
    location: 'Bahria Town',
    block: 'Precinct 15',
    description: 'Beautifully designed 10 Marla house in gated community with 24/7 security, underground electricity, and community amenities.',
    images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
    features: ['Gated Community', 'Underground Electricity', 'Masjid Nearby', 'Park Facing', 'Roof Deck', 'Store Room'],
    agent: agents[0],
    status: 'published',
    featured: true,
    createdAt: '2024-12-10',
    whatsapp: '+923001234567',
  },
  {
    id: 'p5',
    title: 'Commercial Plot — DHA Phase 8',
    type: 'plot',
    purpose: 'buy',
    price: 120000000,
    priceLabel: 'PKR 12 Crore',
    area: 1000,
    areaUnit: 'sqyd',
    city: 'Karachi',
    location: 'DHA Phase 8',
    block: 'Zone A',
    description: '1000 Sq Yd commercial corner plot on main boulevard in DHA Phase 8. Ideal for mixed-use development, retail, or corporate HQ.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
    features: ['Corner Plot', 'Main Boulevard', 'Commercial Zoning', 'All Utilities', 'Easy Access'],
    agent: agents[3],
    status: 'published',
    featured: false,
    createdAt: '2024-11-15',
    whatsapp: '+923457778901',
  },
  {
    id: 'p6',
    title: '2BR Serviced Apartment — Clifton Block 9',
    type: 'apartment',
    purpose: 'rent',
    price: 75000,
    priceLabel: 'PKR 75K/month',
    area: 1400,
    areaUnit: 'sqft',
    bedrooms: 2,
    bathrooms: 2,
    furnished: true,
    city: 'Karachi',
    location: 'Clifton Block 9',
    description: 'Stylish serviced apartment with modern décor, all appliances included. Monthly maid service and maintenance included in rent.',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
    features: ['Fully Furnished', 'Maid Service Included', 'High-Speed WiFi', 'Cable TV', 'Gym Access', 'Rooftop Pool'],
    agent: agents[1],
    status: 'published',
    featured: false,
    createdAt: '2024-12-12',
    whatsapp: '+923219876543',
  },
];

export const leads: Lead[] = [
  {
    id: 'l1',
    name: 'Muhammad Bilal',
    mobile: '+92-300-1111111',
    email: 'bilal@gmail.com',
    whatsappOptIn: true,
    interestTypes: ['House Buyout'],
    locations: ['DHA Phase 5', 'DHA Phase 6'],
    budgetMin: 60000000,
    budgetMax: 100000000,
    budgetFlexible: false,
    intentions: ['Personal Living'],
    source: 'website',
    status: 'qualified',
    assignedAgent: 'a1',
    createdAt: '2024-12-08',
    lastActivity: '2024-12-14',
    notes: 'Looking for 4–5 bedroom house. Wife prefers DHA Phase 6.',
  },
  {
    id: 'l2',
    name: 'Ayesha Tariq',
    mobile: '+92-321-2222222',
    whatsappOptIn: false,
    interestTypes: ['Apartment Rental'],
    locations: ['Clifton Block 5', 'Clifton Block 9'],
    budgetMax: 120000,
    budgetFlexible: true,
    intentions: ['Personal Living'],
    source: 'call',
    status: 'site-visit',
    assignedAgent: 'a2',
    createdAt: '2024-12-10',
    lastActivity: '2024-12-15',
  },
  {
    id: 'l3',
    name: 'Tariq Mehmood',
    mobile: '+92-333-3333333',
    email: 'tariq.mehmood@business.pk',
    whatsappOptIn: true,
    interestTypes: ['Office Buyout', 'Office Rental'],
    locations: ['PECHS', 'Gulshan-e-Iqbal'],
    budgetMin: 40000000,
    budgetMax: 80000000,
    budgetFlexible: false,
    intentions: ['Investment', 'Buy & Rent'],
    source: 'referral',
    status: 'negotiation',
    assignedAgent: 'a3',
    createdAt: '2024-11-25',
    lastActivity: '2024-12-13',
    notes: 'Expanding business, needs ground floor commercial space.',
  },
  {
    id: 'l4',
    name: 'Sana Malik',
    mobile: '+92-345-4444444',
    whatsappOptIn: true,
    interestTypes: ['House Buyout'],
    locations: ['Bahria Town'],
    budgetMin: 45000000,
    budgetMax: 65000000,
    budgetFlexible: true,
    intentions: ['Personal Living'],
    source: 'social',
    status: 'contacted',
    assignedAgent: 'a1',
    createdAt: '2024-12-12',
    lastActivity: '2024-12-12',
  },
  {
    id: 'l5',
    name: 'Faisal Hyder',
    mobile: '+92-311-5555555',
    whatsappOptIn: false,
    interestTypes: ['Plot Buyout'],
    locations: ['DHA Phase 8'],
    budgetMin: 100000000,
    budgetMax: 150000000,
    budgetFlexible: false,
    intentions: ['Investment'],
    source: 'walk-in',
    status: 'new',
    createdAt: '2024-12-14',
    lastActivity: '2024-12-14',
  },
  {
    id: 'l6',
    name: 'Nadia Ansari',
    mobile: '+92-300-6666666',
    email: 'nadia@yahoo.com',
    whatsappOptIn: true,
    interestTypes: ['Apartment Rental'],
    locations: ['Clifton Block 1'],
    budgetMax: 80000,
    budgetFlexible: true,
    intentions: ['Personal Living'],
    source: 'whatsapp',
    status: 'won',
    assignedAgent: 'a2',
    createdAt: '2024-11-20',
    lastActivity: '2024-12-10',
  },
];

export function formatPrice(price: number): string {
  if (price >= 10000000) return `PKR ${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `PKR ${(price / 100000).toFixed(1)} Lac`;
  return `PKR ${price.toLocaleString()}`;
}
