'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const router = useRouter();
  const { user, token, getCurrentUser, isLoading, initialize } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state from localStorage
    initialize();
    setIsInitialized(true);
  }, [initialize]);

  useEffect(() => {
    // Wait for initialization to complete before checking auth
    if (!isInitialized) {
      return;
    }

    console.log('🔒 ProtectedRoute: token =', !!token, 'user =', !!user);
    
    if (!token) {
      console.log('🔒 No token, redirecting to auth');
      router.push('/auth');
      return;
    }

    // Only call getCurrentUser if we have a token but no user data
    // and the user data isn't available in localStorage
    if (!user) {
      const userStr = localStorage.getItem('user');
      console.log('🔒 No user in state, localStorage has user =', !!userStr);
      
      if (!userStr) {
        // No user data in localStorage, try to fetch it
        console.log('🔒 Calling getCurrentUser...');
        getCurrentUser().catch((error) => {
          console.log('🔒 getCurrentUser failed:', error);
          // If getCurrentUser fails, redirect to auth
          router.push('/auth');
        });
      } else {
        console.log('🔒 User data exists in localStorage, should be loaded by initialize()');
      }
      // If userStr exists, the initialize() should have loaded it
    }
  }, [token, user, router, getCurrentUser, isInitialized]);

  useEffect(() => {
    if (user && requireAdmin && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, requireAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 