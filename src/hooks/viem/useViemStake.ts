'use client';

import { useCallback, useEffect, useState } from 'react';
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

export const useViemStake = () => {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [stakedAmount, setStakedAmount] = useState('0');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [publicClient] = useState<PublicClient>(viemClients(sepolia.id));

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

  // Get balance
  const getBalance = useCallback(async () => {
    if (publicClient && address) {
      try {
        const bal = await publicClient.getBalance({
          address: address as `0x${string}`,
        });
        setBalance(formatEther(bal));
      } catch (error) {
        console.error('Failed to get balance:', error);
      }
    }
  }, [publicClient, address]);

  // Get staked amount
  const getStakedAmount = useCallback(async () => {
    if (publicClient && address) {
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
        setStakedAmount(formatEther(staked as bigint));
      } catch (error) {
        console.error('Failed to get staked amount:', error);
      }
    }
  }, [publicClient, address]);

  // Fetch data when connected
  useEffect(() => {
    if (isConnected && address) {
      getBalance();
      getStakedAmount();
    }
  }, [isConnected, address, getBalance, getStakedAmount]);

  const handleStake = async () => {
    if (!walletClient || !publicClient) {
      toast.error('Please install MetaMask');
      return;
    }

    if (!isConnected) {
      toast.error('Please connect wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      toast.error('Amount cannot be greater than current balance');
      return;
    }

    try {
      setLoading(true);

      const contract = getContract({
        address: StakeContractAddress,
        abi: stakeAbi,
        client: { public: publicClient, wallet: walletClient },
      });

      const hash = await contract.write.depositETH({
        value: parseEther(amount),
        account: address as `0x${string}`,
      } as any);

      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Stake successful!');
      setAmount('');
      await getStakedAmount();
      await getBalance();
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
    balance,
    setAmount,
    handleStake,
  };
};

