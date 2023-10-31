'use client'
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import VendorForm from '@/components/VendorForm';

const ManageVendors = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(userId ? `/api/vendor-info?userId=${userId}` : null, fetcher, {
    revalidateOnMount: true,
  });

  if (error) return <div>Failed to load vendors</div>;
  if (!data) return <div>Loading...</div>;
  return <VendorForm data={data} />;
};

export default ManageVendors;
