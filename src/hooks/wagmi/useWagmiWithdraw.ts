'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { toast } from 'react-toastify';
import { waitForTransactionReceipt } from 'viem/actions';
import { useStakeContract } from '../useContract';
import { Pid } from '../../utils';

export type UserStakeData = {
  staked: string;
  withdrawPending: string;
  withdrawable: string;
};

const InitData: UserStakeData = {
  staked: '0',
  withdrawable: '0',
  withdrawPending: '0',
};

export const useWagmiWithdraw = () => {
  const stakeContract = useStakeContract();
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const [userData, setUserData] = useState<UserStakeData>(InitData);

  const isWithdrawable = useMemo(
    () => Number(userData.withdrawable) > 0 && isConnected,
    [userData, isConnected]
  );

  const getUserData = useCallback(async () => {
    if (!stakeContract || !address) return;
    try {
      const staked = await stakeContract.read.stakingBalance([Pid, address]);
      const [requestAmount, pendingWithdrawAmount] =
        await stakeContract.read.withdrawAmount([Pid, address]);
      
      const ava = Number(formatUnits(pendingWithdrawAmount, 18));
      const total = Number(formatUnits(requestAmount, 18));
      
      setUserData({
        staked: formatUnits(staked as bigint, 18),
        withdrawPending: (total - ava).toFixed(4),
        withdrawable: ava.toString(),
      });
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  }, [stakeContract, address]);

  useEffect(() => {
    if (stakeContract && address) {
      getUserData();
    }
  }, [address, stakeContract, getUserData]);

  const handleUnStake = useCallback(async () => {
    if (!stakeContract || !walletClient) return;
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(amount) > parseFloat(userData.staked)) {
      toast.error('Amount cannot be greater than staked amount');
      return;
    }

    try {
      setUnstakeLoading(true);
      const tx = await stakeContract.write.unstake([Pid, parseUnits(amount, 18)]);
      await waitForTransactionReceipt(walletClient, { hash: tx });
      toast.success('Unstake successful!');
      setAmount('');
      getUserData();
    } catch (error: any) {
      console.error('Unstake error:', error);
      toast.error(error?.message || 'Transaction failed. Please try again.');
    } finally {
      setUnstakeLoading(false);
    }
  }, [stakeContract, walletClient, amount, userData.staked, getUserData]);

  const handleWithdraw = useCallback(async () => {
    if (!stakeContract || !walletClient) return;

    try {
      setWithdrawLoading(true);
      const tx = await stakeContract.write.withdraw([Pid]);
      await waitForTransactionReceipt(walletClient, { hash: tx });
      toast.success('Withdraw successful!');
      getUserData();
    } catch (error: any) {
      console.error('Withdraw error:', error);
      toast.error(error?.message || 'Transaction failed. Please try again.');
    } finally {
      setWithdrawLoading(false);
    }
  }, [stakeContract, walletClient, getUserData]);

  const handleAmountChange = (val: string) => {
    if (/^\d*(\.\d*)?$/.test(val)) {
      setAmount(val);
    }
  };

  return {
    address,
    isConnected,
    userData,
    amount,
    unstakeLoading,
    withdrawLoading,
    isWithdrawable,
    handleAmountChange,
    handleUnStake,
    handleWithdraw,
  };
};

