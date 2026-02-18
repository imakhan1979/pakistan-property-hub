import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Square, Car, CheckCircle, Phone, MessageCircle,
  ArrowLeft, Share2, Heart, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

function mapProperty(p: any) {
  return {
    id: p.id, title: p.title, type: p.type, purpose: p.purpose,
    price: p.price, priceLabel: p.price_label, area: p.area, areaUnit: p.area_unit,
    bedrooms: p.bedrooms, bathrooms: p.bathrooms, parking: p.parking, furnished: p.furnished,
    city: p.city, location: p.location, block: p.block, description: p.description || '',
    images: p.images?.length ? p.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
    features: p.features || [],
    agent: { id: 'default', name: 'Estate Bnk Agent', phone: '+92-21-3580-0000', email: 'info@estatebnk.pk', role: 'agent' },
    status: p.status, featured: p.featured, createdAt: p.created_at, whatsapp: p.whatsapp,
  };
}

export default function ListingDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<ReturnType<typeof mapProperty> | null>(null);
  const [similar, setSimilar] = useState<ReturnType<typeof mapProperty>[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [formData, setFormData] = useState({ name: '', mobile: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('properties').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        const mapped = mapProperty(data);
        setProperty(mapped);
        // Fetch similar
        supabase.from('properties').select('*').eq('type', data.type).eq('status', 'published').neq('id', id).limit(3)
          .then(({ data: simData }) => setSimilar((simData || []).map(mapProperty)));
      }
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await supabase.from('leads').insert({
      name: formData.name,
      mobile: formData.mobile,
      notes: `${formData.message}\n\nInterested in: ${property?.title}`,
      source: 'website',
      status: 'new',
      interest_types: [property?.type || ''],
      intentions: [],
      locations: [property?.location || ''],
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  const handleWhatsApp = () => {
    if (!property) return;
    const msg = encodeURIComponent(`Hi, I'm interested in: ${property.title} (${property.priceLabel}). Please share more details.`);
    window.open(`https://wa.me/${(property.whatsapp || '923001234567').replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16">
          <div className="h-96 bg-muted rounded-2xl animate-pulse" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-display text-2xl text-navy mb-2">Property not found</p>
            <Link to="/listings"><Button>Browse Listings</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-muted border-b border-border">
        <div className="container py-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-navy">Home</Link>
          <span>/</span>
          <Link to="/listings" className="hover:text-navy">Properties</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-48">{property.title}</span>
        </div>
      </div>

      <div className="container py-8">
        <Link to="/listings" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-muted">
              <img src={property.images[imgIdx]} alt={property.title} className="w-full h-72 md:h-96 object-cover" />
              {property.images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + property.images.length) % property.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % property.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {property.images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)} className={cn('h-1.5 rounded-full transition-all', i === imgIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50')} />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={property.purpose === 'buy' ? 'bg-navy text-primary-foreground' : 'bg-gold text-navy-dark'}>
                  For {property.purpose === 'buy' ? 'Sale' : 'Rent'}
                </Badge>
                {property.featured && <Badge className="bg-white text-gold border-0">⭐ Featured</Badge>}
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <button className="h-9 w-9 rounded-full bg-white/90 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shadow">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 rounded-full bg-white/90 flex items-center justify-center text-muted-foreground hover:text-navy transition-colors shadow">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {property.images.length > 1 && (
              <div className="flex gap-3">
                {property.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={cn('h-16 w-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all', i === imgIdx ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-80')}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-navy mb-1">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 text-gold" />
                    {property.location}{property.block ? `, ${property.block}` : ''}, {property.city}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-bold text-navy">{property.priceLabel}</p>
                  {property.purpose === 'rent' && <p className="text-muted-foreground text-xs">per month</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Square, label: 'Area', value: `${property.area} ${property.areaUnit}` },
                ...(property.bedrooms != null ? [{ icon: Bed, label: 'Bedrooms', value: `${property.bedrooms} Beds` }] : []),
                ...(property.bathrooms != null ? [{ icon: Bath, label: 'Bathrooms', value: `${property.bathrooms} Baths` }] : []),
                ...(property.parking != null ? [{ icon: Car, label: 'Parking', value: `${property.parking} Cars` }] : []),
              ].map((spec) => (
                <div key={spec.label} className="bg-muted rounded-xl p-3 text-center">
                  <spec.icon className="h-5 w-5 text-gold mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">{spec.label}</p>
                  <p className="font-semibold text-sm text-foreground">{spec.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {property.features.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-navy mb-3">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.features.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" /> {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-display text-xl font-bold text-navy mb-3">Property Details</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Type', value: property.type.charAt(0).toUpperCase() + property.type.slice(1) },
                  { label: 'Purpose', value: property.purpose === 'buy' ? 'For Sale' : 'For Rent' },
                  { label: 'City', value: property.city },
                  { label: 'Area', value: property.location },
                  ...(property.furnished != null ? [{ label: 'Furnished', value: property.furnished ? 'Yes' : 'No' }] : []),
                  { label: 'Listed', value: new Date(property.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map((d) => (
                  <div key={d.label} className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">{d.label}</span>
                    <span className="font-medium text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Agent + Inquiry */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card sticky top-24">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="h-12 w-12 rounded-full bg-navy flex items-center justify-center text-primary-foreground text-lg font-bold">E</div>
                <div>
                  <p className="font-semibold text-foreground">Estate Bnk Agent</p>
                  <p className="text-xs text-muted-foreground">Estate Bnk Agent</p>
                  <Badge variant="secondary" className="text-xs mt-0.5">Verified ✓</Badge>
                </div>
              </div>

              <div className="flex gap-3 mb-5">
                <a href="tel:+922135800000" className="flex-1">
                  <Button className="w-full bg-navy text-primary-foreground hover:bg-navy-light gap-2">
                    <Phone className="h-4 w-4" /> Call
                  </Button>
                </a>
                <Button className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2" onClick={handleWhatsApp}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <p className="font-semibold text-sm text-foreground">Send an Inquiry</p>
                  <div>
                    <Label className="text-xs">Full Name</Label>
                    <Input value={formData.name} onChange={e => setFormData(d => ({ ...d, name: e.target.value }))} placeholder="Muhammad Ali" className="mt-1 h-9 text-sm" required />
                  </div>
                  <div>
                    <Label className="text-xs">Mobile Number</Label>
                    <Input value={formData.mobile} onChange={e => setFormData(d => ({ ...d, mobile: e.target.value }))} placeholder="+92-300-1234567" className="mt-1 h-9 text-sm" required />
                  </div>
                  <div>
                    <Label className="text-xs">Message</Label>
                    <Textarea value={formData.message} onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                      placeholder="I'm interested in this property." className="mt-1 text-sm resize-none" rows={3} />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full bg-gold text-navy-dark hover:bg-gold-light font-semibold shadow-gold">
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-10 w-10 text-success mx-auto mb-2" />
                  <p className="font-semibold text-foreground mb-1">Inquiry Sent!</p>
                  <p className="text-xs text-muted-foreground">An agent will contact you within 30 minutes.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl font-bold text-navy mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(p => <PropertyCard key={p.id} property={p as any} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
