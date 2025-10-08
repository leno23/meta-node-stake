'use client';

import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FiArrowUp, FiClock, FiInfo } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export type UserStakeData = {
  staked: string;
  withdrawPending: string;
  withdrawable: string;
};

interface WithdrawUIProps {
  // State
  userData: UserStakeData;
  amount: string;
  unstakeLoading: boolean;
  withdrawLoading: boolean;
  isConnected: boolean;
  isWithdrawable: boolean;

  // Handlers
  onAmountChange: (value: string) => void;
  onUnstake: () => void;
  onWithdraw: () => void;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-primary-600">{value}</div>
    </div>
  );
}

export const WithdrawUI = ({
  userData,
  amount,
  unstakeLoading,
  withdrawLoading,
  isConnected,
  isWithdrawable,
  onAmountChange,
  onUnstake,
  onWithdraw,
}: WithdrawUIProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4">
          Withdraw
        </h1>
        <p className="text-gray-600 text-lg">Unstake and withdraw your ETH</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Staked Amount"
            value={`${parseFloat(userData.staked).toFixed(4)} ETH`}
          />
          <StatCard
            label="Available to Withdraw"
            value={`${parseFloat(userData.withdrawable).toFixed(4)} ETH`}
          />
          <StatCard
            label="Pending Withdraw"
            value={`${parseFloat(userData.withdrawPending).toFixed(4)} ETH`}
          />
        </div>

        {/* Unstake Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Unstake</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Amount to Unstake
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder="0.0"
                className={cn(
                  'input-field pr-12',
                  'focus:ring-primary-500 focus:border-primary-500'
                )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                ETH
              </span>
            </div>
          </div>

          <div className="pt-4">
            {!isConnected ? (
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onUnstake}
                disabled={unstakeLoading || !amount}
                className={cn(
                  'btn-primary w-full flex items-center justify-center space-x-2',
                  unstakeLoading && 'opacity-70 cursor-not-allowed'
                )}
              >
                {unstakeLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FiArrowUp className="w-5 h-5" />
                    <span>Unstake ETH</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Withdraw Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-xl font-semibold">Withdraw</h2>

          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Ready to Withdraw</div>
                <div className="text-2xl font-semibold text-primary-600">
                  {parseFloat(userData.withdrawable).toFixed(4)} ETH
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="mr-1" />
                <span>20 min cooldown</span>
              </div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <FiInfo className="mr-1" />
            <span>After unstaking, you need to wait 20 minutes to withdraw.</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onWithdraw}
            disabled={!isWithdrawable || withdrawLoading}
            className={cn(
              'btn-primary w-full flex items-center justify-center space-x-2',
              (!isWithdrawable || withdrawLoading) && 'opacity-70 cursor-not-allowed'
            )}
          >
            {withdrawLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiArrowUp className="w-5 h-5" />
                <span>Withdraw ETH</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

