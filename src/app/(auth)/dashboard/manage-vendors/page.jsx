'use client'
// import { useState, useEffect } from 'react';
import useSWR from 'swr'
// import VendorForm3 from '@/components/VendorForm3'
import VendorForm2 from '@/components/vendorForm2'
const MangeVendors = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json())

  const { data, error } = useSWR('/api/vendor-info', fetcher, {
    revalidateOnFocus: true
    //TODO: figure out how to show latest data when vendor is added, only revalidate when we know they succesfully added a vendor
  })

  return <VendorForm2 data={data} />
}

export default MangeVendors
