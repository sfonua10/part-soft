const VehicleInfo = ({ vehicle, handleVehicleInputChange, errors, workOrderNumber, setWorkOrderNumber }) => (
  <section aria-labelledby="vehicle-info-heading">
    <h2 id="vehicle-info-heading" className="text-lg font-medium text-gray-900">
      Vehicle information
    </h2>

    <div className="mt-6">
      <label
        htmlFor="work-order-number"
        className="block text-sm font-medium text-gray-700"
      >
        Work Order Number
      </label>
      <div className="mt-1">
        <input
          type="text"
          id="work-order-number"
          name="work-order-number"
          value={workOrderNumber}
          onChange={(e) => setWorkOrderNumber(e.target.value)}
          autoComplete="work-order-number"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
        />
        {errors.workOrderNumber && (
          <p className="mt-1 text-xs text-red-500">{errors.workOrderNumber}</p>
        )}
      </div>

      <div className="mt-4">
        <label
          htmlFor="vin"
          className="block text-sm font-medium text-gray-700"
        >
          VIN
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="vin"
            name="vin"
            value={vehicle.vin}
            onChange={handleVehicleInputChange}
            autoComplete="vin"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
          />
          {errors.vin && (
            <p className="mt-1 text-xs text-red-500">{errors.vin}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="make"
          className="block text-sm font-medium text-gray-700"
        >
          Make
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="make"
            name="make"
            value={vehicle.make}
            onChange={handleVehicleInputChange}
            autoComplete="make"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
          />
          {errors.make && (
            <p className="mt-1 text-xs text-red-500">{errors.make}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="model"
          className="block text-sm font-medium text-gray-700"
        >
          Model
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="model"
            name="model"
            value={vehicle.model}
            onChange={handleVehicleInputChange}
            autoComplete="model"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
          />
          {errors.model && (
            <p className="mt-1 text-xs text-red-500">{errors.model}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="year"
          className="block text-sm font-medium text-gray-700"
        >
          Year
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="year"
            name="year"
            value={vehicle.year}
            onChange={handleVehicleInputChange}
            autoComplete="year"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm"
          />
          {errors.year && (
            <p className="mt-1 text-xs text-red-500">{errors.year}</p>
          )}
        </div>
      </div>
    </div>
  </section>
)
export default VehicleInfo
