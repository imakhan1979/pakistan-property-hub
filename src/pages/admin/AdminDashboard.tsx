import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, TrendingUp, TrendingDown, CheckCircle, Clock, ArrowUpRight, Eye, Plus } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-purple-100 text-purple-700',
  qualified: 'bg-yellow-100 text-yellow-700',
  'site-visit': 'bg-orange-100 text-orange-700',
  negotiation: 'bg-pink-100 text-pink-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

const PIPELINE_STAGES = ['new', 'contacted', 'qualified', 'site-visit', 'negotiation', 'won'];

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('properties').select('*').order('created_at', { ascending: false }),
    ]).then(([leadsRes, propsRes]) => {
      setLeads(leadsRes.data || []);
      setProperties(propsRes.data || []);
      setLoading(false);
    });
  }, []);

  const wonLeads = leads.filter(l => l.status === 'won');
  const pendingLeads = leads.filter(l => ['new', 'contacted'].includes(l.status));
  const publishedProps = properties.filter(p => p.status === 'published');
  const conversionRate = leads.length ? Math.round((wonLeads.length / leads.length) * 100) : 0;

  const STATS = [
    { label: 'Total Leads', value: leads.length, change: '+12%', up: true, icon: Users, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Active Listings', value: publishedProps.length, change: '+3', up: true, icon: Building2, color: 'bg-gold/10 text-gold' },
    { label: 'Won Deals', value: wonLeads.length, change: '+1', up: true, icon: CheckCircle, color: 'bg-success/10 text-success' },
    { label: 'Pending Follow-ups', value: pendingLeads.length, change: '-2', up: false, icon: Clock, color: 'bg-warning/10 text-warning' },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-navy">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Welcome back. Here's what's happening today.</p>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/leads">
                <Button size="sm" variant="outline" className="gap-2"><Plus className="h-4 w-4" /> New Lead</Button>
              </Link>
              <Link to="/admin/inventory">
                <Button size="sm" className="bg-navy text-primary-foreground hover:bg-navy-light gap-2"><Plus className="h-4 w-4" /> Add Property</Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border p-4 shadow-card">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', stat.color)}>
                    <stat.icon style={{ height: 18, width: 18 }} />
                  </div>
                  <span className={cn('flex items-center gap-0.5 text-xs font-medium', stat.up ? 'text-success' : 'text-destructive')}>
                    {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                {loading ? <div className="h-8 bg-muted rounded animate-pulse mb-1" /> : (
                  <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                )}
                <p className="text-muted-foreground text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pipeline */}
            <div className="lg:col-span-1 bg-card rounded-2xl border border-border p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Sales Pipeline</h2>
                <Link to="/admin/leads" className="text-xs text-navy hover:text-gold transition-colors flex items-center gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {PIPELINE_STAGES.map(stage => {
                  const count = leads.filter(l => l.status === stage).length;
                  return (
                    <div key={stage} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20 capitalize">{stage}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-navy transition-all" style={{ width: leads.length ? `${(count / leads.length) * 100}%` : '0%' }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Conversion Rate</span>
                  <span className="font-bold text-success">{conversionRate}%</span>
                </div>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Recent Leads</h2>
                <Link to="/admin/leads" className="text-xs text-navy hover:text-gold transition-colors flex items-center gap-1">
                  View All <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {loading ? (
                  [1,2,3,4,5].map(i => <div key={i} className="px-5 py-3 h-14 bg-muted/20 animate-pulse" />)
                ) : leads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="px-5 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                    <div className="h-9 w-9 rounded-full bg-navy flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.interest_types?.join(', ') || '—'} · {lead.locations?.[0] || '—'}
                      </p>
                    </div>
                    <Badge className={cn('text-xs capitalize flex-shrink-0', STATUS_COLORS[lead.status])}>{lead.status}</Badge>
                  </div>
                ))}
                {!loading && leads.length === 0 && (
                  <div className="px-5 py-8 text-center text-muted-foreground text-sm">No leads yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Active Listings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Active Listings</h2>
              <Link to="/admin/inventory" className="text-xs text-navy hover:text-gold transition-colors flex items-center gap-1">
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-52 bg-muted rounded-2xl animate-pulse" />)
              ) : publishedProps.slice(0, 4).map(prop => (
                <div key={prop.id} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden group">
                  <div className="relative h-36 overflow-hidden bg-muted">
                    <img src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                      alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 left-2">
                      <Badge className={cn('text-xs', prop.purpose === 'buy' ? 'bg-navy text-white' : 'bg-gold text-navy-dark')}>
                        {prop.purpose === 'buy' ? 'Sale' : 'Rent'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-foreground line-clamp-1 mb-1">{prop.title}</p>
                    <p className="text-gold font-bold text-sm">{prop.price_label}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Link to={`/listings/${prop.id}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Eye className="h-3 w-3" /> View</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && publishedProps.length === 0 && (
                <div className="col-span-4 py-8 text-center text-muted-foreground text-sm">No published listings yet</div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
