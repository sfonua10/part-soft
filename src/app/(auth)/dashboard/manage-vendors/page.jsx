'use client'
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import VendorForm from '@/components/VendorForm';
import { fetcher } from '@/utils/fetcher';

const ManageVendors = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, error } = useSWR(userId ? `/api/vendor-info?userId=${userId}` : null, fetcher);

  if (error) return <div>Failed to load vendors</div>;
  if (!data) return <div>Loading...</div>;
  return <VendorForm data={data} />;
};

export default ManageVendors;
