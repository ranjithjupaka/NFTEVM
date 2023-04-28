import { CHAIN_ARBI_ONE, CHAIN_BSC, CHAIN_ZKMAIN, CHAIN_ZKTEST } from "../config/constants";

const menuChains = [    
    {
        id: 1,
        name: 'ZkSync Testnet',
        links: '#',
        chainId: CHAIN_ZKTEST,
        namesub: [
            {
                id: 1,
                sub: 'ZkSync Mainnet',
                links: '#',
                chainId: CHAIN_ZKMAIN,
            },
            {
                id: 2,
                sub: 'Bsc Mainnet',
                links: '#',
                chainId: CHAIN_BSC
            },
            {
                id: 3,
                sub: 'Arbitrum One',
                links: '#',
                chainId: CHAIN_ARBI_ONE
            },
            {
                id: 4,
                sub: 'ZkSync Testnet',
                links: '#',
                chainId: CHAIN_ZKTEST,
            },
        ],
    } 
]

export default menuChains;