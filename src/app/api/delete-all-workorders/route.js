import WorkOrder from '@/models/workOrder';

export async function DELETE(request) {
  try {
    const result = await WorkOrder.deleteMany({}); // {} will match all documents in the collection

    if (result.deletedCount > 0) {
      return new Response(
        JSON.stringify({ message: `${result.deletedCount} work orders deleted successfully.` }),
        { status: 200 },
      )
    } else {
      return new Response(JSON.stringify({ message: 'No work orders found to delete.' }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error('Error deleting work orders:', error.message);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
