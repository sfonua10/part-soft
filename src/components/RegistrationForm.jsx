'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'

export const metadata = {
  title: 'Sign Up',
}

const RegistrationForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [password, setPassword] = useState('')
  const [isAgreed, setIsAgreed] = useState(false)
  const [hasUppercase, setHasUppercase] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasMinimumLength, setHasMinimumLength] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const isCompanyNameValid = (name) => {
    return name.length >= 2 && name.length <= 100
  }

  const isBusinessEmail = (email) => {
    const freeEmailProviders = ['gmail.com', 'yahoo.com', 'outlook.com']
    const domain = email.split('@')[1]
    return !freeEmailProviders.includes(domain)
  }

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$.!%*#?&]{8,}$/
    return regex.test(password)
  }

  const handlePasswordChange = (e) => {
    const pass = e.target.value
    setPassword(pass)

    // Set the password as touched once the user starts typing
    if (!passwordTouched && pass !== '') {
      setPasswordTouched(true)
    }

    setHasUppercase(/[A-Z]/.test(pass))
    setHasNumber(/\d/.test(pass))
    setHasMinimumLength(pass.length >= 8)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isCompanyNameValid(companyName)) {
      alert('Company name should be between 2 to 100 characters.')
      return
    }

    if (!isBusinessEmail(email)) {
      alert('Please use a business email.')
      return
    }

    if (!isPasswordValid(password)) {
      alert(
        'Password must include at least one number, one uppercase letter, and be at least 8 characters long.',
      )
      return
    }

    if (!isAgreed) {
      alert('Please agree to the terms of service.')
      return
    }

    // Prepare form data
    const formData = {
      companyName,
      email,
      password,
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // handle successful registration logic here
        router.push('/dashboard')
      } else {
        // handle errors from the server
        const data = await response.json()
        alert(data.error || 'Registration failed.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred while submitting the form.')
    }
  }

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
          onChange={(e) => setCompanyName(e.target.value)}
        />
        {companyName && !isCompanyNameValid(companyName) && (
          <p className="text-xs text-red-500">
            Company name should be between 2 to 100 characters.
          </p>
        )}
        <TextField
          className="col-span-full"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        {email && !isBusinessEmail(email) && (
          <p className="text-xs text-red-500">Please use a business email.</p>
        )}
        <TextField
          className="col-span-full"
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          onChange={handlePasswordChange}
        />
        {passwordTouched && (
          <ul className="mt-1 text-xs text-red-500">
            {!hasUppercase && <li>Must contain an uppercase letter.</li>}
            {!hasNumber && <li>Must contain a number.</li>}
            {!hasMinimumLength && <li>Must be at least 8 characters long.</li>}
          </ul>
        )}

        <div className="col-span-full">
          <input
            type="checkbox"
            id="agreement"
            name="agreement"
            required
            onChange={() => setIsAgreed((prevState) => !prevState)}
          />{' '}
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
  )
}

export default RegistrationForm
