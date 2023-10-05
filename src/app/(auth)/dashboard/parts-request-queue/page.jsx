import Link from 'next/link'

const partsRequests = [
  {
    _id: { $oid: '6513abc3fd7e49cab402302e' },
    workOrderNumber: '12345',
    vehicle: {
      make: '',
      model: '',
      year: '',
      vin: '',
      _id: { $oid: '6513abc3fd7e49cab402302f' },
    },
    parts: [
      {
        partName: 'Radio',
        partNumber: 'DL39',
        _id: { $oid: '6513abc3fd7e49cab4023030' },
      },
    ],
    __v: { $numberInt: '0' },
  },
  {
    _id: { $oid: '651b7de35e9433c3641b8970' },
    workOrderNumber: '76765',
    vehicle: {
      make: '',
      model: '',
      year: '',
      vin: '',
      _id: { $oid: '651b7de35e9433c3641b8971' },
    },
    parts: [
      {
        partName: 'Front Bumper',
        partNumber: 'LO23',
        _id: { $oid: '651b7de35e9433c3641b8972' },
      },
      {
        partName: 'Windshield',
        partNumber: 'KK234',
        _id: { $oid: '651b7de35e9433c3641b8973' },
      },
    ],
    __v: { $numberInt: '0' },
  },
]

export default function PartsRequestQueue() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-base font-semibold leading-6 text-gray-900">
        Parts Request Page
      </h1>
      <p className="mt-2 text-sm text-gray-700">
        A list of all the parts requests.
      </p>
      <button
        type="button"
        className="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add request
      </button>
      <ul className="mt-8 divide-y divide-gray-200">
        {partsRequests.map((request) =>
          request.parts.map((part, index) => (
            <Link
              href={`/requests/${request._id.$oid}`}
              key={part._id.$oid}
              passHref
            >
              <li className="flex cursor-pointer items-center justify-between py-4 text-gray-500 no-underline hover:bg-gray-100">
                <span className="text-sm">{request.workOrderNumber}</span>
                <span className="text-sm">{request.vehicle.make}</span>
                <span className="text-sm">{request.vehicle.model}</span>
                <span className="text-sm">{request.vehicle.year}</span>
                <span className="text-sm">{part.partName}</span>
                <span className="text-sm">{part.partNumber}</span>
                {index === 0 && (
                  <span className="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-500">
                    New
                  </span>
                )}
              </li>
            </Link>
          )),
        )}
      </ul>
    </div>
  )
}
