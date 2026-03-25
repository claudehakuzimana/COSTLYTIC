import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '../client/src/store/authStore';

function LoadingScreen({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-blue-600" />
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}

export function RequireAuth({ children, redirectTo = '/login' }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!(token && user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, mounted, redirectTo, router]);

  if (!mounted || (!isAuthenticated && typeof window !== 'undefined')) {
    return <LoadingScreen />;
  }

  return children;
}

export function PublicOnly({ children, redirectTo = '/app/dashboard' }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!(token && user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, mounted, redirectTo, router]);

  if (!mounted || (isAuthenticated && typeof window !== 'undefined')) {
    return <LoadingScreen />;
  }

  return children;
}
