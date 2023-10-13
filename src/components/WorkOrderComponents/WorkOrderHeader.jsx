export function WorkOrderHeader({ order, showWorkOrder, toggleWorkOrder }) {
    return (
      <div className="justify-between sm:flex sm:items-center">
        <div>
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Work Order #: {order.workOrderNumber}
          </h1>
          <h2 className="mt-2 text-sm text-gray-700">
            Vehicle: {order.vehicle.make} {order.vehicle.model} {order.vehicle.year} | VIN: {order.vehicle.vin}
          </h2>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="block rounded-md bg-[#2563eb] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#2563eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
            onClick={() => toggleWorkOrder(order.workOrderNumber)}
          >
            {showWorkOrder ? 'Hide' : 'Show'} Work Orders
          </button>
        </div>
      </div>
    );
}
