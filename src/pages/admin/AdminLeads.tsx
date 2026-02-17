import { useState } from 'react';
import { Search, Filter, Plus, Phone, MessageCircle, ChevronDown, Download } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { leads, agents, type Lead } from '@/data/mockData';
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

const SOURCE_LABELS: Record<string, string> = {
  website: '🌐 Website', call: '📞 Call', whatsapp: '💬 WhatsApp',
  'walk-in': '🚶 Walk-in', referral: '🤝 Referral', social: '📱 Social',
};

export default function AdminLeads() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.mobile.includes(search);
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy">Leads & CRM</h1>
            <p className="text-muted-foreground text-sm">{leads.length} total leads</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button size="sm" className="bg-navy text-primary-foreground hover:bg-navy-light gap-2">
              <Plus className="h-4 w-4" /> New Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..." className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {['new', 'contacted', 'qualified', 'site-visit', 'negotiation', 'won', 'lost'].map(s => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pipeline summary bar */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['new', 'contacted', 'qualified', 'site-visit', 'negotiation', 'won', 'lost'].map(stage => {
            const count = leads.filter(l => l.status === stage).length;
            return (
              <button
                key={stage}
                onClick={() => setStatusFilter(statusFilter === stage ? '' : stage)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border capitalize',
                  statusFilter === stage ? 'border-navy bg-navy text-white' : 'border-border bg-card text-muted-foreground hover:border-navy/40'
                )}
              >
                {stage} <span className="ml-1 font-bold">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {['Lead', 'Contact', 'Interest', 'Budget', 'Source', 'Agent', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(lead => {
                  const agent = agents.find(a => a.id === lead.assignedAgent);
                  return (
                    <tr key={lead.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelected(lead)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-navy text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-foreground">{lead.mobile}</p>
                        {lead.whatsappOptIn && <span className="text-xs text-[#25D366]">WhatsApp ✓</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-36">
                          {lead.interestTypes.slice(0, 2).map(t => (
                            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                        {lead.budgetMax ? `≤ ${(lead.budgetMax / 1000000).toFixed(1)}M` : '—'}
                        {lead.budgetFlexible && <span className="text-xs text-muted-foreground ml-1">(flex)</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{SOURCE_LABELS[lead.source]}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{agent?.name.split(' ')[0] || '—'}</td>
                      <td className="px-4 py-3">
                        <Badge className={cn('text-xs capitalize', STATUS_COLORS[lead.status])}>{lead.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                          <a href={`tel:${lead.mobile}`}>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                              <Phone className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                          <a href={`https://wa.me/${lead.mobile.replace(/\D/g,'')}`} target="_blank" rel="noreferrer">
                            <Button size="sm" className="h-7 w-7 p-0 bg-[#25D366] hover:bg-[#20bd5a] text-white border-0">
                              <MessageCircle className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail Panel */}
        {selected && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
            <div className="relative w-full max-w-md bg-card h-full overflow-y-auto shadow-2xl animate-slide-in-right">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-display font-bold text-navy">Lead Details</h3>
                <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>✕</Button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-navy text-primary-foreground flex items-center justify-center text-xl font-bold">{selected.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-foreground">{selected.name}</p>
                    <p className="text-sm text-muted-foreground">{selected.mobile}</p>
                    <Badge className={cn('text-xs mt-1 capitalize', STATUS_COLORS[selected.status])}>{selected.status}</Badge>
                  </div>
                </div>
                {[
                  { label: 'Email', value: selected.email || '—' },
                  { label: 'WhatsApp Opt-in', value: selected.whatsappOptIn ? 'Yes' : 'No' },
                  { label: 'Interest Types', value: selected.interestTypes.join(', ') },
                  { label: 'Locations', value: selected.locations.join(', ') },
                  { label: 'Budget Range', value: selected.budgetMin ? `PKR ${(selected.budgetMin/1000000).toFixed(1)}M – ${(selected.budgetMax||0)/1000000}M` : selected.budgetMax ? `Up to PKR ${(selected.budgetMax/1000000).toFixed(1)}M` : '—' },
                  { label: 'Flexible Budget', value: selected.budgetFlexible ? 'Yes' : 'No' },
                  { label: 'Intentions', value: selected.intentions.join(', ') },
                  { label: 'Lead Source', value: SOURCE_LABELS[selected.source] },
                  { label: 'Created', value: new Date(selected.createdAt).toLocaleDateString() },
                  { label: 'Last Activity', value: new Date(selected.lastActivity).toLocaleDateString() },
                ].map(row => (
                  <div key={row.label} className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-foreground text-right max-w-48">{row.value}</span>
                  </div>
                ))}
                {selected.notes && (
                  <div className="bg-muted rounded-xl p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm text-foreground">{selected.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <a href={`tel:${selected.mobile}`} className="flex-1">
                    <Button className="w-full bg-navy text-primary-foreground hover:bg-navy-light gap-2">
                      <Phone className="h-4 w-4" /> Call
                    </Button>
                  </a>
                  <a href={`https://wa.me/${selected.mobile.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="flex-1">
                    <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
