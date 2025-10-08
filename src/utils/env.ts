import { Address, zeroAddress } from "viem";

// 合约地址
export const StakeContractAddress = (process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address) || zeroAddress;

// RPC 节点地址
export const InfuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || 'd8ed0bd1de8242d998a1405b6932ab33';
export const SepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || `https://sepolia.infura.io/v3/${InfuraApiKey}`;

// WalletConnect 项目 ID
export const WalletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e3242412afd6123ce1dda1de23a8c016';

// 质押池 ID
export const StakePoolId = parseInt(process.env.NEXT_PUBLIC_STAKE_POOL_ID || '0', 10);

// 链 ID
export const ChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111', 10); 