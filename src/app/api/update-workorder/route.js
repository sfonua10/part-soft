import { connectToDB } from '@/utils/database';
import WorkOrder from '@/models/workOrder'; 

export async function PUT(req, res) {
  try {
    const { _id, vehicle, status, parts } = await req.json();

    await connectToDB();

    // Modified transformation for vendorResponses
    parts.forEach(part => {
      part.vendorResponses = part.selectedVendors.map(vendor => ({
        _id: vendor._id,
        vendorName: vendor.name,
        availability: 'Pending',
        orderStatus: 'Pending',
        partAvailable: 'N/A'
        // Add more fields from the vendorResponseSchema as needed
      }));
    });

    const updateQuery = {
      'vehicle.vin': vehicle.vin,
      'vehicle.make': vehicle.make,
      'vehicle.model': vehicle.model,
      'vehicle.year': vehicle.year,
      status: status,
    };

    parts.forEach((part, index) => {
      updateQuery[`parts.$[elem${index}].vendorResponses`] = part.vendorResponses;
    });

    const arrayFilters = parts.map((part, index) => ({
      [`elem${index}._id`]: part._id,
    }));

    const workOrder = await WorkOrder.findByIdAndUpdate(
      _id,
      updateQuery,
      {
        new: true,
        arrayFilters: arrayFilters,
        upsert: true
      }
    );

    if (!workOrder) {
      throw new Error('Work order not found');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Work order updated successfully.',
        workOrder,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error updating work order:', error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
