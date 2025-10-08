'use client';

import { WithdrawUI } from '../../../components/shared/WithdrawUI';
import { useWagmiWithdraw } from '../../../hooks/wagmi/useWagmiWithdraw';

export default function WagmiWithdrawPage() {
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
  } = useWagmiWithdraw();

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

