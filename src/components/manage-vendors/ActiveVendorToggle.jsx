import React from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

const ActiveVendorToggle = ({ activeVendor, setActiveVendor }) => {
  return (
    <Switch.Group
    as="div"
    className="flex items-center"
  >
    <Switch
      checked={activeVendor}
      onChange={setActiveVendor}
      className={classNames(
        activeVendor
          ? 'bg-indigo-600'
          : 'bg-gray-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          activeVendor
            ? 'translate-x-5'
            : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        )}
      />
    </Switch>
    <Switch.Label
      as="span"
      className="ml-3 text-sm"
    >
      <span className="font-medium text-gray-900">
        Set Active
      </span>{' '}
      {/* <span className="text-gray-500">
        (This will send communications to this vendor)
      </span> */}
    </Switch.Label>
  </Switch.Group>
  )
}

export default ActiveVendorToggle