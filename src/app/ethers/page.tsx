'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EthersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ethers/stake');
  }, [router]);

  return null;
}

