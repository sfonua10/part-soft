// import WorkOrder from "@/models/workOrder";

// export async function GET(request) {
//     try {
//         // Get any query parameters you might want to filter by
//         const url = new URL(request.url);
//         const orderNumber = url.searchParams.get('orderNumber');

//         let query = {};

//         if (orderNumber) {
//             query.orderNumber = orderNumber;
//         }

//         const workOrders = await WorkOrder.find(query);

//         return new Response(JSON.stringify(workOrders), { status: 200 });
//     } catch (error) {
//         console.error("Error fetching work orders:", error.message);
//         return new Response(JSON.stringify({ message: error.message }), {
//             status: 500,
//         });
//     }
// }

import WorkOrder from "@/models/workOrder";

export async function GET(request) {
    try {
        const workOrders = await WorkOrder.find({});

        return new Response(JSON.stringify(workOrders), { status: 200 });
    } catch (error) {
        console.error("Error fetching work orders:", error.message);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
        });
    }
}
