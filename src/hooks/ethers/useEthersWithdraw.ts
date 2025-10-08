'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { toast } from 'react-toastify';
import { stakeAbi } from '../../assets/abis/stake';
import { StakeContractAddress } from '../../utils/env';
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

export const useEthersWithdraw = () => {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [amount, setAmount] = useState('');
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [userData, setUserData] = useState<UserStakeData>(InitData);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  const isWithdrawable = useMemo(
    () => Number(userData.withdrawable) > 0 && isConnected,
    [userData, isConnected]
  );

  // Initialize provider and contract
  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const web3Provider = new BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          const stakeContract = new Contract(
            StakeContractAddress,
            stakeAbi,
            web3Provider
          );
          setContract(stakeContract);

          // Check if already connected
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAddress(accounts[0].address);
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
          console.error('Failed to initialize ethers:', error);
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
    if (!contract || !address) return;
    try {
      const staked = await contract.stakingBalance(Pid, address);
      const [requestAmount, pendingWithdrawAmount] = await contract.withdrawAmount(
        Pid,
        address
      );

      const ava = Number(ethers.formatEther(pendingWithdrawAmount));
      const total = Number(ethers.formatEther(requestAmount));

      setUserData({
        staked: ethers.formatEther(staked),
        withdrawPending: (total - ava).toFixed(4),
        withdrawable: ava.toString(),
      });
    } catch (error) {
      console.error('Failed to get user data:', error);
    }
  }, [contract, address]);

  useEffect(() => {
    if (contract && address && isConnected) {
      getUserData();
    }
  }, [address, contract, isConnected, getUserData]);

  const handleUnStake = useCallback(async () => {
    if (!contract || !provider) {
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
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer) as any;
      
      const tx = await contractWithSigner.unstake(Pid, ethers.parseEther(amount));
      await tx.wait();
      
      toast.success('Unstake successful!');
      setAmount('');
      await getUserData();
    } catch (error: any) {
      console.error('Unstake error:', error);
      toast.error(error?.message || 'Transaction failed. Please try again.');
    } finally {
      setUnstakeLoading(false);
    }
  }, [contract, provider, amount, userData.staked, getUserData]);

  const handleWithdraw = useCallback(async () => {
    if (!contract || !provider) {
      toast.error('Please install MetaMask');
      return;
    }

    try {
      setWithdrawLoading(true);
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer) as any;
      
      const tx = await contractWithSigner.withdraw(Pid);
      await tx.wait();
      
      toast.success('Withdraw successful!');
      await getUserData();
    } catch (error: any) {
      console.error('Withdraw error:', error);
      toast.error(error?.message || 'Transaction failed. Please try again.');
    } finally {
      setWithdrawLoading(false);
    }
  }, [contract, provider, getUserData]);

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

