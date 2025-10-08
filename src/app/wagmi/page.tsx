'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WagmiPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/wagmi/stake');
  }, [router]);

  return null;
}

