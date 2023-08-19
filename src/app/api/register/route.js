import { connectToDB } from '@/utils/database'
import User from '@/models/user'
import bcrypt from 'bcrypt'

export async function POST(req) {
  const { email, companyName, password } = await req.json()

  try {
    await connectToDB()

    // Hash the password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      companyName,
      password: hashedPassword, // Use the hashed password here
    })
    
    await newUser.save()

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error("Error creating new user:", error);
    return new Response('Failed to create new user', {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
