'use client';

import { WithdrawUI } from '../../../components/shared/WithdrawUI';
import { useViemWithdraw } from '../../../hooks/viem/useViemWithdraw';

export default function ViemWithdrawPage() {
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
  } = useViemWithdraw();

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

