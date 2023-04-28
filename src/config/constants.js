export const DevWallet="0x99E877887Dc1fE2Bf960FE5fe24C5C5808609F59"
export const IPFS_BASE_URL = "https://ipfs.io/ipfs/";
export const VIDEO_TYPE = ["video/mp4", "video/mov", "video/webm"];
export const IMAGE_TYPE = ["image/jpeg", "image/png", "image/gif", "image/svg", "image/jpg"];
export const AUDIO_TYPE = ["audio/mpeg"];

export const NFTAddr = {
    56: "0x6BDB4Eff77dcBB4a4E9D39cA99B5e7c0e315e7c2",
    324: "0x6BDB4Eff77dcBB4a4E9D39cA99B5e7c0e315e7c2",
    42161: "0x6BDB4Eff77dcBB4a4E9D39cA99B5e7c0e315e7c2",
    280: "0x6BDB4Eff77dcBB4a4E9D39cA99B5e7c0e315e7c2",
}

export const CHAIN_ZKMAIN = 324;
export const CHAIN_ZKTEST = 280;
export const CHAIN_BSC = 56;
export const CHAIN_ARBI_ONE = 42161;

export const CHAIN_INFO = {
    56: {
        chainId: '0x38',
        chainName: 'Binace Smart Chain',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/'],
    },

    324: {
        chainId: '0x144',
        chainName: 'Zksync Main Net',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://mainnet.era.zksync.io'],
        blockExplorerUrls: ['https://explorer.zksync.io/'],
    },

    42161: {
        chainId: '0xA4B1',
        chainName: 'Arbitrum One',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: [''],
        blockExplorerUrls: ['https://arbiscan.io/'],
    },

    280: {
        chainId: '0x118',
        chainName: 'Zksync Test Net',
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
        },
        rpcUrls: ['https://zksync2-testnet.zksync.dev'],
        blockExplorerUrls: ['https://goerli.explorer.zksync.io/'],
    },
}