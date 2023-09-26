'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { signIn, useSession } from 'next-auth/react'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [role, setRole] = useState(''); 
  const { data: session, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    checkJWTValidity()
  }, [])

  useEffect(() => {
    if (loading) return
    if (session) {
      // The user is authenticated
      router.push('/dashboard')
    }
  }, [loading, session])

  const checkJWTValidity = async () => {
    try {
      const jwt = sessionStorage.getItem('jwt')

      if (!jwt) return

      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      })

      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error verifying token:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmailError('')

    try {
      await signIn('email', { email }) // Updated to use 'email' provider and only pass email
      alert('Magic link sent to your email.')
    } catch (error) {
      setEmailError('Failed to send magic link.')
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
      <h2 className="mt-20 text-lg font-semibold text-gray-900">Log in</h2>
      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-y-8">
        <TextField
          label="Enter your email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        {/* <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
            defaultValue="Canada"
          >
            <option value="" disabled>
              Select your role
            </option>
            <option value="mechanic">Mechanic</option>
            <option value="parts-manager">Parts Manager</option>
          </select>
        </div> */}
        <div>
          <Button type="submit" variant="solid" color="blue" className="w-full">
            <span>
              Sign in<span aria-hidden="true">&rarr;</span>
            </span>
          </Button>
        </div>
        <div>
          {/* <div className="relative">
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
          </div> */}
          {/* 
          <div className="mt-6 grid grid-cols-2 gap-4">
            <a
              // href="#"
              onClick={() => signIn('google')}
              className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                  id="Fill-1"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                  id="Fill-2"
                  fill="#EB4335"
                ></path>
                <path
                  d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                  id="Fill-3"
                  fill="#34A853"
                ></path>
                <path
                  d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                  id="Fill-4"
                  fill="#4285F4"
                ></path>
              </svg>
              <span className="text-sm font-semibold leading-6">Google</span>
            </a>
          </div> */}
        </div>
      </form>
    </>
  )
}

export default LoginForm
