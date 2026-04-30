import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileLoaded = useRef(false);

  // Load profile from DB — never blocks, never hangs
  const loadProfile = (authUser) => {
    const base = {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.full_name || '',
      status: 'loading' // temporary until profile loads
    };

    // Set user immediately so app isn't stuck
    setUser(base);

    // Then load profile in background (non-blocking)
    if (!supabase) return;
    
    supabase
      .from('profiles')
      .select('name, status, role')
      .eq('id', authUser.id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          setUser(prev => prev?.id === authUser.id ? { ...prev, ...data } : prev);
        } else {
          // No profile found, default to pending
          setUser(prev => prev?.id === authUser.id ? { ...prev, status: 'pending' } : prev);
        }
        profileLoaded.current = true;
      });
  };

  useEffect(() => {
    // 1. Check existing session
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadProfile(data.session.user);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    // 2. Listen for login/logout — NOT async, never blocks
    let subscription = null;
    if (supabase) {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadProfile(session.user);
        } else {
          setUser(null);
        }
      });
      subscription = sub;
    } else {
      // Local Mode: Look for local user
      const localUser = localStorage.getItem('auth_user_local');
      if (localUser) {
        setUser(JSON.parse(localUser));
      }
    }

    // 3. Emergency timeout
    const timeout = setTimeout(() => setLoading(false), 4000);

    return () => {
      if (subscription) subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const login = async (email, password) => {
    if (!supabase) {
      // Local Auth Fallback
      const localUsers = JSON.parse(localStorage.getItem('auth_users_all') || '[]');
      const match = localUsers.find(u => u.email === email && u.password === password);
      if (match) {
        const userObj = { id: match.id, email: match.email, name: match.name, status: 'approved' };
        setUser(userObj);
        localStorage.setItem('auth_user_local', JSON.stringify(userObj));
        return;
      }
      throw 'Invalid credentials in Local Mode.';
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error.message;
  };


  const register = async (name, email, password) => {
    if (!supabase) {
      // Local Auth Fallback
      const localUsers = JSON.parse(localStorage.getItem('auth_users_all') || '[]');
      if (localUsers.find(u => u.email === email)) throw 'Email already registered.';
      
      const newUser = { id: 'local_' + Date.now(), name, email, password };
      localStorage.setItem('auth_users_all', JSON.stringify([...localUsers, newUser]));
      
      const userObj = { id: newUser.id, email, name, status: 'approved' };
      setUser(userObj);
      localStorage.setItem('auth_user_local', JSON.stringify(userObj));
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) throw error.message;

    if (!data.session) {
      throw 'Account created! Check your email to confirm, then log in.';
    }

    // Create profile row
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: data.user.id, name, email, status: 'pending'
    }, { onConflict: 'id' });
    
    if (profileErr) console.warn('Profile insert note:', profileErr.message);
  };


  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem('auth_user_local');
    setUser(null);
  };


  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#0f172a', fontWeight: 600 }}>
        ⚡ Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
