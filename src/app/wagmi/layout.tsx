'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils/cn';

export default function WagmiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Stake', path: '/wagmi/stake' },
    { name: 'Withdraw', path: '/wagmi/withdraw' },
  ];

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-lg bg-gray-800/50 p-1 backdrop-blur-xl border border-gray-700">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              href={tab.path}
              className={cn(
                'px-6 py-2 text-sm font-medium rounded-md transition-all duration-200',
                pathname === tab.path
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              )}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

