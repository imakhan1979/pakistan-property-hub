import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

export default function Contact() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="gradient-hero py-16">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-white/70 text-lg">Our team is available 7 days a week to help you find your perfect property.</p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-navy mb-6">Contact Information</h2>

            {[
              {
                icon: Phone,
                title: 'Phone',
                lines: ['+92-21-3580-0000', '+92-21-3580-0001'],
                href: 'tel:+922135800000',
              },
              {
                icon: MessageCircle,
                title: 'WhatsApp',
                lines: ['+92-300-1234567'],
                href: 'https://wa.me/923001234567',
                external: true,
              },
              {
                icon: Mail,
                title: 'Email',
                lines: ['info@eliteproperties.pk', 'sales@eliteproperties.pk'],
                href: 'mailto:info@eliteproperties.pk',
              },
              {
                icon: MapPin,
                title: 'Office Address',
                lines: ['Plot 23, Main Gizri Road', 'DHA Phase 5, Karachi, Pakistan'],
              },
              {
                icon: Clock,
                title: 'Office Hours',
                lines: ['Mon–Sat: 9:00 AM – 7:00 PM', 'Sunday: 11:00 AM – 4:00 PM'],
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-4 bg-card rounded-2xl border border-border shadow-card">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-0.5">{item.title}</p>
                  {item.lines.map((line, i) => (
                    item.href && i === 0 ? (
                      <a
                        key={i}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noreferrer' : undefined}
                        className="block text-sm text-gold hover:underline"
                      >
                        {line}
                      </a>
                    ) : (
                      <p key={i} className="text-sm text-muted-foreground">{line}</p>
                    )
                  ))}
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/923001234567?text=Hello, I'd like to inquire about a property."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#25D366] text-white font-semibold hover:bg-[#20bd5a] transition-colors shadow-card"
            >
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border shadow-card p-8">
              {!submitted ? (
                <>
                  <h2 className="font-display text-2xl font-bold text-navy mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Full Name *</Label>
                        <Input
                          value={form.name}
                          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Muhammad Ali"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Mobile Number *</Label>
                        <Input
                          value={form.mobile}
                          onChange={(e) => setForm(f => ({ ...f, mobile: e.target.value }))}
                          placeholder="+92-300-XXXXXXX"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Email (Optional)</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="you@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Subject</Label>
                        <Select onValueChange={(v) => setForm(f => ({ ...f, subject: v }))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buy">Looking to Buy</SelectItem>
                            <SelectItem value="rent">Looking to Rent</SelectItem>
                            <SelectItem value="sell">List My Property</SelectItem>
                            <SelectItem value="invest">Investment Advice</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Message *</Label>
                      <Textarea
                        value={form.message}
                        onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Tell us what you're looking for — area, budget, property type..."
                        className="mt-1 resize-none"
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="bg-gold text-navy-dark hover:bg-gold-light font-semibold shadow-gold w-full sm:w-auto px-10">
                      <Send className="h-4 w-4 mr-2" /> Send Message
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-navy mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for contacting Elite Properties. Our team will reach you at <strong>{form.mobile}</strong> within 30 minutes during business hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => { setSubmitted(false); setForm({ name: '', mobile: '', email: '', subject: '', message: '' }); }}
                  >
                    Send Another Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
