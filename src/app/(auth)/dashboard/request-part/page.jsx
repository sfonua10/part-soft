'use client'

import { Fragment, useState } from 'react'
import useSWR from 'swr'
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function RequestPart() {
  const [parts, setParts] = useState([{}])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [workOrderNumber, setWorkOrderNumber] = useState('');

  const { data: activeVendors, error } = useSWR('/api/vendor-info?activeOnly=true', fetcher, {
    refreshInterval: 1000
  })
  
  const addPart = (e) => {
    e.preventDefault()
    setParts([...parts, {}])
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'part-name':
      case 'part-number':
      case 'make':
      case 'model':
      case 'vin':
        if (!value) error = 'This field is required'
        break
      case 'year':
        if (!/^\d{4}$/.test(value)) error = 'Year should be a 4-digit number'
        break
      case 'vin':
        if (value.length !== 17) error = 'VIN should be 17 characters long'
        break
      default:
        break
    }
    return error
  }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target
    const error = validateField(name, value)
  
    // Update the parts state with the new value
    const newParts = [...parts];
    newParts[index][name] = value;
    setParts(newParts);
  
    // Update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [index]: {
        ...(prevErrors[index] || {}),
        [name]: error,
      },
    }))
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check for any validation errors first
    // If there are any errors, do not proceed with submission
    const hasErrors = Object.values(errors).some(partErrors =>
        Object.values(partErrors).some(errorMessage => errorMessage !== "")
      );
      
      if (hasErrors) {
        alert('Please correct the errors before submitting.');
        return;
      }
      

      const formData = {
          workOrderNumber,
          parts: parts.map((part, index) => ({
              partName: part['part-name'],
              partNumber: part['part-number'],
              make: part.make,
              model: part.model,
              year: part.year,
              vin: part.vin,
            })),
        vendors: activeVendors
      };
      
    try {
      setIsLoading(true)

      const response = await fetch('/api/send-sms-2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      setIsLoading(false)

      const data = await response.json()
      // Check if the HTTP status code indicates a failure
      if (!response.ok) {
        console.error('Server Error:', data.error) // Assuming your API returns an error field
        alert(data.error)
        setIsLoading(false)
        return
      }
      console.log(data.message) 
      setWorkOrderNumber('')
      setParts([
        {
          'part-name': '',
          'part-number': '',
          make: '',
          model: '',
          year: '',
          vin: '',
        },
      ])
    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}
      <div
        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-gray-50 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Part request information</h1>
        {/* 
        <section
          aria-labelledby="summary-heading"
          className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
            >
              {parts.map((part) => (
                <li key={part.id} className="flex items-start space-x-4 py-6">
                  <img
                    src={part.imageSrc}
                    alt={part.imageAlt}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3>{part.name}</h3>
                    <p className="text-gray-500">{part.manufacturer}</p>
                    <p className="text-gray-500">{part.description}</p>
                  </div>
                  <p className="flex-none text-base font-medium">
                    {part.price}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>$320.00</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd>$15.00</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Taxes</dt>
                <dd>$26.80</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">$361.80</dd>
              </div>
            </dl>

            <Popover className="fixed inset-x-0 bottom-0 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden">
              <div className="relative z-10 border-t border-gray-200 bg-white px-4 sm:px-6">
                <div className="mx-auto max-w-lg">
                  <Popover.Button className="flex w-full items-center py-6 font-medium">
                    <span className="mr-auto text-base">Total</span>
                    <span className="mr-2 text-base">$361.80</span>
                    <ChevronUpIcon
                      className="h-5 w-5 text-gray-500"
                      aria-hidden="true"
                    />
                  </Popover.Button>
                </div>
              </div>

              <Transition.Root as={Fragment}>
                <div>
                  <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                  >
                    <Popover.Panel className="relative bg-white px-4 py-6 sm:px-6">
                      <dl className="mx-auto max-w-lg space-y-6">
                        <div className="flex items-center justify-between">
                          <dt className="text-gray-600">Subtotal</dt>
                          <dd>$320.00</dd>
                        </div>

                        <div className="flex items-center justify-between">
                          <dt className="text-gray-600">Shipping</dt>
                          <dd>$15.00</dd>
                        </div>

                        <div className="flex items-center justify-between">
                          <dt className="text-gray-600">Taxes</dt>
                          <dd>$26.80</dd>
                        </div>
                      </dl>
                    </Popover.Panel>
                  </Transition.Child>
                </div>
              </Transition.Root>
            </Popover>
          </div>
        </section> */}

        <form
          onSubmit={handleSubmit}
          className="px-4 pb-36 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <section aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-lg font-medium text-gray-900"
              >
                Requestor information
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
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            <section
              aria-labelledby="part-information-heading"
              className="mt-10"
            >
              {parts.map((part, index) => (
                <Fragment key={index}>
                  <h2
                    id="part-heading"
                    className="text-lg font-medium text-gray-900"
                  >
                    Part Request #{index + 1}
                  </h2>
                  <div
                    key={index}
                    className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3"
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
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
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
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors[index]?.['part-number']
                              ? 'border-red-500'
                              : ''
                          }`}
                        />
                        {errors[index]?.['part-number'] && (
                          <div className="text-sm text-red-500">
                            {errors[index]['part-number']}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
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
                          value={part.make || ''}
                          autoComplete="make"
                          onChange={(e) => handleInputChange(e, index)}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors[index]?.['make'] ? 'border-red-500' : ''
                          }`}
                        />
                        {errors[index]?.['make'] && (
                          <div className="text-sm text-red-500">
                            {errors[index]['make']}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
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
                          value={part.model || ''}
                          autoComplete="address-level2"
                          onChange={(e) => handleInputChange(e, index)}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors[index]?.['model'] ? 'border-red-500' : ''
                          }`}
                        />
                        {errors[index]?.['model'] && (
                          <div className="text-sm text-red-500">
                            {errors[index]['model']}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
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
                          value={part.year || ''}
                          autoComplete="address-level1"
                          onChange={(e) => handleInputChange(e, index)}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors[index]?.['year'] ? 'border-red-500' : ''
                          }`}
                        />
                        {errors[index]?.['year'] && (
                          <div className="text-sm text-red-500">
                            {errors[index]['year']}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="vin"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Vin
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="vin"
                          name="vin"
                          value={part.vin || ''}
                          autoComplete="vin"
                          onChange={(e) => handleInputChange(e, index)}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                            errors[index]?.['vin'] ? 'border-red-500' : ''
                          }`}
                        />
                        {errors[index]?.['vin'] && (
                          <div className="text-sm text-red-500">
                            {errors[index]['vin']}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {index !== parts.length - 1 && (
                    <hr className="my-4 border-gray-300" />
                  )}
                </Fragment>
              ))}
            </section>
            <section
              aria-labelledby="part-information-heading"
              className="mt-10 text-right"
            >
              <a
                href="#"
                onClick={addPart}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Add Another Part <span aria-hidden="true">→</span>
              </a>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last sm:ml-6 sm:w-auto"
              >
                Request Part
              </button>
              <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
                This will send a sms to your active vendors
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
