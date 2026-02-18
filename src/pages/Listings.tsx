import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const PROPERTY_TYPES = ['house', 'apartment', 'office', 'plot'];

interface DbProperty {
  id: string;
  title: string;
  type: string;
  purpose: string;
  price: number;
  price_label: string;
  area: number;
  area_unit: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  furnished?: boolean;
  city: string;
  location: string;
  block?: string;
  description?: string;
  images: string[];
  features: string[];
  whatsapp?: string;
  status: string;
  featured: boolean;
  created_at: string;
}

// Map DB row to PropertyCard-compatible format
function mapProperty(p: DbProperty) {
  return {
    id: p.id,
    title: p.title,
    type: p.type as any,
    purpose: p.purpose as any,
    price: p.price,
    priceLabel: p.price_label,
    area: p.area,
    areaUnit: p.area_unit as any,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    parking: p.parking,
    furnished: p.furnished,
    city: p.city,
    location: p.location,
    block: p.block,
    description: p.description || '',
    images: p.images?.length ? p.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    features: p.features || [],
    agent: { id: 'default', name: 'Estate Bnk Agent', phone: '+92-21-3580-0000', email: 'info@estatebnk.pk', role: 'agent' as const },
    status: p.status as any,
    featured: p.featured,
    createdAt: p.created_at,
    whatsapp: p.whatsapp,
  };
}

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [properties, setProperties] = useState<ReturnType<typeof mapProperty>[]>([]);
  const [loading, setLoading] = useState(true);

  const purpose = searchParams.get('purpose') || '';
  const type = searchParams.get('type') || '';
  const location = searchParams.get('location') || '';

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      let query = supabase.from('properties').select('*').eq('status', 'published');
      if (purpose) query = query.eq('purpose', purpose);
      if (type) query = query.eq('type', type);
      if (location) query = query.ilike('location', `%${location}%`);
      if (sortBy === 'price-asc') query = query.order('price', { ascending: true });
      else if (sortBy === 'price-desc') query = query.order('price', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data } = await query;
      setProperties((data || []).map(mapProperty));
      setLoading(false);
    }
    fetchProperties();
  }, [purpose, type, location, sortBy]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params);
  };

  const activeFilters = [
    purpose && { key: 'purpose', label: purpose === 'buy' ? 'For Sale' : 'For Rent' },
    type && { key: 'type', label: type.charAt(0).toUpperCase() + type.slice(1) },
    location && { key: 'location', label: location },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="gradient-hero py-12">
        <div className="container">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Properties</span>
            {location && <><span>/</span><span className="text-white/80">{location}</span></>}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            {location ? `Properties in ${location}` : purpose === 'rent' ? 'Properties for Rent' : purpose === 'buy' ? 'Properties for Sale' : 'All Properties'}
          </h1>
          <p className="text-white/60 text-sm">{loading ? 'Loading...' : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} found`}</p>
        </div>
      </div>

      <div className="container py-4">
        <SearchBar variant="inline" />
      </div>

      {activeFilters.length > 0 && (
        <div className="container pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Filters:</span>
            {activeFilters.map((f) => (
              <Badge key={f.key} variant="secondary" className="gap-1.5 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors capitalize" onClick={() => setFilter(f.key, '')}>
                {f.label}<X className="h-3 w-3" />
              </Badge>
            ))}
            <button onClick={() => setSearchParams(new URLSearchParams())} className="text-xs text-destructive hover:underline">Clear all</button>
          </div>
        </div>
      )}

      <div className="container pb-16">
        <div className="flex items-center justify-between gap-3 py-4 border-b border-border mb-6">
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setFilter('purpose', '')} className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all', !purpose ? 'bg-navy text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>All</button>
            {['buy', 'rent'].map((p) => (
              <button key={p} onClick={() => setFilter('purpose', p)} className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize', purpose === p ? 'bg-navy text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                {p === 'buy' ? 'For Sale' : 'For Rent'}
              </button>
            ))}
            <div className="w-px bg-border mx-1" />
            {PROPERTY_TYPES.map((t) => (
              <button key={t} onClick={() => setFilter('type', type === t ? '' : t)} className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize', type === t ? 'bg-gold/20 text-gold border border-gold/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={cn('p-1.5 transition-colors', viewMode === 'grid' ? 'bg-navy text-white' : 'text-muted-foreground hover:bg-muted')}>
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={cn('p-1.5 transition-colors', viewMode === 'list' ? 'bg-navy text-white' : 'text-muted-foreground hover:bg-muted')}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-navy mb-2">No properties found</p>
            <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
            <Button onClick={() => setSearchParams(new URLSearchParams())} variant="outline">Clear All Filters</Button>
          </div>
        ) : (
          <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1')}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
