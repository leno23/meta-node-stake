'use client';

import { StakeUI } from '../../../components/shared/StakeUI';
import { useEthersStake } from '../../../hooks/ethers/useEthersStake';

export default function EthersStakePage() {
  const {
    address,
    isConnected,
    stakedAmount,
    amount,
    loading,
    balance,
    setAmount,
    handleStake,
  } = useEthersStake();

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

