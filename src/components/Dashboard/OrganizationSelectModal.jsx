'use client'
import { useRouter } from 'next/navigation'
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useSession } from 'next-auth/react'

export default function OrganizationSelectModal() {
  const [open, setOpen] = useState(true)
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { data: session } = useSession()
  const router = useRouter()
  const organizations = [
    { _id: '620c1d4116a9b146ec3b595a', name: 'United Diesel Service' },
    { _id: '620c1d4116a9b146ec3b595b', name: 'Test' },
    // Add more organizations as needed
  ]
  useEffect(() => {
    // Assuming you want to pre-select the first option
    setSelectedOrganization(organizations[0]._id)
  }, [])

  const updateOrganization = async () => {
    if (!selectedOrganization) return
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/update-organization', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin', // or 'include' if your API is on a different domain
        body: JSON.stringify({
          userId: session.user.id,
          organizationId: selectedOrganization,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update organization.')
      }

      // Handle the success scenario here. e.g., show a success message, redirect, etc.
      setOpen(false)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error updating organization:', error)
      setError('Failed to update organization. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectClick = () => {
    updateOrganization()
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div> */}
                  <div className="mt-3 text-center sm:mt-5">
                    {/* <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Organization
                    </Dialog.Title> */}
                    <div>
                      <label
                        htmlFor="organization"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Organization
                      </label>
                      <select
                        id="organization"
                        name="organization"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                        value={selectedOrganization}
                        onChange={(e) =>
                          setSelectedOrganization(e.target.value)
                        }
                      >
                        {organizations.map((org) => (
                          <option key={org._id} value={org._id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      isLoading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    onClick={handleSelectClick}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Select'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
