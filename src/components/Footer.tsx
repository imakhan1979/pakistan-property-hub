import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white/80">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold">
                <Building2 className="h-5 w-5 text-navy-dark" />
              </div>
              <div>
                <p className="font-display font-bold text-white">Estate Bnk</p>
                <p className="text-[10px] tracking-widest text-gold uppercase">Karachi, Pakistan</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-4">
              Your trusted partner in Pakistan's real estate market. Over 15 years of experience in DHA, Clifton, and premium Karachi locations.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy-dark transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Properties</h4>
            <ul className="space-y-2">
              {[
                { label: 'Houses for Sale', href: '/listings?purpose=buy&type=house' },
                { label: 'Apartments for Rent', href: '/listings?purpose=rent&type=apartment' },
                { label: 'Commercial Offices', href: '/listings?type=office' },
                { label: 'Plots & Land', href: '/listings?type=plot' },
                { label: 'Featured Listings', href: '/listings?featured=true' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-white/60 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Top Areas</h4>
            <ul className="space-y-2">
              {['DHA Phase 6', 'DHA Phase 8', 'Clifton', 'Bahria Town', 'PECHS', 'Gulshan-e-Iqbal'].map((area) => (
                <li key={area}>
                  <Link
                    to={`/listings?location=${encodeURIComponent(area)}`}
                    className="text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    Properties in {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">DHA Phase 5, Main Gizri Road, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="tel:+922135800000" className="text-sm text-white/60 hover:text-gold transition-colors">+92-21-3580-0000</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="text-sm text-white/60 hover:text-gold transition-colors">+92-300-1234567</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="mailto:info@estatebnk.pk" className="text-sm text-white/60 hover:text-gold transition-colors">info@estatebnk.pk</a>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-xl text-xs text-white/50">
              <p className="font-medium text-white/70 mb-0.5">Office Hours</p>
              <p>Mon–Sat: 9:00 AM – 7:00 PM</p>
              <p>Sunday: 11:00 AM – 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40">© 2025 Estate Bnk. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-white/40 hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-white/40 hover:text-gold transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
