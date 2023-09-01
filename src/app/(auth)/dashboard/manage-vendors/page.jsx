'use client'

import useSWR from 'swr'
import VendorForm from '@/components/VendorForm'

const MangeVendors = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json())

  const { data, error } = useSWR('/api/vendor-info', fetcher, {
    revalidateOnMount: true
  })

  return <VendorForm data={data} />
}

export default MangeVendors
