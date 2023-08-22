"use client"
import useSWR from 'swr'

import VendorTable from './VendorTable'
import VendorTable2 from './VendorTable2';
import VendorTable3 from './VendorTable3';
import { data } from '@/app/mockData/partRequest';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Dashboard4() {
  // const { data, error, isLoading } = useSWR('/api/vendor-info', fetcher, {
  //   refreshInterval: 1000
  // })
  console.log('data =====>', data)
  // return <VendorTable data={data} />
  // return <VendorTable2 data={data} />
  return <VendorTable3 data={data} />
}
