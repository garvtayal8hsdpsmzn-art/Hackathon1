'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';

export default function LogoutButton({ className = '' }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center space-x-2 text-red-600 hover:text-red-700 transition ${className}`}
    >
      <FiLogOut />
      <span>Logout</span>
    </button>
  );
}
