import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Building2, Phone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Buy', href: '/listings?purpose=buy' },
  { label: 'Rent', href: '/listings?purpose=rent' },
  {
    label: 'Company',
    href: '#',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Leadership', href: '/about#leadership' },
      { label: 'Vision & Mission', href: '/about#vision' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-navy-dark/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold group-hover:scale-105 transition-transform">
            <Building2 className="h-5 w-5 text-navy-dark" />
          </div>
          <div className="leading-tight">
            <span className="block font-display text-base font-bold text-white">Estate</span>
            <span className="block font-body text-[10px] font-medium tracking-widest text-gold uppercase">Bnk</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/80 hover:text-gold transition-colors rounded-md"
                >
                  {item.label}
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', dropdownOpen && 'rotate-180')} />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-44 rounded-xl bg-white shadow-card-hover border border-border py-1 animate-scale-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-navy transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors rounded-md',
                  location.pathname === item.href.split('?')[0]
                    ? 'text-gold'
                    : 'text-white/80 hover:text-gold'
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+922135800000" className="flex items-center gap-1.5 text-sm text-white/70 hover:text-gold transition-colors">
            <Phone className="h-3.5 w-3.5" />
            <span>+92-21-3580-0000</span>
          </a>
          <Link to="/admin">
            <Button size="sm" className="bg-gold text-navy-dark hover:bg-gold-light font-semibold shadow-gold">
              Agent Login
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white/80 hover:text-gold transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-navy-dark border-t border-white/10 px-4 pb-4 animate-fade-in">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label}>
                <p className="px-2 pt-3 pb-1 text-xs font-semibold uppercase tracking-widest text-gold/70">{item.label}</p>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className="block px-4 py-2 text-sm text-white/80 hover:text-gold"
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className="block px-2 py-3 text-sm font-medium text-white/80 hover:text-gold border-b border-white/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/admin">
              <Button className="w-full bg-gold text-navy-dark hover:bg-gold-light font-semibold">Agent Login</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
