"use client"
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import { Logo } from '@/components/Logo';
import { SlimLayout } from '@/components/SlimLayout';

export const metadata = {
  title: 'Sign Up',
};

const RegistrationForm = () => {
 const [email, setEmail] = useState('');
  const isBusinessEmail = (email) => {
    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'outlook.com'];
    const domain = email.split('@')[1];
    return !freeEmailProviders.includes(domain);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isBusinessEmail(email)) {
      alert('Please use a business email.');
      return;
    }
    // TODO: Implement the submission logic here
  };

  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Get started for free
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Already registered?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign in
        </Link>{' '}
        to your account.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2"
      >

        <TextField
          className="col-span-full"
          label="Company Name"
          name="company_name"
          type="text"
          required
        />
        <TextField
          className="col-span-full"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className="col-span-full"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        //   helperText="Must include at least one number, one uppercase letter, and be at least 8 characters long."
        />

        <div className="col-span-full">
          <input type="checkbox" id="agreement" name="agreement" required />
          <label htmlFor="agreement" className="ml-2">
            I agree to the{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
          </label>
        </div>
        <div className="col-span-full">
          <Button type="submit" variant="solid" color="blue" className="w-full">
            <span>
              Sign up <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
      </form>
    </SlimLayout>
  );
}

export default RegistrationForm