import WorkOrder from '@/models/workOrder'
import User from '@/models/user'

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const workOrderId = url.searchParams.get('workOrderId');

    // Validate userId early to avoid unnecessary database calls
    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Use Promise.all to run both queries in parallel when both userId and workOrderId are provided
    // This reduces waiting time when both user and workOrder are needed
    const [user, workOrder] = await Promise.all([
      User.findById(userId),
      workOrderId ? WorkOrder.findOne({ workOrderNumber: workOrderId }) : null,
    ]);

    // Check user existence
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If workOrderId is provided, validate the workOrder
    if (workOrderId) {
      if (!workOrder || workOrder.organizationId !== user.organizationId) {
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

    // Fetch all work orders if no specific workOrderId is provided
    const workOrders = await WorkOrder.find({
      organizationId: user.organizationId,
    });

    return new Response(JSON.stringify(workOrders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching work orders:', error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
