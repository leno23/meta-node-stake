'use client';

import { WithdrawUI } from '../../../components/shared/WithdrawUI';
import { useEthersWithdraw } from '../../../hooks/ethers/useEthersWithdraw';

export default function EthersWithdrawPage() {
  const {
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
  } = useEthersWithdraw();

  return (
    <WithdrawUI
      userData={userData}
      amount={amount}
      unstakeLoading={unstakeLoading}
      withdrawLoading={withdrawLoading}
      isConnected={isConnected}
      isWithdrawable={isWithdrawable}
      onAmountChange={handleAmountChange}
      onUnstake={handleUnStake}
      onWithdraw={handleWithdraw}
    />
  );
}

