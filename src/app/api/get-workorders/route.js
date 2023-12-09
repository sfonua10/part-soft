import WorkOrder from '@/models/workOrder';
import User from '@/models/user';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const workOrderId = url.searchParams.get('workOrderId');

    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch the user's details to get the organizationId
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (workOrderId) {
      // Fetch the specific work order within the user's organization
      const workOrder = await WorkOrder.findOne({
        workOrderNumber: workOrderId,
        organizationId: user.organizationId,
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
    } else {
      // Fetch all work orders within the user's organization
      const workOrders = await WorkOrder.find({ organizationId: user.organizationId });
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
