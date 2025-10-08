import { sepolia } from "viem/chains";
import { PublicClient, createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { SepoliaRpcUrl } from './env';


export const viemClients = (chaiId: number): PublicClient => {
  const clients: {
    [key: number]: PublicClient
  } = {
    [sepolia.id]: createPublicClient({
      chain: sepolia,
      transport: http(SepoliaRpcUrl)
    })
  }
  return clients[chaiId]
}