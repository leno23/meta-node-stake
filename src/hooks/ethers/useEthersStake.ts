'use client';

import { useCallback, useEffect, useState } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { toast } from 'react-toastify';
import { stakeAbi } from '../../assets/abis/stake';
import { StakeContractAddress } from '../../utils/env';
import { Pid } from '../../utils';

export const useEthersStake = () => {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [stakedAmount, setStakedAmount] = useState('0');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

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

  // Get balance
  const getBalance = useCallback(async () => {
    if (provider && address) {
      try {
        const bal = await provider.getBalance(address);
        setBalance(ethers.formatEther(bal));
      } catch (error) {
        console.error('Failed to get balance:', error);
      }
    }
  }, [provider, address]);

  // Get staked amount
  const getStakedAmount = useCallback(async () => {
    if (contract && address) {
      try {
        const staked = await contract.stakingBalance(Pid, address);
        setStakedAmount(ethers.formatEther(staked));
      } catch (error) {
        console.error('Failed to get staked amount:', error);
      }
    }
  }, [contract, address]);

  // Fetch data when connected
  useEffect(() => {
    if (isConnected && address) {
      getBalance();
      getStakedAmount();
    }
  }, [isConnected, address, getBalance, getStakedAmount]);

  const handleStake = async () => {
    if (!contract || !provider) {
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
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer) as any;
      
      const tx = await contractWithSigner.depositETH({
        value: ethers.parseEther(amount),
      });
      
      await tx.wait();
      
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

