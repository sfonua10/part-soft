import User from '@/models/user'

export async function PUT(req) {
  try {
    const { _id, name, role, image, email } = await req.json()  // <-- added email here

    let updateQuery = {}

    if (name !== undefined) {
      updateQuery['name'] = name
    }

    if (role !== undefined) {
      updateQuery['role'] = role
    }

    if (image !== undefined) {
      updateQuery['image'] = image
    }

    if (email !== undefined) {  // <-- added email update logic here
      updateQuery['email'] = email
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updateQuery, {
      new: true,
    })

    if (!updatedUser) {
      throw new Error('User not found')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User updated successfully.',
        user: updatedUser,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error updating user:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
