'use client';

import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FiArrowDown, FiZap, FiTrendingUp } from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface StakeUIProps {
  // State
  stakedAmount: string;
  amount: string;
  loading: boolean;
  isConnected: boolean;
  balance?: string;
  
  // Handlers
  onAmountChange: (value: string) => void;
  onStake: () => void;
}

export const StakeUI = ({
  stakedAmount,
  amount,
  loading,
  isConnected,
  balance,
  onAmountChange,
  onStake,
}: StakeUIProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="inline-block mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border-2 border-primary-500/20 flex items-center justify-center shadow-xl"
            style={{ boxShadow: '0 0 60px 0 rgba(14,165,233,0.15)' }}
          >
            <FiZap className="w-12 h-12 text-primary-500" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">
          MetaNode Stake
        </h1>
        <p className="text-gray-400 text-xl">Stake ETH to earn tokens</p>
      </motion.div>

      <Card className="max-w-3xl min-h-[420px] mx-auto p-4 sm:p-8 md:p-12 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-2xl border-primary-500/20 border-[1.5px] rounded-2xl sm:rounded-3xl">
        <div className="space-y-8 sm:space-y-12">
          {/* Staked Amount Display */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-4 sm:p-8 bg-gray-800/70 rounded-xl sm:rounded-2xl border border-gray-700/50 group-hover:border-primary-500/50 transition-colors duration-300 shadow-lg">
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-primary-500/10 rounded-full">
              <FiTrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0 items-center sm:items-start">
              <span className="text-gray-400 text-base sm:text-lg mb-1">
                Staked Amount
              </span>
              <span className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent leading-tight break-all">
                {parseFloat(stakedAmount).toFixed(4)} ETH
              </span>
            </div>
          </div>

          {/* Input Field */}
          <div className="space-y-4 sm:space-y-6">
            <Input
              label="Amount to Stake"
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="0.0"
              rightElement={<span className="text-gray-500">ETH</span>}
              helperText={
                balance
                  ? `Available: ${parseFloat(balance).toFixed(4)} ETH`
                  : undefined
              }
              className="text-lg sm:text-xl py-3 sm:py-5"
            />
          </div>

          {/* Stake Button */}
          <div className="pt-4 sm:pt-8">
            {!isConnected ? (
              <div className="flex justify-center">
                <div className="glow">
                  <ConnectButton />
                </div>
              </div>
            ) : (
              <Button
                onClick={onStake}
                disabled={loading || !amount}
                loading={loading}
                fullWidth
                className="py-3 sm:py-5 text-lg sm:text-xl"
              >
                <FiArrowDown className="w-6 h-6 sm:w-7 sm:h-7" />
                <span>Stake ETH</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

