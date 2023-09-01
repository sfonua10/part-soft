import { headers } from 'next/headers';
import { connectToDB } from '@/utils/database'
import jwt from 'jsonwebtoken'

export async function POST() {
  try {
    await connectToDB()
    // Use the new headers function to get the request headers
    const headersList = headers();
    const authHeader = headersList.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authorization header missing or malformed' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const token = authHeader.split(' ')[1]

    // Validate the token
    const secretKey = process.env.JWT_SECRET_KEY
    const decoded = jwt.verify(token, secretKey)

    // If the token is valid, it will proceed to this line.
    // If it's not valid, it will throw an error and be caught by the catch block.
    return new Response(
      JSON.stringify({
        success: true,
        userId: decoded.userId,
        message: 'Token is valid',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    } else if (error.name === 'TokenExpiredError') {
      return new Response(JSON.stringify({ error: 'Token has expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      console.error('Error verifying token:', error)
      return new Response(JSON.stringify({ error: 'Failed to verify token' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}
