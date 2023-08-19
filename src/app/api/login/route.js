import { connectToDB } from '@/utils/database'
import User from '@/models/user'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export async function POST(req) {
  const { email, password } = await req.json()

  try {
    await connectToDB()

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    // Generating a JWT
    const tokenPayload = { userId: user._id, email: user.email } // You can store basic user info in token payload
    const secretKey = process.env.JWT_SECRET_KEY
    const jwtToken = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' }) // Token will expire in 1 hour

    return new Response(
      JSON.stringify({
        success: true,
        token: jwtToken,
        message: 'Logged in successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error logging in:', error)
    return new Response(JSON.stringify({ error: 'Failed to log in' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
