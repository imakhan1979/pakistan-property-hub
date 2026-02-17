import { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Phone, MessageCircle, Download, Filter,
  ChevronDown, X, Edit, Trash2, Check, User, Calendar, FileText, RefreshCw
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { LOCATIONS, INTEREST_TYPES, INTENTIONS } from '@/data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  whatsapp_opt_in: boolean;
  preferred_contact_time: string | null;
  interest_types: string[];
  locations: string[];
  budget_min: number | null;
  budget_max: number | null;
  budget_flexible: boolean;
  intentions: string[];
  notes: string | null;
  source: string;
  status: string;
  assigned_agent_id: string | null;
  created_at: string;
  updated_at: string;
  agents?: { name: string } | null;
}

interface Agent { id: string; name: string; email: string | null; }

// ─── Constants ──────────────────────────────────────────────────────────────
const STATUSES = ['new', 'contacted', 'qualified', 'site-visit', 'negotiation', 'won', 'lost'] as const;
const SOURCES = ['website', 'call', 'whatsapp', 'walk-in', 'referral', 'social'] as const;

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

// ─── Empty lead form ─────────────────────────────────────────────────────────
const emptyForm = () => ({
  name: '', mobile: '', email: '', whatsapp_opt_in: false,
  preferred_contact_time: '', interest_types: [] as string[],
  locations: [] as string[], budget_min: '', budget_max: '',
  budget_flexible: false, intentions: [] as string[],
  notes: '', source: 'website', status: 'new', assigned_agent_id: '',
});

// ─── Multi-checkbox helper ───────────────────────────────────────────────────
function MultiCheck({
  label, options, selected, onChange,
}: { label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter(s => s !== val) : [...selected, val]);
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto border border-border rounded-xl p-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all',
              selected.includes(opt)
                ? 'bg-navy text-primary-foreground border-navy'
                : 'bg-background text-foreground border-border hover:border-navy/50'
            )}
          >
            {selected.includes(opt) && <Check className="inline h-2.5 w-2.5 mr-1" />}
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Lead Form Modal ─────────────────────────────────────────────────────────
function LeadFormModal({
  lead, agents, onClose, onSaved,
}: {
  lead: Lead | null;
  agents: Agent[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(lead ? {
    name: lead.name, mobile: lead.mobile, email: lead.email ?? '',
    whatsapp_opt_in: lead.whatsapp_opt_in,
    preferred_contact_time: lead.preferred_contact_time ?? '',
    interest_types: lead.interest_types, locations: lead.locations,
    budget_min: lead.budget_min?.toString() ?? '',
    budget_max: lead.budget_max?.toString() ?? '',
    budget_flexible: lead.budget_flexible,
    intentions: lead.intentions,
    notes: lead.notes ?? '',
    source: lead.source, status: lead.status,
    assigned_agent_id: lead.assigned_agent_id ?? '',
  } : emptyForm());

  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  // Pakistan phone validation
  const validateMobile = (mobile: string) => /^(\+92|0)3[0-9]{9}$/.test(mobile.replace(/[\s-]/g, ''));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateMobile(form.mobile)) {
      toast({ title: 'Invalid mobile', description: 'Enter a valid Pakistan mobile number (e.g. 03001234567)', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim() || null,
      whatsapp_opt_in: form.whatsapp_opt_in,
      preferred_contact_time: form.preferred_contact_time || null,
      interest_types: form.interest_types,
      locations: form.locations,
      budget_min: form.budget_min ? parseInt(form.budget_min) : null,
      budget_max: form.budget_max ? parseInt(form.budget_max) : null,
      budget_flexible: form.budget_flexible,
      intentions: form.intentions,
      notes: form.notes.trim() || null,
      source: form.source,
      status: form.status,
      assigned_agent_id: form.assigned_agent_id || null,
    };

    const { error } = lead
      ? await supabase.from('leads').update(payload).eq('id', lead.id)
      : await supabase.from('leads').insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: lead ? 'Lead updated' : 'Lead created', description: `${form.name} has been saved.` });
      onSaved();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-display font-bold text-navy">{lead ? 'Edit Lead' : 'New Lead'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-5 space-y-4">
          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Muhammad Ali" required maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile * (PK)</Label>
              <Input id="mobile" value={form.mobile} onChange={e => set('mobile', e.target.value)} placeholder="03001234567" required maxLength={13} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="ali@email.com" maxLength={255} />
            </div>
          </div>

          {/* WhatsApp + Contact time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5">
              <input
                id="wa"
                type="checkbox"
                checked={form.whatsapp_opt_in}
                onChange={e => set('whatsapp_opt_in', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <Label htmlFor="wa" className="cursor-pointer text-sm">WhatsApp Opt-in</Label>
            </div>
            <div className="space-y-1.5">
              <Label>Preferred Contact Time</Label>
              <Select value={form.preferred_contact_time} onValueChange={v => set('preferred_contact_time', v)}>
                <SelectTrigger><SelectValue placeholder="Any time" /></SelectTrigger>
                <SelectContent>
                  {['Morning (9–12)', 'Afternoon (12–5)', 'Evening (5–8)', 'Any time'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interest types */}
          <MultiCheck label="Interest Types *" options={INTEREST_TYPES} selected={form.interest_types} onChange={v => set('interest_types', v)} />

          {/* Locations */}
          <MultiCheck label="Preferred Locations *" options={LOCATIONS} selected={form.locations} onChange={v => set('locations', v)} />

          {/* Budget */}
          <div>
            <Label className="mb-2 block">Budget (PKR)</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input value={form.budget_min} onChange={e => set('budget_min', e.target.value)} placeholder="Min" type="number" min={0} />
              <Input value={form.budget_max} onChange={e => set('budget_max', e.target.value)} placeholder="Max" type="number" min={0} />
              <div className="flex items-center gap-2 border border-border rounded-xl px-3">
                <input type="checkbox" id="flex" checked={form.budget_flexible} onChange={e => set('budget_flexible', e.target.checked)} className="h-4 w-4 rounded" />
                <Label htmlFor="flex" className="cursor-pointer text-xs">Flexible</Label>
              </div>
            </div>
          </div>

          {/* Intentions */}
          <MultiCheck label="Intentions" options={INTENTIONS} selected={form.intentions} onChange={v => set('intentions', v)} />

          {/* Source + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Lead Source *</Label>
              <Select value={form.source} onValueChange={v => set('source', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOURCES.map(s => <SelectItem key={s} value={s} className="capitalize">{SOURCE_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status *</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Agent assignment */}
          <div className="space-y-1.5">
            <Label>Assign to Agent</Label>
            <Select value={form.assigned_agent_id} onValueChange={v => set('assigned_agent_id', v)}>
              <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {agents.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional details…" rows={3} maxLength={2000} />
          </div>

          <div className="flex gap-2 pt-2 sticky bottom-0 bg-card py-3 border-t border-border -mx-5 px-5">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-navy text-primary-foreground hover:bg-navy-light" disabled={saving}>
              {saving ? 'Saving…' : lead ? 'Save Changes' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Lead Detail Panel ───────────────────────────────────────────────────────
function LeadDetailPanel({
  lead, agents, onClose, onEdit, onDelete, onStatusChange,
}: {
  lead: Lead; agents: Agent[]; onClose: () => void;
  onEdit: () => void; onDelete: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [note, setNote] = useState('');
  const [activities, setActivities] = useState<{ id: string; activity_type: string; description: string; created_at: string }[]>([]);
  const [addingNote, setAddingNote] = useState(false);
  const { authUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    supabase.from('lead_activities').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false })
      .then(({ data }) => setActivities(data ?? []));
  }, [lead.id]);

  const saveNote = async () => {
    if (!note.trim()) return;
    setAddingNote(true);
    const { error } = await supabase.from('lead_activities').insert({
      lead_id: lead.id,
      agent_id: authUser?.agentId ?? null,
      activity_type: 'note',
      description: note.trim(),
    });
    setAddingNote(false);
    if (!error) {
      setNote('');
      const { data } = await supabase.from('lead_activities').select('*').eq('lead_id', lead.id).order('created_at', { ascending: false });
      setActivities(data ?? []);
      toast({ title: 'Note added' });
    }
  };

  const agent = agents.find(a => a.id === lead.assigned_agent_id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-navy">Lead Details</h3>
            <Badge className={cn('text-xs capitalize', STATUS_COLORS[lead.status])}>{lead.status}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-8 gap-1" onClick={onEdit}>
              <Edit className="h-3.5 w-3.5" /> Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Contact */}
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-full bg-navy text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
              {lead.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{lead.name}</p>
              <p className="text-sm text-muted-foreground">{lead.mobile}</p>
              {lead.email && <p className="text-xs text-muted-foreground">{lead.email}</p>}
              {lead.whatsapp_opt_in && <span className="text-xs text-[#25D366]">✓ WhatsApp</span>}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <a href={`tel:${lead.mobile}`} className="flex-1">
              <Button className="w-full bg-navy text-primary-foreground hover:bg-navy-light gap-2 h-9">
                <Phone className="h-4 w-4" /> Call
              </Button>
            </a>
            <a href={`https://wa.me/${lead.mobile.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1">
              <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 h-9">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
          </div>

          {/* Status quick-change */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Move Pipeline Stage</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange(lead.id, s)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all capitalize',
                    lead.status === s
                      ? 'bg-navy text-primary-foreground border-navy'
                      : 'border-border text-muted-foreground hover:border-navy/50'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-0 divide-y divide-border">
            {[
              { label: 'Interest Types', value: lead.interest_types.join(', ') || '—' },
              { label: 'Locations', value: lead.locations.join(', ') || '—' },
              { label: 'Budget', value: lead.budget_min ? `PKR ${(lead.budget_min / 1000000).toFixed(1)}M – ${((lead.budget_max ?? 0) / 1000000).toFixed(1)}M${lead.budget_flexible ? ' (flexible)' : ''}` : lead.budget_max ? `Up to PKR ${(lead.budget_max / 1000000).toFixed(1)}M` : '—' },
              { label: 'Intentions', value: lead.intentions.join(', ') || '—' },
              { label: 'Source', value: SOURCE_LABELS[lead.source] },
              { label: 'Assigned Agent', value: agent?.name ?? 'Unassigned' },
              { label: 'Contact Time', value: lead.preferred_contact_time ?? '—' },
              { label: 'Created', value: new Date(lead.created_at).toLocaleDateString('en-PK') },
              { label: 'Last Updated', value: new Date(lead.updated_at).toLocaleDateString('en-PK') },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2.5 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground text-right max-w-48">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}

          {/* Activity log */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Activity Log</p>
            <div className="space-y-1.5 mb-3">
              {activities.length === 0 && <p className="text-xs text-muted-foreground">No activity yet.</p>}
              {activities.map(a => (
                <div key={a.id} className="bg-muted rounded-lg p-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-medium capitalize text-foreground">{a.activity_type}</span>
                    <span className="text-muted-foreground">{new Date(a.created_at).toLocaleDateString('en-PK')}</span>
                  </div>
                  <p className="text-foreground/80">{a.description}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note…" rows={2} className="text-xs" maxLength={500} />
              <Button size="sm" className="bg-navy text-primary-foreground hover:bg-navy-light self-end" onClick={saveNote} disabled={addingNote || !note.trim()}>
                <FileText className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Delete */}
          <Button variant="destructive" size="sm" className="w-full gap-2 mt-2" onClick={onDelete}>
            <Trash2 className="h-4 w-4" /> Delete Lead
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminLeads ─────────────────────────────────────────────────────────
export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [editing, setEditing] = useState<Lead | 'new' | null>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*, agents(name)')
      .order('created_at', { ascending: false });
    if (!error) setLeads(data as Lead[] ?? []);
    setLoading(false);
  }, []);

  const fetchAgents = useCallback(async () => {
    const { data } = await supabase.from('agents').select('id, name, email');
    setAgents(data ?? []);
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, [fetchLeads, fetchAgents]);

  // ── Filters
  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = l.name.toLowerCase().includes(q) || l.mobile.includes(q) || (l.email ?? '').toLowerCase().includes(q);
    const matchStatus = !statusFilter || l.status === statusFilter;
    const matchAgent = !agentFilter || l.assigned_agent_id === agentFilter;
    return matchSearch && matchStatus && matchAgent;
  });

  // ── Status change
  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (!error) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
      toast({ title: 'Status updated', description: `Lead moved to ${status}` });
    }
  };

  // ── Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) {
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelected(null);
      toast({ title: 'Lead deleted' });
    }
  };

  // ── CSV Export
  const exportCSV = () => {
    const headers = ['Name', 'Mobile', 'Email', 'Status', 'Source', 'Interest Types', 'Locations', 'Budget Min', 'Budget Max', 'Agent', 'Created At'];
    const rows = filtered.map(l => [
      l.name, l.mobile, l.email ?? '', l.status, l.source,
      l.interest_types.join('; '), l.locations.join('; '),
      l.budget_min ?? '', l.budget_max ?? '',
      (l as Lead & { agents?: { name: string } | null }).agents?.name ?? '',
      new Date(l.created_at).toLocaleDateString('en-PK'),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy">Leads & CRM</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} of {leads.length} leads</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-2" onClick={exportCSV}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={fetchLeads} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Button size="sm" className="bg-navy text-primary-foreground hover:bg-navy-light gap-2" onClick={() => setEditing('new')}>
              <Plus className="h-4 w-4" /> New Lead
            </Button>
          </div>
        </div>

        {/* Pipeline stage pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('')}
            className={cn('flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
              !statusFilter ? 'border-navy bg-navy text-white' : 'border-border bg-card text-muted-foreground hover:border-navy/40'
            )}
          >
            All <span className="ml-1 font-bold">{leads.length}</span>
          </button>
          {STATUSES.map(stage => {
            const count = leads.filter(l => l.status === stage).length;
            return (
              <button
                key={stage}
                onClick={() => setStatusFilter(statusFilter === stage ? '' : stage)}
                className={cn('flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize',
                  statusFilter === stage ? 'border-navy bg-navy text-white' : 'border-border bg-card text-muted-foreground hover:border-navy/40'
                )}
              >
                {stage} <span className="ml-1 font-bold">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, email…" className="pl-9" />
          </div>
          {isAdmin && (
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-44">
                <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Agents</SelectItem>
                {agents.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 rounded-full border-2 border-navy border-t-transparent animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No leads found</p>
              <p className="text-sm">Try adjusting your filters or add a new lead.</p>
            </div>
          ) : (
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
                    const agentName = (lead as Lead & { agents?: { name: string } | null }).agents?.name;
                    return (
                      <tr key={lead.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelected(lead)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-navy text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {lead.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{lead.name}</p>
                              <p className="text-xs text-muted-foreground">{new Date(lead.created_at).toLocaleDateString('en-PK')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-foreground">{lead.mobile}</p>
                          {lead.whatsapp_opt_in && <span className="text-xs text-[#25D366]">WhatsApp ✓</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-36">
                            {lead.interest_types.slice(0, 2).map(t => (
                              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                            ))}
                            {lead.interest_types.length > 2 && <Badge variant="secondary" className="text-xs">+{lead.interest_types.length - 2}</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                          {lead.budget_max ? `≤ PKR ${(lead.budget_max / 1000000).toFixed(1)}M` : '—'}
                          {lead.budget_flexible && <span className="text-xs text-muted-foreground ml-1">(flex)</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{SOURCE_LABELS[lead.source]}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{agentName?.split(' ')[0] ?? '—'}</td>
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
                            <a href={`https://wa.me/${lead.mobile.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
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
          )}
        </div>
      </div>

      {/* Lead Form (New/Edit) */}
      {editing !== null && (
        <LeadFormModal
          lead={editing === 'new' ? null : editing}
          agents={agents}
          onClose={() => setEditing(null)}
          onSaved={fetchLeads}
        />
      )}

      {/* Lead Detail Panel */}
      {selected && !editing && (
        <LeadDetailPanel
          lead={selected}
          agents={agents}
          onClose={() => setSelected(null)}
          onEdit={() => { setEditing(selected); setSelected(null); }}
          onDelete={() => handleDelete(selected.id)}
          onStatusChange={handleStatusChange}
        />
      )}
    </AdminLayout>
  );
}

// needed for empty state icon
function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
