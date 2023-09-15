"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { SlimLayout } from '@/components/SlimLayout';
import { Logo } from '@/components/Logo';

export const metadata = {
  title: 'Sign Up',
};

const RegistrationForm2 = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    await signIn('email', { email, callbackUrl: `${window.location.origin}/dashboard` });
  };

  return (
    <SlimLayout>
      {/* ... (rest of your component) */}

      <div className="mt-10">
        <button
          onClick={() => signIn('google', { callbackUrl: `${window.location.origin}/dashboard` })}
          className="mb-4 w-full rounded bg-blue-600 py-2 text-center font-bold text-white"
        >
          Login with Google
        </button>

        <form onSubmit={handleEmailSignIn}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full rounded bg-gray-800 py-2 text-center font-bold text-white"
          >
            Login with Email
          </button>
        </form>
      </div>
    </SlimLayout>
  );
};

export default RegistrationForm2;
