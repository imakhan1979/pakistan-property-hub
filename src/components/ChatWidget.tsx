import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
}

const QUICK_REPLIES = ['Buy a property', 'Rent a property', 'DHA listings', 'Clifton listings', 'Talk to an agent'];

const BOT_GREETING = `Hello! 👋 Welcome to **Estate Bnk**.

I'm your AI property assistant. I can help you:
• Find properties to buy or rent
• Answer questions about DHA, Clifton & more
• Explain the buying/renting process
• Connect you with an agent

How can I help you today?`;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'bot', content: BOT_GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [leadPhase, setLeadPhase] = useState<'chat' | 'capture-name' | 'capture-mobile' | 'done'>('chat');
  const [capturedName, setCapturedName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content }]);
  };

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Lead capture flow
    if (leadPhase === 'capture-name') {
      setCapturedName(content);
      setLeadPhase('capture-mobile');
      setTimeout(() => addBotMessage(`Nice to meet you, ${content}! 😊 Please share your **mobile number** (WhatsApp preferred) so an agent can follow up.`), 400);
      return;
    }

    if (leadPhase === 'capture-mobile') {
      setLeadPhase('done');
      // Save lead to database
      await supabase.from('leads').insert({
        name: capturedName,
        mobile: content,
        source: 'website',
        status: 'new',
        interest_types: [],
        intentions: [],
        locations: [],
      });
      setTimeout(() => addBotMessage(`✅ Your inquiry has been registered! **${capturedName}**, an agent will contact you at **${content}** within 30 minutes.\n\n📞 +92-21-3580-0000\n💬 WhatsApp: +92-300-1234567`), 400);
      return;
    }

    // Check for agent request
    const lower = content.toLowerCase();
    if ((lower.includes('agent') || lower.includes('human') || lower.includes('call me') || lower.includes('speak')) && leadPhase === 'chat') {
      setLeadPhase('capture-name');
      setTimeout(() => addBotMessage(`I'll have an agent contact you shortly! 🙌\n\nCould you please share your **full name** first?`), 400);
      return;
    }

    // Call AI edge function
    setLoading(true);
    try {
      const history = messages
        .filter(m => m.id !== '0')
        .concat(userMsg)
        .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: history },
      });

      if (error) throw error;
      addBotMessage(data.reply);
    } catch {
      addBotMessage("I'm having trouble connecting. Please call us at **+92-21-3580-0000** or WhatsApp **+92-300-1234567**.");
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) =>
    content.split('\n').map((line, i) => {
      const html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <span key={i} dangerouslySetInnerHTML={{ __html: html }} className="block" />;
    });

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-gold shadow-gold flex items-center justify-center text-navy-dark hover:bg-gold-light transition-all hover:scale-110"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white text-xs font-bold flex items-center justify-center animate-bounce">1</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-card-hover border border-border overflow-hidden flex flex-col" style={{ height: '520px' }}>
          <div className="bg-gradient-hero px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gold/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Estate Bnk AI Assistant</p>
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

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                <div className={cn('h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs', msg.role === 'bot' ? 'bg-navy text-primary-foreground' : 'bg-gold text-navy-dark')}>
                  {msg.role === 'bot' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>
                <div className={cn('max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed', msg.role === 'bot' ? 'bg-card border border-border rounded-tl-sm' : 'bg-navy text-primary-foreground rounded-tr-sm')}>
                  {formatContent(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-3 py-2">
                  <div className="flex gap-1 items-center h-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_REPLIES.map(r => (
                  <button key={r} onClick={() => sendMessage(r)} className="text-xs px-3 py-1.5 rounded-full border border-navy/20 text-navy hover:bg-navy hover:text-white transition-all">
                    {r}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {leadPhase === 'done' ? (
            <div className="p-3 bg-card border-t border-border flex-shrink-0">
              <a href="https://wa.me/923001234567?text=Hello%2C%20I%20need%20help%20finding%20a%20property." target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-colors">
                <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
              </a>
            </div>
          ) : (
            <div className="p-3 border-t border-border bg-card flex gap-2 flex-shrink-0">
              <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type your message..." className="h-9 text-xs" />
              <Button size="sm" onClick={() => sendMessage()} disabled={loading} className="h-9 px-3 bg-navy text-primary-foreground hover:bg-navy-light flex-shrink-0">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
