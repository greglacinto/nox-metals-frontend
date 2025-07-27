'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function Home() {
  const router = useRouter();
  const { user, token, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (token && user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  }, [token, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}
