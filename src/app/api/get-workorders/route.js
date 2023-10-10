import WorkOrder from "@/models/workOrder";

export async function GET(request) {
    try {
        // Get the work order ID from query parameters
        const url = new URL(request.url);
        const workOrderId = url.searchParams.get('workOrderId');

        // If a specific workOrderId is provided, fetch that work order
        if (workOrderId) {
            const workOrder = await WorkOrder.findOne({ workOrderNumber: workOrderId });

            if (!workOrder) {
                return new Response(JSON.stringify({ message: "Work order not found" }), {
                    status: 404,
                });
            }

            return new Response(JSON.stringify(workOrder), { status: 200 });
        } 
        // If no specific workOrderId is provided, fetch all work orders
        else {
            const workOrders = await WorkOrder.find({});

            return new Response(JSON.stringify(workOrders), { status: 200 });
        }
        
    } catch (error) {
        console.error("Error fetching work orders:", error.message);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
        });
    }
}
