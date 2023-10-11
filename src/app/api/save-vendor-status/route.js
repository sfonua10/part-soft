// import { connectToDB } from '@/utils/database'
// import Vendor from '@/models/vendor' // Assuming you have a Vendor model similar to the User model

// export async function PUT() {
//   try {
//     await connectToDB()

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: 'Vendor statuses updated successfully.',
//       }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       },
//     )
//   } catch (error) {
//     console.error('Error updating vendor statuses:', error)
//     return new Response(
//       JSON.stringify({ success: false, message: 'An error occurred.' }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       },
//     )
//   }
// }
