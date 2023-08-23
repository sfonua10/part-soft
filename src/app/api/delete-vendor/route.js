import mongoose from 'mongoose';
import Vendor from '@/models/vendor'; 

export async function DELETE(request) {
  const { _id } = await request.json();
    
  try {
    const objectId = new mongoose.Types.ObjectId(_id);
    const result = await Vendor.deleteOne({ _id: objectId });

    if (result.deletedCount > 0) {
      return new Response(
        JSON.stringify({ message: 'Vendor deleted successfully.' }),
        { status: 200 },
      )
    } else {
      return new Response(JSON.stringify({ message: 'Vendor not found.' }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error('Error deleting vendor:', error.message);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
