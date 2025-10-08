'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createWalletClient,
  custom,
  formatEther,
  parseEther,
  type WalletClient,
  type PublicClient,
  getContract,
} from 'viem';
import { sepolia } from 'viem/chains';
import { toast } from 'react-toastify';
import { stakeAbi } from '../../assets/abis/stake';
import { StakeContractAddress } from '../../utils/env';
import { Pid } from '../../utils';
import { viemClients } from '../../utils/viem';

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

export const useViemWithdraw = () => {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [amount, setAmount] = useState('');
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [userData, setUserData] = useState<UserStakeData>(InitData);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [publicClient] = useState<PublicClient>(viemClients(sepolia.id));

  const isWithdrawable = useMemo(
    () => Number(userData.withdrawable) > 0 && isConnected,
    [userData, isConnected]
  );

  // Initialize wallet client
  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const client = createWalletClient({
            chain: sepolia,
            transport: custom(window.ethereum),
          });

          // Check if already connected
          const [account] = await client.getAddresses();
          if (account) {
            setWalletClient(client);
            setAddress(account);
            setIsConnected(true);
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              setAddress(accounts[0]);
              setIsConnected(true);
            } else {
              setAddress('');
              setIsConnected(false);
            }
          });
        } catch (error) {
          console.error('Failed to initialize viem:', error);
        }
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const getUserData = useCallback(async () => {
    if (!publicClient || !address) return;
    try {
      const contract = getContract({
        address: StakeContractAddress,
        abi: stakeAbi,
        client: publicClient,
      });

      const staked = await contract.read.stakingBalance([
        BigInt(Pid),
        address as `0x${string}`,
      ]);

      const [requestAmount, pendingWithdrawAmount] =
        (await contract.read.withdrawAmount([
          BigInt(Pid),
          address as `0x${string}`,
        ])) as [bigint, bigint];

      const ava = Number(formatEther(pendingWithdrawAmount));
      const total = Number(formatEther(requestAmount));

      setUserData({
        staked: formatEther(staked as bigint),
        withdrawPending: (total - ava).toFixed(4),
        withdrawable: ava.toString(),
      });
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  }, [publicClient, address]);

  useEffect(() => {
    if (publicClient && address && isConnected) {
      getUserData();
    }
  }, [address, publicClient, isConnected, getUserData]);

  const handleUnStake = useCallback(async () => {
    if (!walletClient || !publicClient) {
      toast.error('Please install MetaMask');
      return;
    }

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

      const contract = getContract({
        address: StakeContractAddress,
        abi: stakeAbi,
        client: { public: publicClient, wallet: walletClient },
      });

      const hash = await contract.write.unstake(
        [BigInt(Pid), parseEther(amount)],
        {
          account: address as `0x${string}`,
        }
      );

      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Unstake successful!');
      setAmount('');
      await getUserData();
    } catch (error: any) {
      console.error('Unstake error:', error);
      toast.error(error?.message || 'Transaction failed. Please try again.');
    } finally {
      setUnstakeLoading(false);
    }
  }, [walletClient, publicClient, amount, userData.staked, getUserData, address]);

  const handleWithdraw = useCallback(async () => {
    if (!walletClient || !publicClient) {
      toast.error('Please install MetaMask');
      return;
    }

    try {
      setWithdrawLoading(true);

      const contract = getContract({
        address: StakeContractAddress,
        abi: stakeAbi,
        client: { public: publicClient, wallet: walletClient },
      });

      const hash = await contract.write.withdraw([BigInt(Pid)], {
        account: address as `0x${string}`,
      });

      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Withdraw successful!');
      await getUserData();
    } catch (error: any) {
      console.error('Withdraw error:', error);
      toast.error(error?.message || 'Transaction failed. Please try again.');
    } finally {
      setWithdrawLoading(false);
    }
  }, [walletClient, publicClient, getUserData, address]);

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

