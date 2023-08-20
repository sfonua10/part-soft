"use client"
import { useState} from 'react'
import VendorForm from '@/components/VendorForm'
import VendorForm2 from '@/components/VendorForm2'
import VendorForm3 from '@/components/VendorForm3'

const MangeVendors = () => {
  const people = [
    {
      _id: '1234',
      name: 'AutoZone',
      phone: '801-722-9592',
      email: 'lindsay.walton@example.com',
      primaryContact: 'Lindsay Walton',
    },
    // More people...
  ]
  const [ vendors, setVendors ] = useState(people)
  return (
    <VendorForm3 vendors={vendors} setVendors={setVendors} />
  )
}

export default MangeVendors