import { Link } from 'react-router-dom';
import { Award, Target, Eye, Users, Linkedin, Building2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { Button } from '@/components/ui/button';

const LEADERSHIP = [
  {
    name: 'Khalid Saeed',
    title: 'Founder & CEO',
    bio: 'With 20+ years in Pakistani real estate, Khalid established Elite Properties in 2008 with a mission to bring transparency and professionalism to Karachi\'s property market.',
    linkedin: '#',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80',
  },
  {
    name: 'Mariam Zafar',
    title: 'Director of Sales',
    bio: 'Mariam leads a team of 30+ agents across DHA and Clifton. Known for her deep market knowledge and client-first approach with a track record of 500+ successful transactions.',
    linkedin: '#',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
  },
  {
    name: 'Asad Iqbal',
    title: 'Head of Commercial Properties',
    bio: 'Asad specializes in commercial real estate, helping businesses find ideal office and retail spaces. 15 years of experience in PECHS, Clifton commercial corridors.',
    linkedin: '#',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
  },
  {
    name: 'Sobia Naz',
    title: 'Chief Marketing Officer',
    bio: 'Sobia drives Elite\'s digital-first strategy and brand presence. Under her leadership, the company grew its online inquiries by 300% in two years.',
    linkedin: '#',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
  },
];

const MILESTONES = [
  { year: '2008', event: 'Founded in DHA Phase 5, Karachi with 5 agents' },
  { year: '2012', event: 'Expanded to Clifton and Bahria Town markets' },
  { year: '2015', event: 'Launched digital platform, first in Karachi' },
  { year: '2018', event: 'Closed PKR 1 Billion in transactions in a single year' },
  { year: '2021', event: 'Opened 3rd office branch — North Karachi' },
  { year: '2024', event: 'Launched AI-powered property matching system' },
];

const VALUES = [
  { icon: Award, title: 'Integrity', desc: 'No hidden fees, no false listings. We build trust through transparency.' },
  { icon: Target, title: 'Excellence', desc: 'Every transaction is handled with professional care and diligence.' },
  { icon: Users, title: 'Client First', desc: 'Your needs drive every decision we make.' },
  { icon: Building2, title: 'Market Expertise', desc: 'Deep knowledge of Karachi\'s neighborhoods, trends, and legalities.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="gradient-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10 text-center">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">Est. 2008</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">Elite Properties</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">Karachi's most trusted real estate company — building legacies, one property at a time.</p>
        </div>
      </div>

      {/* Legacy */}
      <section className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-5">A Legacy Built on Trust</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Elite Properties was founded in 2008 by Khalid Saeed with a singular vision: to bring professionalism, transparency, and genuine client service to Karachi's real estate market.</p>
              <p>Starting with a small office in DHA Phase 5 and just five agents, we have grown into a team of over 50 professionals managing hundreds of residential and commercial listings across Karachi's most sought-after neighborhoods.</p>
              <p>Over 15 years and 1,200+ successful transactions later, we remain committed to the same values that our founder instilled from day one — integrity, expertise, and putting our clients first.</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex gap-4 items-start group">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors">
                    <div className="h-2 w-2 rounded-full bg-gold group-hover:bg-white transition-colors" />
                  </div>
                  {i < MILESTONES.length - 1 && <div className="w-0.5 h-4 bg-border mt-0.5" />}
                </div>
                <div className="pb-3">
                  <span className="text-gold font-bold text-sm">{m.year}</span>
                  <p className="text-foreground text-sm mt-0.5">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" className="bg-muted py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 border border-border shadow-card">
              <div className="h-12 w-12 rounded-xl bg-navy/10 flex items-center justify-center mb-5">
                <Eye className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-display text-2xl font-bold text-navy mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be Pakistan's most trusted and innovative real estate platform — where every buyer, seller, and investor finds their ideal property with complete confidence and transparency.
              </p>
            </div>
            <div className="bg-navy rounded-2xl p-8 shadow-card-hover">
              <div className="h-12 w-12 rounded-xl bg-gold/20 flex items-center justify-center mb-5">
                <Target className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-white/70 leading-relaxed">
                To simplify property transactions through verified listings, expert guidance, and technology — making real estate accessible, fair, and efficient for all Pakistanis.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto">
            {VALUES.map((v) => (
              <div key={v.title} className="text-center p-4">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <v.icon className="h-5 w-5 text-gold" />
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">{v.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="container py-16">
        <div className="text-center mb-10">
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-2">The Team Behind the Brand</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Our Leadership</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEADERSHIP.map((person) => (
            <div key={person.name} className="bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all group">
              <div className="relative h-56 overflow-hidden bg-muted">
                <img
                  src={person.img}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/50 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-bold text-navy">{person.name}</h3>
                <p className="text-gold text-xs font-semibold mb-2">{person.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{person.bio}</p>
                <a
                  href={person.linkedin}
                  className="inline-flex items-center gap-1.5 text-xs text-navy hover:text-gold transition-colors mt-3"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-12">
        <div className="container text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-navy mb-3">Ready to Find Your Property?</h3>
          <p className="text-muted-foreground mb-6">Browse our latest listings or speak with an agent today.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/listings">
              <Button className="bg-navy text-primary-foreground hover:bg-navy-light font-semibold px-8">
                Browse Listings <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-navy text-navy hover:bg-navy/5 font-semibold px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
