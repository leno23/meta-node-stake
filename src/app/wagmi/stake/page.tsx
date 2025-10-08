'use client';

import { StakeUI } from '../../../components/shared/StakeUI';
import { useWagmiStake } from '../../../hooks/wagmi/useWagmiStake';

export default function WagmiStakePage() {
  const {
    address,
    isConnected,
    stakedAmount,
    amount,
    loading,
    balance,
    setAmount,
    handleStake,
  } = useWagmiStake();

  return (
    <StakeUI
      stakedAmount={stakedAmount}
      amount={amount}
      loading={loading}
      isConnected={isConnected}
      balance={balance}
      onAmountChange={setAmount}
      onStake={handleStake}
    />
  );
}

