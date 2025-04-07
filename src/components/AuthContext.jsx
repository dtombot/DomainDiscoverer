import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../supabaseClient';
import supabase from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('dd_users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(data?.is_admin ?? false);
      }
      setLoading(false);
    };
    fetchSession();

    const { data: authListener } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('dd_users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setIsAdmin(data?.is_admin ?? false));
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
