'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiZap, FiCode, FiLayers } from 'react-icons/fi';
import { Card } from '../components/ui/Card';

export default function HomePage() {
  const implementations = [
    {
      name: 'Ethers.js',
      path: '/ethers',
      icon: FiCode,
      description: 'Classic ethers.js implementation',
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Wagmi',
      path: '/wagmi',
      icon: FiLayers,
      description: 'Modern React hooks for Ethereum',
      color: 'from-purple-400 to-purple-600',
    },
    {
      name: 'Viem',
      path: '/viem',
      icon: FiZap,
      description: 'Lightweight & fast TypeScript interface',
      color: 'from-green-400 to-green-600',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-block mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-32 h-32 rounded-full border-2 border-primary-500/20 flex items-center justify-center shadow-xl"
            style={{ boxShadow: '0 0 60px 0 rgba(14,165,233,0.15)' }}
          >
            <FiZap className="w-16 h-16 text-primary-500" />
          </motion.div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-4">
          MetaNode Stake
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Choose your preferred Web3 library implementation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {implementations.map((impl, index) => (
          <motion.div
            key={impl.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={impl.path}>
              <Card className="h-full p-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-primary-500/20 border-[1.5px] hover:border-primary-500/50 transition-all duration-300 cursor-pointer group">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-r ${impl.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <impl.icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2
                      className={`text-2xl font-bold bg-gradient-to-r ${impl.color} bg-clip-text text-transparent mb-2`}
                    >
                      {impl.name}
                    </h2>
                    <p className="text-gray-400">{impl.description}</p>
                  </div>
                  <div className="pt-4">
                    <span className="text-primary-400 group-hover:text-primary-300 transition-colors">
                      Explore →
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-gray-500 text-sm"
      >
        <p>
          Each implementation provides the same functionality using different Web3 libraries.
          <br />
          Choose the one that best fits your development style.
        </p>
      </motion.div>
    </div>
  );
}

