'use client';

import { StakeUI } from '../../../components/shared/StakeUI';
import { useViemStake } from '../../../hooks/viem/useViemStake';

export default function ViemStakePage() {
  const {
    address,
    isConnected,
    stakedAmount,
    amount,
    loading,
    balance,
    setAmount,
    handleStake,
  } = useViemStake();

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

