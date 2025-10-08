'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAccount, useWalletClient, useBalance } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { toast } from 'react-toastify';
import { waitForTransactionReceipt } from 'viem/actions';
import { useStakeContract } from '../useContract';
import { Pid } from '../../utils';

export const useWagmiStake = () => {
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const [stakedAmount, setStakedAmount] = useState('0');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { data: balanceData } = useBalance({
    address: address,
    query: {
      enabled: isConnected,
      refetchInterval: 10000,
      refetchIntervalInBackground: false,
    },
  });

  const getStakedAmount = useCallback(async () => {
    if (address && stakeContract) {
      try {
        const res = await stakeContract.read.stakingBalance([Pid, address]);
        setStakedAmount(formatUnits(res as bigint, 18));
      } catch (error) {
        console.error('Failed to get staked amount:', error);
      }
    }
  }, [stakeContract, address]);

  useEffect(() => {
    if (stakeContract && address) {
      getStakedAmount();
    }
  }, [stakeContract, address, getStakedAmount]);

  const handleStake = async () => {
    if (!stakeContract || !walletClient) return;
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (balanceData && parseFloat(amount) > parseFloat(balanceData.formatted)) {
      toast.error('Amount cannot be greater than current balance');
      return;
    }

    try {
      setLoading(true);
      const tx = await stakeContract.write.depositETH([], {
        value: parseUnits(amount, 18),
      });
      const res = await waitForTransactionReceipt(walletClient, { hash: tx });
      
      if (res.status === 'success') {
        toast.success('Stake successful!');
        setAmount('');
        getStakedAmount();
      } else {
        toast.error('Stake failed!');
      }
    } catch (error: any) {
      console.error('Stake error:', error);
      toast.error(error?.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    address,
    isConnected,
    stakedAmount,
    amount,
    loading,
    balance: balanceData?.formatted,
    setAmount,
    handleStake,
  };
};

