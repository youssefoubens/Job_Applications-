'use client';

import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check active session
    const getUser = async () => {
      setLoading(true);
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
      return false;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Check your email to confirm your account');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Logged out successfully');
      router.push('/login');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      return false;
    }
  };

  return {
    user,
    loading,
    login,
    signup,
    logout,
  };
}
