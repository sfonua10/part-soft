'use client'
// import { useState, useEffect } from 'react';
import useSWR from 'swr'
// import VendorForm3 from '@/components/VendorForm3'
import VendorForm2 from '@/components/VendorForm2'
const MangeVendors = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json())

  const { data, error } = useSWR('/api/vendor-info', fetcher, {
    revalidateOnMount: true
  })

  return <VendorForm2 data={data} />
}

export default MangeVendors
