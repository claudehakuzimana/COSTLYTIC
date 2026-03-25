import { useNavigate } from 'react-router-dom';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {children}
      </div>
    </div>
  );
}
