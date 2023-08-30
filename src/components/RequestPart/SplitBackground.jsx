import React from 'react'

const SplitBackground = () => {
  return (
    <>
      <div
        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        // className="fixed right-0 top-0 hidden h-full w-1/2 bg-gray-50 lg:block"
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
    </>
  )
}

export default SplitBackground
