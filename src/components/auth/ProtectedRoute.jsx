'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, requiredType = null }) {
  const { user, userType, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push('/login');
        return;
      }

      // Wrong user type
      if (requiredType && userType !== requiredType) {
        if (userType === 'fan') {
          router.push('/fan-dashboard');
        } else if (userType === 'player') {
          router.push('/player-dashboard');
        }
      }
    }
  }, [user, userType, loading, requiredType, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or wrong type
  if (!user || (requiredType && userType !== requiredType)) {
    return null;
  }

  // Authenticated and correct type
  return <>{children}</>;
}
