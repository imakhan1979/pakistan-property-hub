import { Link } from 'react-router-dom';
import {
  Users, Building2, TrendingUp, TrendingDown, CheckCircle, Clock,
  ArrowUpRight, MessageCircle, Eye, Plus
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { leads, properties, agents } from '@/data/mockData';
import { cn } from '@/lib/utils';

const STATS = [
  {
    label: 'Total Leads',
    value: leads.length,
    change: '+12%',
    up: true,
    icon: Users,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    label: 'Active Listings',
    value: properties.filter(p => p.status === 'published').length,
    change: '+3',
    up: true,
    icon: Building2,
    color: 'bg-gold/10 text-gold-dark',
  },
  {
    label: 'Won Deals',
    value: leads.filter(l => l.status === 'won').length,
    change: '+1',
    up: true,
    icon: CheckCircle,
    color: 'bg-success/10 text-success',
  },
  {
    label: 'Pending Follow-ups',
    value: leads.filter(l => ['new', 'contacted'].includes(l.status)).length,
    change: '-2',
    up: false,
    icon: Clock,
    color: 'bg-warning/10 text-warning',
  },
];

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-purple-100 text-purple-700',
  qualified: 'bg-yellow-100 text-yellow-700',
  'site-visit': 'bg-orange-100 text-orange-700',
  negotiation: 'bg-pink-100 text-pink-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

const PIPELINE = [
  { stage: 'New', count: leads.filter(l => l.status === 'new').length, color: 'bg-blue-500' },
  { stage: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'bg-purple-500' },
  { stage: 'Qualified', count: leads.filter(l => l.status === 'qualified').length, color: 'bg-yellow-500' },
  { stage: 'Site Visit', count: leads.filter(l => l.status === 'site-visit').length, color: 'bg-orange-500' },
  { stage: 'Negotiation', count: leads.filter(l => l.status === 'negotiation').length, color: 'bg-pink-500' },
  { stage: 'Won', count: leads.filter(l => l.status === 'won').length, color: 'bg-green-500' },
];

export default function AdminDashboard() {
  const recentLeads = leads.slice(0, 5);
  const featuredProps = properties.filter(p => p.status === 'published').slice(0, 4);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back, Sara. Here's what's happening today.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/leads">
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="h-4 w-4" /> New Lead
              </Button>
            </Link>
            <Link to="/admin/inventory">
              <Button size="sm" className="bg-navy text-primary-foreground hover:bg-navy-light gap-2">
                <Plus className="h-4 w-4" /> Add Property
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl border border-border p-4 shadow-card">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', stat.color)}>
                  <stat.icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                </div>
                <span className={cn('flex items-center gap-0.5 text-xs font-medium', stat.up ? 'text-success' : 'text-destructive')}>
                  {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
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
              {PIPELINE.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">{stage.stage}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all', stage.color)}
                      style={{ width: `${(stage.count / leads.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-4 text-right">{stage.count}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-bold text-success">
                  {Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100)}%
                </span>
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
              {recentLeads.map((lead) => {
                const agent = agents.find(a => a.id === lead.assignedAgent);
                return (
                  <div key={lead.id} className="px-5 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                    <div className="h-9 w-9 rounded-full bg-navy flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                      {lead.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.interestTypes.join(', ')} · {lead.locations[0]}
                      </p>
                    </div>
                    <Badge className={cn('text-xs capitalize flex-shrink-0', STATUS_COLORS[lead.status])}>
                      {lead.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:block flex-shrink-0">
                      {agent?.name.split(' ')[0] || 'Unassigned'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Properties */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Active Listings</h2>
            <Link to="/admin/inventory" className="text-xs text-navy hover:text-gold transition-colors flex items-center gap-1">
              View All <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProps.map((prop) => (
              <div key={prop.id} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden group">
                <div className="relative h-36 overflow-hidden bg-muted">
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2">
                    <Badge className={cn('text-xs', prop.purpose === 'buy' ? 'bg-navy text-white' : 'bg-gold text-navy-dark')}>
                      {prop.purpose === 'buy' ? 'Sale' : 'Rent'}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-foreground line-clamp-1 mb-1">{prop.title}</p>
                  <p className="text-gold font-bold text-sm">{prop.priceLabel}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Link to={`/listings/${prop.id}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Agent Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Agent</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Leads</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Won</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {agents.map((agent) => {
                  const agentLeads = leads.filter(l => l.assignedAgent === agent.id);
                  const won = agentLeads.filter(l => l.status === 'won').length;
                  const rate = agentLeads.length ? Math.round((won / agentLeads.length) * 100) : 0;
                  return (
                    <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-navy text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{agent.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{agent.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{agentLeads.length}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{agentLeads.filter(l => !['won', 'lost'].includes(l.status)).length}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-success">{won}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-16">
                            <div className="h-full bg-success rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
