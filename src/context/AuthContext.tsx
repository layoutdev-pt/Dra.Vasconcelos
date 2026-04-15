import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; data: any }>;
  signUp: (email: string, password: string, avatarUrl?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to fetch admin status
  const fetchAdminStatus = async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    const { data } = await supabase.from('profiles').select('is_admin').eq('id', userId).maybeSingle();
    setIsAdmin(!!data?.is_admin);
  };

  useEffect(() => {
    // Hydrate from existing session
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('[Auth] Session hydrated:', data.session?.user?.email ?? 'none', error ? `ERROR: ${error.message}` : '');
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchAdminStatus(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] State change event:', event, '| user:', session?.user?.email ?? 'none');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAdminStatus(session.user.id).finally(() => setLoading(false));
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('[Auth] signIn attempt:', email);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('[Auth] signIn ERROR:', error.message, '| status:', error.status);
    } else {
      console.log('[Auth] signIn SUCCESS | user id:', data.user?.id);
    }
    return { error: error?.message ?? null, data };
  };

  const signUp = async (email: string, password: string, avatarUrl?: string) => {
    console.log('[Auth] signUp attempt:', email, '| avatarUrl:', avatarUrl || 'none');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/entrar',
        data: { avatar_url: avatarUrl || '' },
      },
    });
    if (error) {
      console.error('[Auth] signUp ERROR:', error.message, '| status:', error.status, '| full:', error);
    } else {
      console.log('[Auth] signUp response | user:', data.user?.id, '| session:', data.session ? 'present' : 'null (email confirmation required)');
      if (!data.session) {
        console.info('[Auth] No session returned → email confirmation is enabled. User must verify email before logging in.');
      }
    }
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
