import LoginForm from '@/components/LoginForm'
import { SlimLayout } from '@/components/SlimLayout'

export const metadata = {
  title: 'Sign In',
}

export default function Login() {
  return (
    <SlimLayout>
      <LoginForm />
    </SlimLayout>
  )
}
