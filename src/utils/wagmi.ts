import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import {
  sepolia,
} from 'wagmi/chains';
import { WalletConnectProjectId, SepoliaRpcUrl } from './env';

export const config = getDefaultConfig({
  appName: 'Meta Node Stake',
  projectId: WalletConnectProjectId,
  chains: [
    sepolia
  ],
  transports: {
    // 替换之前 不可用的 https://rpc.sepolia.org/
    [sepolia.id]: http(SepoliaRpcUrl)
  },
  ssr: true,
});

export const defaultChainId: number = sepolia.id