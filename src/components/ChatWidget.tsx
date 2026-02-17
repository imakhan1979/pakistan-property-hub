import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User, Phone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  'buy': 'We have properties for sale across DHA, Clifton, Bahria Town, PECHS, and more. Would you like to share your budget and preferred area so I can suggest matching listings?',
  'rent': 'We have rental properties ranging from furnished apartments to commercial offices. What area and budget are you looking at?',
  'dha': 'DHA Karachi is one of the most sought-after areas. We have listings in Phase 1, 2, 5, 6, and 8. Which phase interests you?',
  'clifton': 'Clifton is a premium sea-facing locality. We have apartments and houses in Blocks 1, 5, and 9. What type of property are you looking for?',
  'process': 'Our buying process: 1) Property selection, 2) Offer letter, 3) Legal due diligence, 4) Sale agreement, 5) Transfer at registrar office. Our agents guide you every step!',
  'contact': 'You can reach us at +92-21-3580-0000, WhatsApp us at +92-300-1234567, or visit our office at DHA Phase 5, Karachi.',
  'price': 'Our properties range from PKR 75K/month rentals to 12+ Crore for premium sales. What is your budget range?',
  'agent': 'I\'ll connect you with one of our agents right away! Please share your name and mobile number.',
};

const QUICK_REPLIES = ['Buy a property', 'Rent a property', 'DHA listings', 'Clifton listings', 'Talk to an agent'];

const BOT_GREETING = `Hello! 👋 Welcome to **Elite Properties**.

I'm your AI property assistant. I can help you:
• Find properties to buy or rent
• Answer questions about areas like DHA & Clifton
• Explain the buying/renting process
• Connect you with an agent

How can I help you today?`;

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('buy') || lower.includes('purchase') || lower.includes('sale')) return FAQ_RESPONSES.buy;
  if (lower.includes('rent') || lower.includes('lease') || lower.includes('monthly')) return FAQ_RESPONSES.rent;
  if (lower.includes('dha')) return FAQ_RESPONSES.dha;
  if (lower.includes('clifton')) return FAQ_RESPONSES.clifton;
  if (lower.includes('process') || lower.includes('how to') || lower.includes('steps')) return FAQ_RESPONSES.process;
  if (lower.includes('contact') || lower.includes('call') || lower.includes('office')) return FAQ_RESPONSES.contact;
  if (lower.includes('price') || lower.includes('budget') || lower.includes('cost') || lower.includes('how much')) return FAQ_RESPONSES.price;
  if (lower.includes('agent') || lower.includes('human') || lower.includes('speak') || lower.includes('talk')) return FAQ_RESPONSES.agent;
  if (lower.includes('bahria')) return 'Bahria Town Karachi is a gated community with excellent amenities. We have houses and plots in multiple precincts. What size are you looking for?';
  if (lower.includes('plot') || lower.includes('land')) return 'We have residential and commercial plots available in DHA and Bahria Town. Sizes range from 120 sqyd to 1000+ sqyd. What is your budget?';
  if (lower.includes('apartment') || lower.includes('flat')) return 'We have apartments for sale and rent in Clifton, PECHS, and DHA. Furnished and unfurnished options available. What is your requirement?';
  return `Thanks for your message! For personalized assistance, please call us at **+92-21-3580-0000** or WhatsApp **+92-300-1234567**. Our team responds within minutes during business hours (9AM–7PM PKR). Is there anything specific I can help with?`;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      content: BOT_GREETING,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [leadPhase, setLeadPhase] = useState<'chat' | 'capture' | 'done'>('chat');
  const [leadData, setLeadData] = useState({ name: '', mobile: '' });
  const [leadStep, setLeadStep] = useState(0);

  const sendMessage = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Lead capture flow
    if (leadPhase === 'capture') {
      if (leadStep === 0) {
        setLeadData((d) => ({ ...d, name: content }));
        setLeadStep(1);
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: Date.now().toString(),
            role: 'bot',
            content: `Nice to meet you, ${content}! 😊 Please share your **mobile number** (WhatsApp preferred) so an agent can follow up with you.`,
            timestamp: new Date(),
          }]);
        }, 600);
      } else if (leadStep === 1) {
        setLeadData((d) => ({ ...d, mobile: content }));
        setLeadPhase('done');
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: Date.now().toString(),
            role: 'bot',
            content: `✅ Perfect! Your inquiry has been registered. **${leadData.name || 'Our agent'}** will contact you at **${content}** within the next 30 minutes.\n\nYou can also reach us directly:\n📞 +92-21-3580-0000\n💬 WhatsApp: +92-300-1234567`,
            timestamp: new Date(),
          }]);
        }, 600);
      }
      return;
    }

    // Check if user wants agent
    const lower = content.toLowerCase();
    const wantsAgent = lower.includes('agent') || lower.includes('human') || lower.includes('speak') || lower.includes('call me');

    setTimeout(() => {
      if (wantsAgent && leadPhase === 'chat') {
        setLeadPhase('capture');
        setLeadStep(0);
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          role: 'bot',
          content: `I'll have an agent contact you shortly! 🙌\n\nCould you please share your **full name** first?`,
          timestamp: new Date(),
        }]);
      } else {
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          role: 'bot',
          content: getResponse(content),
          timestamp: new Date(),
        }]);
      }
    }, 700);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <span key={i} dangerouslySetInnerHTML={{ __html: formatted }} className="block" />;
    });
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-gold shadow-gold flex items-center justify-center text-navy-dark hover:bg-gold-light transition-all hover:scale-110 animate-pulse-gold"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs font-bold flex items-center justify-center animate-bounce">
              1
            </span>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-card-hover border border-border overflow-hidden animate-scale-in flex flex-col" style={{ height: '520px' }}>
          {/* Header */}
          <div className="bg-gradient-hero px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gold/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Elite AI Assistant</p>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-white/60 text-xs">Online • Replies instantly</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                <div className={cn(
                  'h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs',
                  msg.role === 'bot' ? 'bg-navy text-primary-foreground' : 'bg-gold text-navy-dark'
                )}>
                  {msg.role === 'bot' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>
                <div className={cn(
                  'max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed',
                  msg.role === 'bot'
                    ? 'bg-card border border-border rounded-tl-sm'
                    : 'bg-navy text-primary-foreground rounded-tr-sm'
                )}>
                  {formatContent(msg.content)}
                </div>
              </div>
            ))}

            {/* Quick replies (only on first message) */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_REPLIES.map((r) => (
                  <button
                    key={r}
                    onClick={() => sendMessage(r)}
                    className="text-xs px-3 py-1.5 rounded-full border border-navy/20 text-navy hover:bg-navy hover:text-white transition-all"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {leadPhase === 'done' ? (
            <div className="p-3 bg-card border-t border-border flex-shrink-0">
              <a
                href={`https://wa.me/923001234567?text=${encodeURIComponent('Hello, I need help finding a property.')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
              </a>
            </div>
          ) : (
            <div className="p-3 border-t border-border bg-card flex gap-2 flex-shrink-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="h-9 text-xs"
              />
              <Button size="sm" onClick={() => sendMessage()} className="h-9 px-3 bg-navy text-primary-foreground hover:bg-navy-light flex-shrink-0">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
