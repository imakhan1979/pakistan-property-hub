import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Search, Filter } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { properties } from '@/data/mockData';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  review: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
};

export default function AdminInventory() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = properties.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || p.type === typeFilter;
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
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
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {['house','apartment','office','plot'].map(t => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {['draft','review','published'].map(s => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(prop => (
            <div key={prop.id} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden group">
              <div className="relative h-40 overflow-hidden bg-muted">
                <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <Badge className={cn('text-xs capitalize', STATUS_COLORS[prop.status])}>{prop.status}</Badge>
                  {prop.featured && <Badge className="text-xs bg-gold/20 text-gold-dark border-0">★ Featured</Badge>}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={cn('text-xs', prop.purpose === 'buy' ? 'bg-navy text-white' : 'bg-orange-500 text-white')}>
                    {prop.purpose === 'buy' ? 'Sale' : 'Rent'}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-foreground line-clamp-1 mb-0.5">{prop.title}</p>
                <p className="text-gold font-bold text-sm mb-1">{prop.priceLabel}</p>
                <p className="text-xs text-muted-foreground mb-3">{prop.location} · {prop.area} {prop.areaUnit}</p>
                <div className="flex gap-2">
                  <Link to={`/listings/${prop.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full h-7 text-xs gap-1">
                      <Eye className="h-3 w-3" /> View
                    </Button>
                  </Link>
                  <Button size="sm" className="flex-1 h-7 text-xs bg-navy text-primary-foreground hover:bg-navy-light gap-1">
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
