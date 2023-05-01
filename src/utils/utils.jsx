import { ethers } from "ethers";
import Web3 from "web3"
import fromExponential from "from-exponential";
import { Provider } from "zksync-web3";
import { CHAIN_ARBI_ONE, CHAIN_ARBI_TEST, CHAIN_BSC, CHAIN_BSC_TEST, CHAIN_INFO, CHAIN_ZKMAIN, CHAIN_ZKTEST } from "../config/constants";

export const getGasPrice = async () => {

    const chainSavedId = localStorage.getItem('nftzksea-chainId'); 
    let gasPriceNumber;
    let provider;
    let gasPriceInUnits;
    let web3;

    switch (Number(chainSavedId)) {
        case CHAIN_ZKTEST:
            // const signer = (new Web3Provider(window.ethereum)).getSigner();
            provider = new Provider('https://testnet.era.zksync.dev');
            gasPriceInUnits = await provider.getGasPrice();
            gasPriceNumber = fromExponential(parseFloat(ethers.utils.formatUnits(gasPriceInUnits, 9)) * Math.pow(10, 9));
            break;
            
        case CHAIN_ZKMAIN:
            // const signer = (new Web3Provider(window.ethereum)).getSigner();
            provider = new Provider('https://mainnet.era.zksync.io');
            gasPriceInUnits = await provider.getGasPrice();
            gasPriceNumber = fromExponential(parseFloat(ethers.utils.formatUnits(gasPriceInUnits, 9)) * Math.pow(10, 9));
            break;
            
        case CHAIN_ARBI_ONE:
            web3 = new Web3(new Web3.providers.HttpProvider(CHAIN_INFO[CHAIN_ARBI_ONE].rpcUrls[0]));
            gasPriceInUnits = await web3.eth.getGasPrice();
            gasPriceNumber = fromExponential(parseFloat(ethers.utils.formatUnits(gasPriceInUnits, 9)) * Math.pow(10, 9));
            break;
        case CHAIN_ARBI_TEST:
            web3 = new Web3(new Web3.providers.HttpProvider(CHAIN_INFO[CHAIN_ARBI_TEST].rpcUrls[0]));
            gasPriceInUnits = await web3.eth.getGasPrice();
            gasPriceNumber = fromExponential(parseFloat(ethers.utils.formatUnits(gasPriceInUnits, 9)) * Math.pow(10, 9));
            console.log(CHAIN_ARBI_TEST);
            break;
        
        case CHAIN_BSC:
            web3 = new Web3(new Web3.providers.HttpProvider(CHAIN_INFO[CHAIN_BSC].rpcUrls[0]));
            gasPriceInUnits = await web3.eth.getGasPrice();
            gasPriceNumber = fromExponential(parseFloat(ethers.utils.formatUnits(gasPriceInUnits, 9)) * Math.pow(10, 9));
            break;     
        case CHAIN_BSC_TEST:
            web3 = new Web3(new Web3.providers.HttpProvider(CHAIN_INFO[CHAIN_BSC_TEST].rpcUrls[0]));
            gasPriceInUnits = await web3.eth.getGasPrice();
            gasPriceNumber = fromExponential(parseFloat(ethers.utils.formatUnits(gasPriceInUnits, 9)) * Math.pow(10, 9));            
            break;       
    
        default:
            // const signer = (new Web3Provider(window.ethereum)).getSigner();
            provider = new Provider('https://testnet.era.zksync.dev');
            gasPriceInUnits = await provider.getGasPrice();
            gasPriceNumber = fromExponential(parseFloat(ethers.utils.formatUnits(gasPriceInUnits, 9)) * Math.pow(10, 9));
            break;
    }

    return gasPriceNumber;
    
};

export const getCanonicalPath = (_path) => {

    let tempStr = _path.substring(_path.indexOf("https://") + 8);
    tempStr = tempStr.replace("//", "/");

    return "https://" + tempStr;
    
};