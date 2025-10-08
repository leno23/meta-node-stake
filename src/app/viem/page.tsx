'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ViemPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/viem/stake');
  }, [router]);

  return null;
}

