import WorkOrder from '@/models/workOrder'
import User from '@/models/user'

export async function GET(request) {
  try {
    // Get the user ID and work order ID from query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const workOrderId = url.searchParams.get('workOrderId');

    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch the user's details from the database
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const organizationId = user.organizationId;

    // If a specific workOrderId is provided, fetch that work order
    if (workOrderId) {
      const workOrder = await WorkOrder.findOne({
        workOrderNumber: workOrderId,
        organizationId: organizationId,  // Ensuring the work order belongs to the user's organization
      });

      if (!workOrder) {
        return new Response(JSON.stringify({ message: 'Work order not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(workOrder), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // If no specific workOrderId is provided, fetch all work orders associated with the user's organization
    else {
      const workOrders = await WorkOrder.find({
        organizationId: organizationId,  // Filtering by organization ID
      });

      return new Response(JSON.stringify(workOrders), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching work orders:', error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
