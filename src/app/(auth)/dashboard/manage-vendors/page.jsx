'use client'
// import { useState, useEffect } from 'react';
import useSWR from 'swr'
import VendorForm3 from '@/components/VendorForm3'

const MangeVendors = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json())

  const { data, error } = useSWR('/api/vendor-info', fetcher)

  return <VendorForm3 data={data} />
}

export default MangeVendors
