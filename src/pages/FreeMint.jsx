import React , { useState, useEffect } from 'react';
import { Link, useParams , useNavigate} from 'react-router-dom';
import {ethers, BigNumber} from "ethers"
import { create } from 'ipfs-http-client'

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import {NFTAddr, CHAIN_INFO} from '../config/constants'
import { getGasPrice } from '../utils/utils';

const projectId = '2El2aEUHT8Nd5OYGu6J4aH52G8u';   // <---------- your Infura Project ID
const projectSecret = '2fe6b07c9760882f34bd4965e0841ac0';  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfsClient = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
    timeout:'2m'
});

const FreeMint = () => {
    
    const { colId } = useParams();
    const [chainId, setChainId] = useState();
    const [currentAccount, setCurrentAccount] = useState(null);
    const [image, setImage] = useState(); 
    const setAccount = (_account) => {
        setCurrentAccount(_account);
    }
    const [web3Api, setWeb3Api] = useState(null);

    const [buffer, setBuffer] = useState();
    const [displayImage, setDisplayImage] = useState();
    const [data, setData] = useState({
        nftName: "ZkSea - Spring Thaw", ownerName: "ZkSea", description: "ZkSea: Spring Thaw", price: "0",  numMint: "1"
    })
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [dataType, setDataType] = useState();
    const [errStr, setError] = useState(false);
    const [underminting, setUnderminting] = useState(false);
    const [nftContract, setNftContract] = useState();
    const [balance, setBalance] = useState();
    const [errText, setErrText] = useState("");
    const [txHash, setTxHash] = useState("");
    const [mintResult, setMintResult] = useState(false);

    const navigate = useNavigate();

    useEffect(async () => {
        if (chainId && web3Api && currentAccount) {
            const nftContratFile = await fetch("/abis/ZkSeaNFT.json");
            const convertNftContratFileToJson = await nftContratFile.json();
            const nFTAbi = convertNftContratFileToJson;
    
            let nftContract = new web3Api.eth.Contract(nFTAbi, NFTAddr[chainId]);
            setNftContract(nftContract);

            const balance = await web3Api.eth.getBalance(currentAccount);
            setBalance(web3Api.utils.fromWei(balance, 'ether'));
        }        
    }, [chainId, web3Api, currentAccount])

    useEffect(async () => {
        selectImage();
    }, [])    

    const freemintimageurl = "/assets/images/zk/freemint.mp4";
    const selectImage = () => {
        fetch(freemintimageurl, {
            method: 'GET'
          })
        .then(async response => {
            const blob = await response.blob();
            const file = new File([blob], 'zkseafree.mp4', { type: 'video/mp4' });
            console.log("Here is JavaScript File Object",file);
            setImage(file);
            setDisplayImage(freemintimageurl);
            setDataType('video/mp4');

        })
    }

    const checkSubmitValidation = () => {
        console.log('balalce == ', balance);
        if (balance < web3Api.utils.fromWei("10000000000000000", 'ether')) {
            setErrText('Low balance');
            return false;
        }

    }

    const submit = async (_event) => {

        _event.preventDefault();
        // back if under minting
        if(underminting) return;
        setMintResult(false);
        
        if(checkSubmitValidation() === false) {
            setShow(false);
            return;
        }

        if (web3Api) {
            setError(false);
            setUnderminting(true);
            try {
                // const uploadResult = await ipfsClient.add(image);
                // mintMultiple(uploadResult.path);
                mintMultiple("QmZCtJkxtEg3E5Yn137KfpjggJToXCsYBf3X3RvvfbbCSf");
            } catch (error) {
                console.log('error - IPFS', error);
                setError(true)
                setUnderminting(false);
            }            
        } else {
            setError(true)
            setUnderminting(false);
        }
    }

    const mintMultiple = async (nftImage) => {
        if (web3Api) {
            setShow(true)
            let copies = 1;

            const des = JSON.stringify([data.description, dataType])
            const _times = data.numMint;

            let amount = 0;
            if (data.price)
                amount = ethers.utils.formatUnits(ethers.utils.parseUnits(data.price.toString(), 18), 0);

            const mintfee = await nftContract.methods.mintfee().call();
            const mintfeeTotal = mintfee * _times;
            const gasPriceNumber = await getGasPrice();

            nftContract.methods.createMulti("1", currentAccount, nftImage, data.nftName, data.ownerName, copies, des, _times, amount).send({ from: currentAccount, value: mintfeeTotal, gasPrice: gasPriceNumber})
            .then((result) => {
                if (result.status === true) { 
                    // console.log(result.transactionHash);
                    setTxHash(result.transactionHash);                    
                    setShow(false);
                    setUnderminting(false);
                    setMintResult(true);
                    // navigate("/my-nfts");
                } else {
                    alert('failed');
                    setUnderminting(false)
                }
            }).catch((err) => {
                console.log(err)
                setShow(false);
                setUnderminting(false)
            })
        }
    }

    return (
        <>
            <Header setAccount={setAccount} setWeb3Api={setWeb3Api} setChainId={setChainId}/>
            <section className="first-section">
                <div className="autoContainer">
                <div className="hero__bg">
                    <span className="blur"></span>
                </div>
                <div className="hero__inner">
                    <div className="hero__inner-content">
                    <h1>CLAIM YOUR PIECE OF WEB3 HISTORY BELOW.</h1>
                    <div className="hero__inner-banner">
                        <img src="/assets/images/zk/f-mint-intro.png" alt="" />
                        <span></span>
                    </div>
                    <p>
                        Begin the steps to connect your MetaMask wallet and claim your
                        Shanghai/Capella NFT.
                    </p>
                    <p>
                        If you don't have
                        <a
                        href="https://metamask.io/"
                        className="link link--inline"
                        target="_blank"
                        >MetaMask</a
                        >
                        we can help you install it and show you how to fund your account
                        to pay the network gas fee.
                    </p>
                    <div className="hero__inner-content-group">
                        <button className="button button--primary _lg">                            
                            <span className="_hideMob">Start you nft claim</span>
                            <img src="/assets/images/zk/f-arrow-right.svg"></img>                        
                        </button>
                        <small>Powered by ConsenSys NFT</small>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            <section className="note">
                <div className="autoContainer">
                    <div className="note__inner">
                        <div className="note__inner-title">
                        <h2 className="lg">
                            SHANGHAI<span>/<br /></span> CAPELLA
                        </h2>
                        </div>
                        <div className="note__inner-text">
                        <p className="sm">
                            A CELEBRATION OF THE NEXT MILESTONE IN THE EVOLUTION OF ETHEREUM
                            <strong className="noBreak"
                            >OPEN EDITION - Available for 28h 40m 36s</strong
                            >
                        </p>
                        <p className="sm">
                            Celebrate the Ethereum Shanghai/Capella upgrade with a limited
                            availability NFT.
                            <span className="noBreak"> FREE - SUBJECT TO NETWORK GAS FEE </span>
                        </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="nft">
                <div className="autoContainer">
                    <div className="nft__inner">
                        <div className="nft__bg">
                        <span className="blur"></span>
                        </div>
                        <div className="nft__inner-banner">
                        <div className="ratioImage" style={{paddingBottom:0}}>
                            {/* <img src={displayImage} alt="" /> */}
                            <video alt="" muted autoPlay loop style={{objectFit:"contain", borderRadius:"inherit", marginBottom:0}}>
                                <source src="/assets/images/zk/freemint.mp4" />
                            </video>
                        </div>
                        </div>
                        <div className="nft__inner-header">
                        <h3>ZkSea: Spring Thaw</h3>
                        <span className="badge">0x864e</span>
                        <Link to="#" className="badge">
                            <img src="/assets/images/zk/chain.svg" alt="" />
                            Link
                        </Link>
                        <p className="xlg">
                            A commemorative NFT to mark the Linea launch amidst the zkEVM
                            spring.
                        </p>
                        </div>
                        <ul className="nft__inner-list">
                        <li className="nft__inner-list-item">
                            <span>Price</span>
                            <strong>Free</strong>
                        </li>
                        <li className="nft__inner-list-item">
                            <span>Mint fee</span>
                            <div className="nft__inner-list-item-group">
                            <strong>0.00069 ETH</strong>
                            <small>-$ 1.43</small>
                            </div>
                        </li>
                        <li className="nft__inner-list-item _footer">
                            <span>Mint fee</span>
                            <div className="nft__inner-list-item-group">
                            <strong>0.00069 ETH</strong>
                            <small>-$ 1.43</small>
                            </div>
                        </li>
                        </ul>
                        <div className="nft__inner-footer">
                        <h3 className="color--danger">{errText}</h3>
                        <div className="nft__inner-footer-content">
                            <button className="badge badge--black" onClick={(e) => {submit(e)}}>
                                {underminting ? <span>Minting</span> : <span>Mint</span>}
                                {underminting && <span className="spinner"></span>}
                            </button>
                            <div className="nft__inner-footer-content-row">
                            <div className="badge badge--column badge--lightprimary">
                                Ends in<br />
                                <strong>65 days</strong>
                            </div>
                            <div className="badge badge--column badge--lightprimary">
                                Minted<br />
                                <strong>92,740</strong>
                            </div>
                            </div>
                            {mintResult && 
                                <a className="button button--primary _lg" href={CHAIN_INFO[chainId].blockExplorerUrls[0] + "/tx/" + txHash} target="_blank">
                                    <span>
                                        <span className="_hideMob">Successfully minted -</span>
                                        view on etherscan
                                    </span>
                                    <img src="/assets/images/zk/f-arrow-right.svg"></img>
                                </a>
                            }
                            <button className="button button--text">Switch wallet</button>
                        </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default FreeMint;
