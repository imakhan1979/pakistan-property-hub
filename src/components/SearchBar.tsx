import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LOCATIONS } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  variant?: 'hero' | 'inline';
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  purpose: string;
  propertyType: string;
  location: string;
  priceMin: string;
  priceMax: string;
  beds: string;
}

export default function SearchBar({ variant = 'hero', onSearch }: SearchBarProps) {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState('buy');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [beds, setBeds] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    if (propertyType) params.set('type', propertyType);
    if (location) params.set('location', location);
    if (priceRange) params.set('price', priceRange);
    if (beds) params.set('beds', beds);

    if (onSearch) {
      const [min, max] = priceRange.split('-');
      onSearch({ purpose, propertyType, location, priceMin: min || '', priceMax: max || '', beds });
    } else {
      navigate(`/listings?${params.toString()}`);
    }
  };

  if (variant === 'hero') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex mb-0">
          {['buy', 'rent'].map((p) => (
            <button
              key={p}
              onClick={() => setPurpose(p)}
              className={cn(
                'px-8 py-2.5 text-sm font-semibold rounded-t-xl transition-all capitalize',
                purpose === p
                  ? 'bg-white text-navy'
                  : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
              )}
            >
              {p === 'buy' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-card-hover p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by area, block, or address..."
                className="pl-9 border-border h-11"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="md:w-40 h-11">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="md:w-40 h-11">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-5000000">Under 50 Lac</SelectItem>
                <SelectItem value="5000000-20000000">50L – 2 Cr</SelectItem>
                <SelectItem value="20000000-50000000">2 Cr – 5 Cr</SelectItem>
                <SelectItem value="50000000-100000000">5 Cr – 10 Cr</SelectItem>
                <SelectItem value="100000000-999999999">10 Cr+</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="h-11 px-8 bg-gold text-navy-dark hover:bg-gold-light font-semibold shadow-gold md:w-auto w-full"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>

          {/* Quick Area Filters */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1 self-center">Popular:</span>
            {['DHA Phase 6', 'Clifton Block 5', 'Bahria Town', 'PECHS', 'Gulshan-e-Iqbal'].map((area) => (
              <button
                key={area}
                onClick={() => setLocation(area)}
                className={cn(
                  'text-xs px-3 py-1 rounded-full border transition-all',
                  location === area
                    ? 'bg-navy text-white border-navy'
                    : 'border-border text-muted-foreground hover:border-navy hover:text-navy'
                )}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 bg-card p-4 rounded-xl border border-border shadow-card">
      <Select value={purpose} onValueChange={setPurpose}>
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="buy">Buy</SelectItem>
          <SelectItem value="rent">Rent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={propertyType} onValueChange={setPropertyType}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="house">House</SelectItem>
          <SelectItem value="apartment">Apartment</SelectItem>
          <SelectItem value="office">Office</SelectItem>
          <SelectItem value="plot">Plot</SelectItem>
        </SelectContent>
      </Select>

      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          {LOCATIONS.map((l) => (
            <SelectItem key={l} value={l}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priceRange} onValueChange={setPriceRange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Budget" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-5000000">Under 50 Lac</SelectItem>
          <SelectItem value="5000000-20000000">50L – 2 Cr</SelectItem>
          <SelectItem value="20000000-50000000">2 Cr – 5 Cr</SelectItem>
          <SelectItem value="50000000-100000000">5 Cr – 10 Cr</SelectItem>
          <SelectItem value="100000000-999999999">10 Cr+</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleSearch} className="bg-navy text-primary-foreground hover:bg-navy-light">
        <Search className="h-4 w-4 mr-2" /> Search
      </Button>
    </div>
  );
}
