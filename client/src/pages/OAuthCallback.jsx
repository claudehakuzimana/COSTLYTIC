import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loginWithToken = useAuthStore((s) => s.loginWithToken);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      const token = searchParams.get('token');
      const err = searchParams.get('error');

      if (err) {
        setError(err);
        return;
      }

      if (!token) {
        setError('missing_token');
        return;
      }

      try {
        await loginWithToken(token);
        toast.success('Signed in with Google');
        navigate('/dashboard', { replace: true });
      } catch (e) {
        console.error('OAuth callback error:', e);
        setError('profile_failed');
      }
    };

    run();
  }, [loginWithToken, navigate, searchParams]);

  if (!error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Signing you in…</p>
          <p className="text-gray-500 text-sm mt-1">Completing Google authentication</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <p className="text-gray-900 font-semibold">Google sign-in didn’t complete</p>
        <p className="text-gray-600 text-sm mt-2">Error: {error}</p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="mt-6 inline-flex items-center justify-center bg-gray-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition text-sm"
        >
          Back to sign in
        </button>
      </div>
    </div>
  );
}

