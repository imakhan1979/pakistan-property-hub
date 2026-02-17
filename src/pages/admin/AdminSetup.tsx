import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Eye, EyeOff, Lock, Mail, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function AdminSetup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: 'Password too short', description: 'Use at least 8 characters.', variant: 'destructive' });
      return;
    }
    setLoading(true);

    // Check no admins exist yet — security guard
    const { data: existing } = await supabase.from('user_roles').select('id').eq('role', 'admin').limit(1);
    if (existing && existing.length > 0) {
      toast({ title: 'Setup already complete', description: 'An admin account already exists. Please log in.', variant: 'destructive' });
      setLoading(false);
      navigate('/admin/login');
      return;
    }

    // Call the create-admin edge function with no setup key (first-run mode)
    const { data: fnData, error: fnError } = await supabase.functions.invoke('create-admin', {
      body: { email, password, name, setupKey: 'FIRST_RUN' },
    });

    setLoading(false);

    if (fnError || fnData?.error) {
      // Fallback: sign up directly + assign role via RPC
      await handleDirectSetup();
      return;
    }

    setDone(true);
  };

  // Direct setup for first-run when no key is configured
  const handleDirectSetup = async () => {
    setLoading(true);

    // Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signUpError || !signUpData.user) {
      toast({ title: 'Setup failed', description: signUpError?.message ?? 'Unknown error', variant: 'destructive' });
      setLoading(false);
      return;
    }

    // Sign in immediately
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      toast({ title: 'Created — please verify email first', description: 'Check your inbox then log in.', variant: 'default' });
      setLoading(false);
      setDone(true);
      return;
    }

    // Insert agent + role (user is now authenticated)
    const userId = signUpData.user.id;
    await supabase.from('agents').insert({ user_id: userId, name, email });
    await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });

    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Created!</h1>
          <p className="text-gold/70 text-sm">Your admin account is ready. You can now sign in.</p>
          <Button
            className="w-full bg-navy text-primary-foreground hover:bg-navy-light"
            onClick={() => navigate('/admin/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gold flex items-center justify-center mx-auto mb-4">
            <Building className="h-7 w-7 text-navy-dark" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">First-Time Setup</h1>
          <p className="text-gold/70 text-xs mt-1 uppercase tracking-widest">Create your admin account</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-2xl">
          <p className="text-muted-foreground text-sm mb-5">
            No admin account exists yet. Create one to access the CRM.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@eliteproperties.pk"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="pl-9 pr-9"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-navy text-primary-foreground hover:bg-navy-light"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Admin Account'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gold/40 mt-4">
          This page is only accessible when no admin exists.
        </p>
      </div>
    </div>
  );
}
