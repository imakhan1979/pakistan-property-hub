import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, TrendingUp, MapPin, Star, ChevronRight, Play, Shield, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { properties } from '@/data/mockData';

const STATS = [
  { value: '500+', label: 'Properties Listed', icon: Building2 },
  { value: '1,200+', label: 'Happy Clients', icon: Star },
  { value: '15+', label: 'Years Experience', icon: Award },
  { value: '98%', label: 'Client Satisfaction', icon: TrendingUp },
];

const AREAS = [
  { name: 'DHA Phase 6', count: 48, img: 'https://images.unsplash.com/photo-1601929862217-0571ef63fbfe?w=400&q=80' },
  { name: 'Clifton', count: 35, img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80' },
  { name: 'Bahria Town', count: 62, img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80' },
  { name: 'PECHS', count: 28, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },
  { name: 'DHA Phase 8', count: 31, img: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=400&q=80' },
  { name: 'Gulshan-e-Iqbal', count: 24, img: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&q=80' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'all' | 'buy' | 'rent'>('all');

  const filtered = properties.filter(p =>
    activeTab === 'all' || p.purpose === activeTab
  ).filter(p => p.status === 'published');

  const featured = properties.filter(p => p.featured && p.status === 'published');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center gradient-hero overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
            alt="Luxury property"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/50 via-navy/60 to-navy-dark/80" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />

        <div className="container relative z-10 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            Pakistan's Premium Real Estate Platform
          </div>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in">
            Find Your Perfect{' '}
            <span className="text-gold">Property</span>
            <br />in Karachi
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            DHA, Clifton, Bahria Town & beyond. Buy, rent, or invest with Pakistan's most trusted real estate team.
          </p>

          <div className="animate-fade-in mb-12">
            <SearchBar variant="hero" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
                <p className="font-display text-2xl font-bold text-gold">{stat.value}</p>
                <p className="text-white/60 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Hand-Picked for You</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Featured Properties</h2>
          </div>
          <Link to="/listings?featured=true" className="hidden md:flex items-center gap-1.5 text-sm font-medium text-navy hover:text-gold transition-colors">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.slice(0, 3).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Browse by Area */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Explore by Location</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Popular Areas</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {AREAS.map((area) => (
              <Link
                key={area.name}
                to={`/listings?location=${encodeURIComponent(area.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
              >
                <img
                  src={area.img}
                  alt={area.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-navy/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm leading-tight">{area.name}</p>
                  <p className="text-gold text-xs">{area.count} listings</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Listings with tabs */}
      <section className="container py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">New on Market</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Latest Listings</h2>
          </div>
          <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
            {(['all', 'buy', 'rent'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                  activeTab === tab ? 'bg-navy text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'all' ? 'All' : tab === 'buy' ? 'For Sale' : 'For Rent'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/listings">
            <Button size="lg" className="bg-navy text-primary-foreground hover:bg-navy-light px-10 font-semibold">
              View All Properties <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Us */}
      <section className="gradient-hero py-16">
        <div className="container">
          <div className="text-center mb-10">
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">Our Promise</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Why Choose Elite Properties?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Verified Listings',
                desc: 'Every property is physically verified by our team. No fake listings, guaranteed.',
              },
              {
                icon: Clock,
                title: 'Fast Turnaround',
                desc: 'Our agents respond within 30 minutes. Site visits arranged within 24 hours.',
              },
              {
                icon: Award,
                title: 'Legal Expertise',
                desc: 'Full legal due diligence, documentation, and transfer support included.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 text-center">
                <div className="h-12 w-12 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container py-16">
        <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-gold">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-navy-dark mb-2">
              Have a Property to Sell or Rent?
            </h3>
            <p className="text-navy/70 text-sm">List with us for free. Our agents will handle viewings, negotiations, and paperwork.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/contact">
              <Button className="bg-navy-dark text-primary-foreground hover:bg-navy font-semibold px-6">
                List Your Property
              </Button>
            </Link>
            <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer">
              <Button variant="outline" className="border-navy-dark/40 text-navy-dark hover:bg-navy-dark/10 font-semibold px-6">
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
