import { connectToDB } from '@/utils/database'
import User from '@/models/user'

export async function PATCH(req) {
  try {
    const { userId, organizationId, organizationName } = await req.json()
    
    if (!userId || !organizationId || !organizationName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await connectToDB()

    // Update user's organizationId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { organizationId, organizationName },
      { new: true }
    )

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Organization updated successfully',
        data: updatedUser,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error updating organization:', error)
    return new Response(JSON.stringify({ error: 'Failed to update organization' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
