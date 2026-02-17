import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, BarChart3, Settings, ChevronLeft,
  ChevronRight, LogOut, Bell, Search, Menu, X, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Leads / CRM', href: '/admin/leads', icon: Users },
  { label: 'Inventory', href: '/admin/inventory', icon: Building2 },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-sidebar-border', collapsed && 'justify-center')}>
        <div className="h-8 w-8 rounded-lg bg-gold flex items-center justify-center flex-shrink-0">
          <Building className="h-4 w-4 text-navy-dark" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display text-sm font-bold text-white">Elite Properties</p>
            <p className="text-[10px] text-gold/70 uppercase tracking-widest">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.href ||
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                  active
                    ? 'bg-gold/20 text-gold font-semibold'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white',
                  collapsed && 'justify-center'
                )}
              >
                <item.icon className="h-4.5 w-4.5 flex-shrink-0" style={{ height: 18, width: 18 }} />
                {!collapsed && <span>{item.label}</span>}
                {active && !collapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className={cn('px-2 pb-4 border-t border-sidebar-border pt-4 space-y-1', collapsed && 'flex flex-col items-center')}>
        <Link to="/" className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-all', collapsed && 'justify-center')}>
          <Building2 className="flex-shrink-0" style={{ height: 18, width: 18 }} />
          {!collapsed && <span>View Public Site</span>}
        </Link>
        <button className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground hover:bg-red-900/30 hover:text-red-400 transition-all w-full', collapsed && 'justify-center')}>
          <LogOut style={{ height: 18, width: 18 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col bg-sidebar transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-16 -right-3 h-6 w-6 rounded-full bg-sidebar border-2 border-sidebar-border text-sidebar-foreground hover:text-gold transition-colors flex items-center justify-center z-10 hidden md:flex"
          style={{ left: collapsed ? 52 : 228 }}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-sidebar">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-card border-b border-border flex items-center gap-3 px-4 flex-shrink-0">
          <button
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search leads, properties..." className="pl-8 h-8 text-xs" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="h-7 w-7 rounded-full bg-navy flex items-center justify-center text-primary-foreground text-xs font-bold">
                S
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-foreground">Sara Sheikh</p>
                <p className="text-[10px] text-muted-foreground">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
