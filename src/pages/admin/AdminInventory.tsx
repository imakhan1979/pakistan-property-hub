import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Search } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  review: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
};

interface Property {
  id: string; title: string; type: string; purpose: string;
  price: number; price_label: string; area: number; area_unit: string;
  location: string; images: string[]; status: string; featured: boolean;
}

export default function AdminInventory() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProperties = async () => {
    setLoading(true);
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    setProperties((data || []) as Property[]);
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('properties').update({ status }).eq('id', id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const filtered = properties.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || p.type === typeFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-navy">Property Inventory</h1>
              <p className="text-muted-foreground text-sm">{properties.length} properties total</p>
            </div>
            <Button size="sm" className="bg-navy text-primary-foreground hover:bg-navy-light gap-2">
              <Plus className="h-4 w-4" /> Add Property
            </Button>
          </div>

          {/* Summary tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Published', count: properties.filter(p => p.status === 'published').length, color: 'border-green-200 bg-green-50' },
              { label: 'In Review', count: properties.filter(p => p.status === 'review').length, color: 'border-yellow-200 bg-yellow-50' },
              { label: 'Drafts', count: properties.filter(p => p.status === 'draft').length, color: 'border-gray-200 bg-gray-50' },
              { label: 'Featured', count: properties.filter(p => p.featured).length, color: 'border-gold/30 bg-gold/5' },
            ].map(s => (
              <div key={s.label} className={cn('rounded-xl p-3 border text-center', s.color)}>
                <p className="text-2xl font-bold font-display text-foreground">{s.count}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search properties..." className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {['house','apartment','office','plot'].map(t => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {['draft','review','published'].map(s => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(prop => (
                <div key={prop.id} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden group">
                  <div className="relative h-40 overflow-hidden bg-muted">
                    <img src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                      alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <Badge className={cn('text-xs capitalize', STATUS_COLORS[prop.status])}>{prop.status}</Badge>
                      {prop.featured && <Badge className="text-xs bg-gold/20 text-gold border-0">★ Featured</Badge>}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={cn('text-xs', prop.purpose === 'buy' ? 'bg-navy text-white' : 'bg-orange-500 text-white')}>
                        {prop.purpose === 'buy' ? 'Sale' : 'Rent'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-foreground line-clamp-1 mb-0.5">{prop.title}</p>
                    <p className="text-gold font-bold text-sm mb-1">{prop.price_label}</p>
                    <p className="text-xs text-muted-foreground mb-3">{prop.location} · {prop.area} {prop.area_unit}</p>
                    <div className="flex gap-2">
                      <Select value={prop.status} onValueChange={(v) => updateStatus(prop.id, v)}>
                        <SelectTrigger className="flex-1 h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['draft','review','published'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Link to={`/listings/${prop.id}`}>
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0"><Eye className="h-3 w-3" /></Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-4 py-12 text-center text-muted-foreground">No properties found</div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
