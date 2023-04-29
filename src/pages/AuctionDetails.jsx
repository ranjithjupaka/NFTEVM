import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import fromExponential from 'from-exponential';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { NFTAddr, DevWallet, IPFS_BASE_URL, VIDEO_TYPE, IMAGE_TYPE, AUDIO_TYPE } from '../config/constants'
import { getCanonicalPath, getGasPriceZk } from '../utils/utils';

const AuctionDetails = () => {
    const { nftid } = useParams()
    const [chainId, setChainId] = useState();
    const [currentAccount, setCurrentAccount] = useState(null);
    const setAccount = (_account) => {
        setCurrentAccount(_account);
    }
    const [web3Api, setWeb3Api] = useState(null);
    const [nftContract, setNftContract] = useState();
    const [colData, setColData] = useState();
    const [show, setShow] = useState();
    const [buyPrice, setBuyPrice] = useState();
    const [balance, setBalance] = useState();
    const [aucBuyPrice, setAucBuyPrice] = useState();
    const [aucOwner, setAucOwner] = useState();
    const [aucStat, setAucStat] = useState();
    const [nOwner, setNOwner] = useState();
    const [aucTime, setAucTime] = useState();
    const [newBidPrice, setNewBidPrice] = useState();
    const [nftData, setNftData] = useState();

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
        if (web3Api && nftContract) {
            if (nftid) {
                saleNft(nftid)
                auctionDetail(nftid)
                timer1(nftid)
                nftInfo(nftid)
                auctionState(nftid)
                owner(nftid)
            }
        }
    }, [web3Api, nftContract])

    const getCollectionDetails = async (id) => {
        if (web3Api) {
            nftContract.methods.collectiondetails(id).call()
                .then((data) => {
                    setColData(data)
                }).catch()
        }
    }

    const saleNft = async (id) => {
        if (web3Api) {
            nftContract.methods.listofsalenft(id).call({ from: currentAccount })
                .then((length) => {
                    console.log(length[3]);
                    setBuyPrice((Number(length[3])) / 1000000000000000000)
                    setAucBuyPrice(((Number(length[2])) / 1000000000000000000))
                })
                .catch()
        }
    }

    const auctionDetail = async (id) => {
        if (web3Api) {
            nftContract.methods.auctiondetail(id).call({ from: currentAccount })
                .then((value) => {
                    var aucde = {
                        id: value[1],
                        val: (Number(value[0]))?.length > 21 ? Number(value[0]) / 1000000000000000000000000000000000000 : Number(value[0]) / 1000000000000000000,
                        userid: id
                    }
                    setAucOwner(aucde)
                }).catch()

        }
    }

    const auctionState = async (tokenid) => {
        if (web3Api) {
            nftContract.methods.nftauctionend(tokenid).call({ from: currentAccount })
                .then((result) => {
                    setAucStat(result)
                })
                .catch()
        }
    }

    const owner = async (tokenid) => {
        if (web3Api) {
            nftContract.methods.originalowner(tokenid).call({ from: currentAccount })
                .then((result) => {
                    setNOwner(result)
                })
                .catch()
        }
    }

    // const timer = async (id) => {
    //     if (web3Api) {
    //         nftContract.methods.timing(id).call({ from: currentAccount })
    //             .then((result) => {
    //                 var day = Math.floor(result / 86400)
    //                 var hr = Math.floor((result - day * 86400) / 3600)
    //                 var minutesout = Math.floor((result - day * 86400 - hr * 3600) / 60);
    //             }).catch()
    //     }
    // }

    const timer1 = async (id) => {
        if (web3Api) {
            nftContract.methods.timing(id).call({ from: currentAccount })
                .then((result) => {
                    var day = Math.floor(result / 86400)
                    var hr = Math.floor((result - day * 86400) / 3600)
                    var minutesout = Math.floor((result - day * 86400 - hr * 3600) / 60);
                    setAucTime({ id: id, d: day, h: hr, m: minutesout })
                }).catch()
        }
    }    

    const nftInfo = async (id) => {
        if (web3Api) {
            nftContract.methods.nftinformation(id).call({ from: currentAccount })
                .then((result) => {
                    setNftData(result);
                    getCollectionDetails(result[7]);
                }).catch()

        }
    }

    const auction = async () => {
        // if (web3Api) {
        //     setShow(true)
        //     const gasPriceNumber = await getGasPriceZk();

        //     let priceIn = web3Api.utils.toBN(fromExponential(((parseFloat(newBidPrice)) * Math.pow(10, 18))));

        //     nftContract.methods.startauction(nftid, priceIn, 0, 24).send({ from: currentAccount, gasPrice: gasPriceNumber})
        //         .then((recipt) => {
        //             if (recipt.status === true) {
        //                 setShow(false)
        //                 // history.push('/mycollection')
        //             } else {
        //                 alert('failed')
        //             }
        //         })
        //         .catch(err => {
        //             setShow(false)
        //         })
        // }
    }

    return (
        <div className='item-details'>
            <Header setAccount={setAccount} setWeb3Api={setWeb3Api} setChainId={setChainId}/>
            <section className="first-section productDetails">
                <div className="autoContainer">
                    <div className="productDetails__inner">
                        <div className="productDetails__inner-image">
                            {nftData && (VIDEO_TYPE.includes(JSON.parse(nftData[5])[1]) ?
                                <video alt="" muted autoPlay loop>
                                    <source src={getCanonicalPath(IPFS_BASE_URL + nftData[6])} />
                                </video> 
                                : IMAGE_TYPE.includes(JSON.parse(nftData[5])[1]) ?
                                <img src={getCanonicalPath(IPFS_BASE_URL + nftData[6])} alt=""/>
                                : AUDIO_TYPE.includes(JSON.parse(nftData[5])[1]) ?
                                <audio style={{ width: '90%' }} src={getCanonicalPath(IPFS_BASE_URL + nftData[6])} />
                                : null)
                            }
                        </div>
                        <div className="productDetails__inner-info">
                            <h2>Place a bid</h2>
                            <p>Once your bid is placed, you will be the highest bidder in the auction. Learn more.</p>
                            <div className="productDetails__inner-info-tools">
                                <h5>
                                    <p>
                                        {nftData && nftData[3]}
                                    </p>
                                    <div>
                                        <span>
                                            <img src="/assets/images/zk/share.svg" alt="" />
                                        </span>
                                        <small>
                                            Share
                                        </small>
                                    </div>
                                </h5>
                                <button className="refresh">
                                    <img src="/assets/images/zk/refreshGradient.svg" alt="" />
                                </button>
                            </div>
                            <div className="productDetails__inner-info-text">
                                <input onChange={(e) => setNewBidPrice(e.target.value)} type="text" name="text" placeholder="0" />
                            </div>
                            
                            <div className="productDetails__inner-info-text">
                                <h5>
                                    Market Place Price
                                </h5>
                                <p>
                                    <span>
                                        <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    {buyPrice}
                                </p>
                            </div>
                            <div className="productDetails__inner-info-text">
                                <h5>
                                    Wallet Balance
                                </h5>
                                <p>
                                    <span>
                                        <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    {balance}
                                </p>
                            </div>

                            <button className="button--primary" style={{borderRadius:8, width:"100%"}} onClick={() => {auction();}}>Place a Bid</button>
                            
                            {/* <button className="button--primary" onClick={ nOwner == currentAccount }>Buy NFT</button>
                            <button className="button--primary">Set Sale Price</button>
                            <button className="button--primary">Cancel</button>
                            <button className="button--primary">Auction</button> */}

                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default AuctionDetails;
