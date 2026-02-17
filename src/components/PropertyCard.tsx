import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart, MessageCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Property } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Hi, I'm interested in: ${property.title} (${property.priceLabel})`);
    window.open(`https://wa.me/${property.whatsapp?.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <Link to={`/listings/${property.id}`} className={cn('group block', className)}>
      <div className="rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-muted">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={cn(
              'font-semibold text-xs uppercase tracking-wide shadow',
              property.purpose === 'buy' ? 'bg-navy text-primary-foreground' : 'bg-gold text-navy-dark'
            )}>
              For {property.purpose === 'buy' ? 'Sale' : 'Rent'}
            </Badge>
            {property.featured && (
              <Badge className="bg-white/95 text-gold border-0 font-semibold text-xs shadow">
                ⭐ Featured
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-muted-foreground hover:text-destructive transition-colors shadow"
          >
            <Heart className="h-3.5 w-3.5" />
          </button>

          {/* Type badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full capitalize">{property.type}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-start justify-between mb-2">
            <p className="font-display text-lg font-bold text-navy leading-tight">{property.priceLabel}</p>
            {property.furnished && (
              <span className="flex items-center gap-1 text-xs text-success font-medium">
                <CheckCircle className="h-3 w-3" />Furnished
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-body text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-navy transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
            <MapPin className="h-3 w-3 text-gold flex-shrink-0" />
            <span className="truncate">{property.location}{property.block ? `, ${property.block}` : ''}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground pb-3 border-b border-border">
            <span className="flex items-center gap-1">
              <Square className="h-3 w-3" />
              {property.area} {property.areaUnit}
            </span>
            {property.bedrooms !== undefined && (
              <span className="flex items-center gap-1">
                <Bed className="h-3 w-3" />
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms !== undefined && (
              <span className="flex items-center gap-1">
                <Bath className="h-3 w-3" />
                {property.bathrooms} Baths
              </span>
            )}
          </div>

          {/* Agent + CTA */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-navy flex items-center justify-center text-primary-foreground text-xs font-bold">
                {property.agent.name.charAt(0)}
              </div>
              <span className="text-xs text-muted-foreground">{property.agent.name}</span>
            </div>
            {property.whatsapp && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1.5 border-[hsl(var(--gold))] text-[hsl(var(--gold))] hover:bg-gold/10"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-3 w-3" /> WhatsApp
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
