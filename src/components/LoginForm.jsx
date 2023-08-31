'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const router = useRouter()

  async function loginUser(email, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Login failed.')
    }

    return response.json()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmailError('')
    setPasswordError('')

    try {
      const { token } = await loginUser(email, password)

      // Store JWT on the client-side
      sessionStorage.setItem('jwt', token) // or localStorage, depending on your needs

      router.push('/dashboard')
    } catch (error) {
      if (error.message === 'User not found') {
        setEmailError(error.message)
      } else if (error.message === 'Invalid password') {
        setPasswordError(error.message)
      } else {
        alert(error.message)
      }
      console.error('Error logging in:', error)
    }
  }

  return (
    <>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <h2 className="mt-20 text-lg font-semibold text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Don’t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>{' '}
        for a free trial.
      </p>
      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
        />

        <div>
          <Button type="submit" variant="solid" color="blue" className="w-full">
            <span>
              Sign in <span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
        {/* <div>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-gray-900">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <a
              href="#"
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#4285F4] px-3 py-1.5 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4285F4]"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFFFFF"
                  d="M23.49 12.27v5.52h9.18c-.37 2.91-3.6 8.55-9.18 8.55-5.56 0-10.09-4.61-10.09-10.18s4.53-10.18 10.09-10.18c3.16 0 5.27 1.35 6.47 2.51l4.4-4.26C32.54 1.19 28.69 0 23.49 0 13.56 0 5.26 8.32 5.26 18.15s8.29 18.15 18.22 18.15c11.24 0 18.63-7.86 18.63-18.89 0-1.25-.14-2.23-.31-3.18H23.49z"
                />
              </svg>
              <span className="text-sm font-semibold leading-6">Google</span>
            </a>
          </div>
        </div> */}
      </form>
    </>
  )
}

export default LoginForm
