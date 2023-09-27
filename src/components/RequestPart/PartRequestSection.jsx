import { Fragment } from 'react'
import { XCircleIcon } from '@heroicons/react/24/outline'

const PartRequestSection = ({
  parts,
  handleInputChange,
  handleRemovePart,
  errors,
}) => (
  <section aria-labelledby="part-information-heading" className="mt-10">
    {parts.map((part, index) => (
      <Fragment key={index}>
        <div className="flex items-center justify-between">
          <h2 id="part-heading" className="text-lg font-medium text-gray-900">
            Part Request #{index + 1}
          </h2>
          {index !== 0 && (
            <button
              onClick={() => handleRemovePart(index)}
              // className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <XCircleIcon className="h-6 text-red-600" />
            </button>
          )}
        </div>
        <div
          key={index}
          className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2"
        >
          <div>
            <label
              htmlFor="part-name"
              className="block text-sm font-medium text-gray-700"
            >
              Part Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="part-name"
                name="part-name"
                value={part['part-name'] || ''}
                onChange={(e) => handleInputChange(e, index)}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm ${
                  errors[index]?.['part-name'] ? 'border-red-500' : ''
                }`}
                autoComplete="address-level2"
              />
              {errors[index]?.['part-name'] && (
                <div className="text-sm text-red-500">
                  {errors[index]['part-name']}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="part-number"
              className="block text-sm font-medium text-gray-700"
            >
              Part Num.
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="part-number"
                name="part-number"
                value={part['part-number'] || ''}
                autoComplete="address-level1"
                onChange={(e) => handleInputChange(e, index)}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] sm:text-sm ${
                  errors[index]?.['part-number'] ? 'border-red-500' : ''
                }`}
              />
              {errors[index]?.['part-number'] && (
                <div className="text-sm text-red-500">
                  {errors[index]['part-number']}
                </div>
              )}
            </div>
          </div>
        </div>

        {index !== parts.length - 1 && <hr className="my-4 border-gray-300" />}
      </Fragment>
    ))}
  </section>
)
export default PartRequestSection
