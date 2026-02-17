import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import { properties, LOCATIONS, type Property } from '@/data/mockData';
import { cn } from '@/lib/utils';

const PROPERTY_TYPES = ['house', 'apartment', 'office', 'plot'];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const purpose = searchParams.get('purpose') || '';
  const type = searchParams.get('type') || '';
  const location = searchParams.get('location') || '';
  const priceRange = searchParams.get('price') || '';

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    setSearchParams(params);
  };

  const clearFilter = (key: string) => setFilter(key, '');

  // Filter
  let filtered = properties.filter(p => p.status === 'published');
  if (purpose) filtered = filtered.filter(p => p.purpose === purpose);
  if (type) filtered = filtered.filter(p => p.type === type);
  if (location) filtered = filtered.filter(p =>
    p.location.toLowerCase().includes(location.toLowerCase()) ||
    (p.block || '').toLowerCase().includes(location.toLowerCase())
  );
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= (min || 0) && p.price <= (max || Infinity));
  }

  // Sort
  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  const activeFilters = [
    purpose && { key: 'purpose', label: purpose === 'buy' ? 'For Sale' : 'For Rent' },
    type && { key: 'type', label: type.charAt(0).toUpperCase() + type.slice(1) },
    location && { key: 'location', label: location },
    priceRange && { key: 'price', label: priceRange },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
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
          <p className="text-white/60 text-sm">{filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container py-4">
        <SearchBar variant="inline" />
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="container pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Filters:</span>
            {activeFilters.map((f) => (
              <Badge
                key={f.key}
                variant="secondary"
                className="gap-1.5 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors capitalize"
                onClick={() => clearFilter(f.key)}
              >
                {f.label}
                <X className="h-3 w-3" />
              </Badge>
            ))}
            <button
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-xs text-destructive hover:underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      <div className="container pb-16">
        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-3 py-4 border-b border-border mb-6">
          {/* Type Tabs */}
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFilter('purpose', '')}
              className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all', !purpose ? 'bg-navy text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}
            >
              All
            </button>
            {['buy', 'rent'].map((p) => (
              <button
                key={p}
                onClick={() => setFilter('purpose', p)}
                className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize', purpose === p ? 'bg-navy text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}
              >
                {p === 'buy' ? 'For Sale' : 'For Rent'}
              </button>
            ))}
            <div className="w-px bg-border mx-1" />
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setFilter('type', type === t ? '' : t)}
                className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize', type === t ? 'bg-gold/20 text-gold border border-gold/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* View mode */}
            <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-1.5 transition-colors', viewMode === 'grid' ? 'bg-navy text-white' : 'text-muted-foreground hover:bg-muted')}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-1.5 transition-colors', viewMode === 'list' ? 'bg-navy text-white' : 'text-muted-foreground hover:bg-muted')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-navy mb-2">No properties found</p>
            <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
            <Button onClick={() => setSearchParams(new URLSearchParams())} variant="outline">Clear All Filters</Button>
          </div>
        ) : (
          <div className={cn(
            'grid gap-6',
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          )}>
            {filtered.map((property) => (
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
