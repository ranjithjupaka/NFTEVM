import { CHAIN_ARBI_ONE, CHAIN_ARBI_TEST, CHAIN_BSC, CHAIN_BSC_TEST, CHAIN_ZKMAIN, CHAIN_ZKTEST } from "../config/constants";

const menus = [
    {
        id: 1,
        name: 'NFTs',
        links: '/nfts',
    },
    {
        id: 2,
        name: 'My NFTs',
        links: '/my-nfts'
    },
    {
        id: 3,
        name: 'Create',
        links: '/create'
    },
    {
        id: 4,
        name: 'Collections',
        links: '/collections'
    },
    {
        id: 5,
        name: 'My Collections',
        links: '/my-collections'
    },
    {
        id: 6,
        name: 'ZkSync Testnet',
        links: '#',
        chainId: CHAIN_ZKTEST,
        namesub: [
            // {
            //     id: 1,
            //     sub: 'ZkSync Mainnet',
            //     links: '#',
            //     chainId: CHAIN_ZKMAIN,
            // },
            {
                id: 2,
                sub: 'Bsc Testnet',
                links: '#',
                chainId: CHAIN_BSC_TEST
            },
            // {
            //     id: 3,
            //     sub: 'Arbitrum Testnet',
            //     links: '#',
            //     chainId: CHAIN_ARBI_TEST
            // },
            // {
            //     id: 4,
            //     sub: 'ZkSync Testnet',
            //     links: '#',
            //     chainId: CHAIN_ZKTEST,
            // },
        ],
    }
]

export default menus;