import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  user: User;
  session: Session;
  agentId: string | null;
  agentName: string | null;
  role: 'admin' | 'agent' | null;
}

interface AuthContextType {
  authUser: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (user: User, session: Session) => {
    // Get role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    // Get agent profile
    const { data: agentData } = await supabase
      .from('agents')
      .select('id, name')
      .eq('user_id', user.id)
      .maybeSingle();

    setAuthUser({
      user,
      session,
      agentId: agentData?.id ?? null,
      agentName: agentData?.name ?? user.email ?? null,
      role: roleData?.role ?? null,
    });
  };

  useEffect(() => {
    // Listen FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUserData(session.user, session);
        } else {
          setAuthUser(null);
        }
        setLoading(false);
      }
    );

    // Then get existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadUserData(session.user, session);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{
      authUser,
      loading,
      signIn,
      signOut,
      isAdmin: authUser?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
