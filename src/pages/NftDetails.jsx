import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import fromExponential from 'from-exponential';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { NFTAddr, DevWallet, IPFS_BASE_URL, VIDEO_TYPE, IMAGE_TYPE, AUDIO_TYPE, CHAIN_INFO } from '../config/constants'
import { getCanonicalPath, getGasPrice } from '../utils/utils';

const NftDetails = () => {
    const { nftid } = useParams()

    const [currentAccount, setCurrentAccount] = useState(null);
    const [chainId, setChainId] = useState();
    const setAccount = (_account) => {
        setCurrentAccount(_account);
    }
    const [web3Api, setWeb3Api] = useState(null);
    const [nftContract, setNftContract] = useState();
    const [colData, setColData] = useState();
    const [show, setShow] = useState();
    const [buyPrice, setBuyPrice] = useState();
    const [aucBuyPrice, setAucBuyPrice] = useState();
    const [aucOwner, setAucOwner] = useState();
    const [aucStat, setAucStat] = useState();
    const [openBid, setOpenBid] = useState();
    const [nOwner, setNOwner] = useState();
    const [aucTime, setAucTime] = useState();
    const [hour, setHour] = useState()
    const [days, setDays] = useState()
    const [saleval, setSaleVal] = useState()
    const [auctionval, setAuctionValue] = useState()
    const [nftData, setNftData] = useState();
    const [btnName, setBtnName] = useState();
    const [mybalance, setMybalance] = useState();
    const [listPrice, setListPrice] = useState(0);
    const [takerFee, setTakerFee] = useState();
    const [royalty, setRoyalty] = useState();
    const [totalFee, setTotalFee] = useState();

    const navigate = useNavigate();

    useEffect(async () => {
        if (chainId && web3Api && currentAccount) {
            const nftContratFile = await fetch("/abis/ZkSeaNFT.json");
            const convertNftContratFileToJson = await nftContratFile.json();
            const nFTAbi = convertNftContratFileToJson;

            let nftContract = new web3Api.eth.Contract(nFTAbi, NFTAddr[chainId]);
            setNftContract(nftContract);

            const balance = await web3Api.eth.getBalance(currentAccount);
            setMybalance(web3Api.utils.fromWei(balance, 'ether'));            
        }
    }, [chainId, web3Api, currentAccount])

    useEffect(async () => {
        if (web3Api && nftContract) {
            if (nftid) {
                saleNft(nftid)
                auctionDetail(nftid)
                timer(nftid)
                nftInfo(nftid)
                // auctionState(nftid)
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
                .then((result) => {
                    setBuyPrice((Number(result[3])) / 1000000000000000000);
                    setAucBuyPrice(((Number(result[2])) / 1000000000000000000));
                    if (((Number(result[2])) / 1000000000000000000) > 0) {
                        setListPrice((Number(result[2])) / 1000000000000000000);
                    } else {
                        setListPrice((Number(result[3])) / 1000000000000000000);
                    }                    
                })
                .catch()
        }
    }

    const buyFixedNft = async (collectionid, tokenid, amount) => {
        if (web3Api) {
            setShow(true);
            setBtnName("buynft");
            const gasPriceNumber = await getGasPrice();
            let amountIn = web3Api.utils.toBN(fromExponential(((parseFloat(amount)) * Math.pow(10, 18))));

            nftContract.methods.buynft(collectionid, tokenid).send({ from: currentAccount, value: amountIn, gasPrice: gasPriceNumber})
                .then((recipt) => {
                    setShow(false);
                    navigate("/my-nfts");
                })
                .catch((err) => {
                    setShow(false)
                })
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
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const removeAuction = async (tokenid) => {
        if (web3Api) {
            setShow(true)
            setBtnName("cancelauc");

            const gasPriceNumber = await getGasPrice();

            nftContract.methods.removesfromauction(tokenid).send({ from: currentAccount, gasPrice: gasPriceNumber })
            .then((result) => {
                console.log(result);
                setShow(false);
                window.location.reload();
            })
            .catch((err) => {
                setShow(false)
            })
        }
    }

    const removeSale = async (collectionid, tokenid) => {
        if (web3Api) {
            setShow(true)
            setBtnName("cancelsale");

            const gasPriceNumber = await getGasPrice();

            nftContract.methods.cancelfixedsale(tokenid).send({ from: currentAccount, gasPrice: gasPriceNumber})
            .then((result) => {
                console.log(result);
                window.location.reload();
            })
            .catch((err) => {
                setShow(false)
            })

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

    const buyAuctionNft = async (tokenid) => {

        if (Number(aucBuyPrice) * 1000000000000000000 * 1.02 / 1000000000000000000 > (Number(mybalance) + 0.003)) return false;

        if (web3Api) {
            setShow(true)
            setBtnName("buyauc");

            const gasPriceNumber = await getGasPrice();
            let amountIn = web3Api.utils.toBN(fromExponential(((parseFloat(aucBuyPrice)) * Math.pow(10, 18))));            

            nftContract.methods.buyauction(tokenid).send({ from: currentAccount, value: amountIn, gasPrice: gasPriceNumber })
                .then((recipt) => {
                    setShow(false);
                    window.location.reload();
                })
                .catch((err) => {
                    setShow(false)
                })
        }
    }

    const timer = async (id) => {
        if (web3Api) {
            nftContract.methods.timing(id).call({ from: currentAccount })
                .then((result) => {
                    var day = Math.floor(result / 86400)
                    var hr = Math.floor((result - day * 86400) / 3600)
                    var minutesout = Math.floor((result - day * 86400 - hr * 3600) / 60);
                }).catch()
        }
    }

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

    const claimAuctionNft = async (collectionid, tokenid) => {
        if (web3Api) {
            setShow(true)
            setBtnName("claimauc");
            const gasPriceNumber = await getGasPrice();

            nftContract.methods.claim(collectionid, tokenid).send({ from: currentAccount, gasPrice: gasPriceNumber })
            .then((recipt) => {
                setShow(false)
                navigate("/my-collections")
            })
            .catch((err) => {
                setShow(false)
            })
        }
    }

    const fixedSale = async (tokenid, price) => {
        setShow(true)
        setBtnName("fixedsale");
        if (web3Api) {

            const gasPriceNumber = await getGasPrice();
            let priceIn = web3Api.utils.toBN(fromExponential(((parseFloat(price)) * Math.pow(10, 18))));   

            nftContract.methods.fixedsales(tokenid, priceIn).send({ from: currentAccount, gasPrice: gasPriceNumber})
            .then((result) => {
                if (result.status === true) {
                    setShow(false);
                    navigate("/my-collections")
                } else {
                    alert('failed');
                }
            })
            .catch((err) => {
                setShow(false);
            })
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

    const auction = async (tokenid, price, endday, endhours) => {
        if (web3Api) {
            setShow(true)
            setBtnName("auc");
            const gasPriceNumber = await getGasPrice();
            let priceIn = web3Api.utils.toBN(fromExponential(((parseFloat(price)) * Math.pow(10, 18))));

            nftContract.methods.startauction(tokenid, priceIn, endday, endhours).send({ from: currentAccount, gasPrice: gasPriceNumber})
            .then((recipt) => {
                if (recipt.status === true) {
                    setShow(false)
                    navigate("/my-collections")
                } else {
                    alert('failed')
                }
            })
            .catch(err => {
                setShow(false)
            })
        }
    }

    const burnMain = async (tokenid) => {
        setShow(true)
        setBtnName("burn");
        if (web3Api) {
            const gasPriceNumber = await getGasPrice();

            const colId = nftData[7];
            nftContract.methods.burnorinalnft(colId, tokenid).send({ from: currentAccount, gasPrice: gasPriceNumber})
            .then((result) => {
                console.log(result);
                setShow(false)
                navigate("/my-nfts")
            })
            .catch((err) => {
                setShow(false)
                console.log(err);
            })
        }
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
                            <h2>
                                {nftData && nftData[1]}
                            </h2>
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
                                <h5>
                                    {aucBuyPrice > 0 ? "Auction Min Price" : "List Price"}
                                </h5>
                                <p>
                                    <span>
                                        <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    {listPrice} {chainId && CHAIN_INFO[chainId].nativeCurrency.symbol}
                                </p>
                            </div>
                            <div className="productDetails__inner-info-text">
                                <h5>
                                    Taker Fee
                                </h5>
                                <p>
                                    (1.5%)
                                    <span>
                                        <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    {Number(listPrice) * 1000000000000000000 * 0.015 / 1000000000000000000} {chainId && CHAIN_INFO[chainId].nativeCurrency.symbol}
                                </p>
                            </div>
                            <div className="productDetails__inner-info-text">
                                <h5>
                                    Royalty
                                </h5>
                                <p>
                                    Full (5%)
                                    <span>
                                        <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    {Number(listPrice) * 1000000000000000000 * 0.05 / 1000000000000000000} {chainId && CHAIN_INFO[chainId].nativeCurrency.symbol}
                                </p>
                            </div>
                            <div className="productDetails__inner-info-total">
                                <h5>
                                    Total
                                </h5>
                                <p>
                                    <span>
                                        <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    {Number(listPrice) * 1000000000000000000 * 1.02 / 1000000000000000000} {chainId && CHAIN_INFO[chainId].nativeCurrency.symbol}
                                </p>
                            </div>
                            <div className="productDetails__inner-info-pay">
                                <div className="productDetails__inner-info-pay-text">
                                    <span>
                                        <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    <h5>
                                        Pay in {chainId && CHAIN_INFO[chainId].nativeCurrency.symbol}
                                    </h5>
                                </div>
                                <p>
                                    Connect supported wallet • Fastest
                                </p>
                                <div className="arrow">
                                    <img src="/assets/images/zk/arrow-down.svg" alt="" />
                                </div>
                            </div>
                            {(aucBuyPrice > 0 ? Number(aucBuyPrice) * 1000000000000000000 * 1.02 / 1000000000000000000 : Number(listPrice) * 1000000000000000000 * 1.02 / 1000000000000000000) > (Number(mybalance) + 0.003) &&
                                <p>
                                    <span>
                                        <img src="/assets/images/zk/infoYellow.svg" alt="" />
                                    </span>
                                    Not enough funds in your wallet
                                </p>
                            }
                            <br/>
                            {/* <div className="productDetails__inner-info-text">
                                <h6>
                                    Add funds with:
                                </h6>
                                <p>
                                    <span>
                                        <img src="/assets/images/zk/stripe.svg" alt="" />
                                    </span>
                                    Stripe
                                </p>
                            </div> */}
                            {/* {nOwner?.toLowerCase() !== currentAccount?.toLowerCase() && 
                                <div className="productDetails__inner-info-text">
                                    <button className="button--primary" style={{width:"100%", borderRadius:8}} onClick={() => navigate('/bid/' + nftData[0])} >Make Offer</button>
                                </div>
                            }   */}
                            {buyPrice > 0 && nOwner?.toLowerCase() === currentAccount?.toLowerCase() ? null :
                                buyPrice > 0 ? 
                                <div className="productDetails__inner-info-text">
                                    <button className="button--primary" style={{width:"100%", borderRadius:8}} onClick={() => buyFixedNft(nftData[7], nftData[0], buyPrice)} >Buy now {btnName=="buynft" && show && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                                </div>
                                 : null
                            }                          

                            {aucTime?.d === 0 && aucTime?.h === 0 && aucTime?.m === 0 && aucOwner?.id.toLowerCase() === currentAccount?.toLowerCase() ?
                                (aucBuyPrice > 0 && aucOwner?.val >= aucBuyPrice) ? 
                                <div className="productDetails__inner-info-text">
                                    <button style={{width:"100%", borderRadius:8}}  className="button--primary" onClick={() => claimAuctionNft(nftData[7], nftData[0])}  >CLAIM {btnName=="claimauc" && show && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                                </div>
                                 : 
                                Number(aucBuyPrice) > 0 && Number(aucBuyPrice) > aucOwner?.val && nOwner?.toLowerCase() === currentAccount?.toLowerCase() ? 
                                <div className="productDetails__inner-info-text">
                                    <button style={{width:"100%", borderRadius:8}}  className="button--primary" onClick={() => removeAuction(nftData[0])} >Cancel Auction {btnName=="cancelauc" && show && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                                </div>
                                 : null
                                : null
                            }

                            {aucTime?.d === 0 && aucTime?.h === 0 && aucTime?.m === 0 && Number(aucBuyPrice) > 0 && Number(aucBuyPrice) > aucOwner?.val && nOwner?.toLowerCase() === currentAccount?.toLowerCase() ? 
                                <div className="productDetails__inner-info-text">
                                    <button style={{width:"100%", borderRadius:8}}  className="button--primary" onClick={() => removeAuction(nftData[0])} >Cancel Auction {btnName=="cancelauc" && show && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                                </div>: null
                            }

                            {
                                nOwner?.toLowerCase() === currentAccount?.toLowerCase() ? null :
                                    openBid ? null :
                                    aucBuyPrice > 0 ?
                                    aucTime?.d === 0 && aucTime?.h === 0 && aucTime?.m === 0 ? null :
                                    <div className="productDetails__inner-info-text">
                                        <button style={{width:"100%", borderRadius:8}} className="button--primary"  onClick={() => setOpenBid(true)} >BID</button>
                                    </div>
                                    : null
                            }

                            <form onSubmit={(e) => { e.preventDefault() ; buyAuctionNft(nftData[0]); }}>
                                {openBid ?
                                    <div className="productDetails__inner-info-text">
                                        <input type="Number" placeholder="Enter bid value" step="any" min={aucBuyPrice > aucOwner?.val ? aucBuyPrice : aucOwner?.val} onBlur={(e) => setAucBuyPrice(Number(e.target.value))} required /> 
                                    </div>: null
                                }
                                {openBid ?
                                    aucBuyPrice > 0 ?
                                    <div className="productDetails__inner-info-text">
                                        <button style={{width:"100%", borderRadius:8}} className="button--primary" >BID {btnName=="buyauc" && show && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                                    </div> : null
                                    : null
                                }                                  
                            </form>
                            
                            {
                                nftData && nftData[8].toLowerCase() === currentAccount?.toLowerCase() ?
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    auction(nftData[0], auctionval, days, hour)
                                }}>
                                    <div className="productDetails__inner-info-text">
                                        <h3 style={{ fontSize: '25px', textTransform: 'capitalize' }}>Auction</h3>
                                    </div>
                                    <div className="productDetails__inner-info-text">
                                        <input type="Number" placeholder="Enter Min Bid Value in ETH" step="any" min={aucBuyPrice > aucOwner?.val ? aucBuyPrice : aucOwner?.val} onChange={(e) => {setAuctionValue(e.target.value); setListPrice(Number(e.target.value))}} required />
                                    </div>
                                    <div className="productDetails__inner-info-text">
                                        <input type="Number" placeholder="Enter Days" min="0" onChange={(e) => setDays(e.target.value)} required />
                                    </div>
                                    <div className="productDetails__inner-info-text">
                                        <input type="Number" placeholder="Enter Hours" min="0" onChange={(e) => setHour(e.target.value)} required />
                                    </div>
                                    <button style={{width:"100%", borderRadius:8}} className="button--primary" >Auction{btnName=="auc" && show && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                                </form> : null
                            }

                            {
                                nftData && nftData[8].toLowerCase() === currentAccount?.toLowerCase() ?
                                <form onSubmit={(e) => {
                                        e.preventDefault()
                                        fixedSale(nftData[0], saleval)

                                    }} style={{marginTop:8}}>
                                    <div className="productDetails__inner-info-text">
                                        <h3 style={{ fontSize: '25px', textTransform: 'capitalize' }}>Set Sale Price</h3>
                                    </div>
                                    <div className="productDetails__inner-info-text">
                                        <input type="Number" placeholder="Enter Sale Price in ETH" step="any" min={aucBuyPrice > aucOwner?.val ? aucBuyPrice : aucOwner?.val} onChange={(e) => setSaleVal(e.target.value)} required />
                                    </div>
                                    <div className="productDetails__inner-info-text">
                                        <button className="button--primary" style={{width:"100%", borderRadius:8}}  >Set Sale Price {btnName=="fixedsale" && show && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>  
                                    </div>
                                </form>: null
                            }
                            
                            {
                                buyPrice > 0 && nOwner?.toLowerCase() === currentAccount?.toLowerCase() ? 
                                <div className="productDetails__inner-info-text">
                                    <button className="button--primary" style={{width:"100%", borderRadius:8}} onClick={() => removeSale(nftData[7], nftData[0])} >Cancel Sale {btnName=="cancelsale" && show && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button> 
                                </div>                                
                                : null
                            }

                            {
                                DevWallet.toLowerCase() == currentAccount?.toLowerCase() ?
                                <div className="productDetails__inner-info-text">
                                    <button className="button--primary" style={{width:"100%", borderRadius:8}} onClick={() => burnMain(nftid)} >Burn NFT {btnName=="burn" && show && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                                </div>
                                : null
                            }

                        </div>
                    </div>
                </div>
            </section>
            {/* <section className="tab">
                <div className="autoContainer">
                    <div className="tab__inner">
                    <div className="tab__inner-column">
                        <div className="tabItem">
                        <div className="tabItem__buttons">
                            <div className="tabItem__buttons-body tabBtn wow fadeInUp" data-tab="#tab-1" data-wow-duration=".3s"
                            data-wow-delay=".1s">
                            <span className="icon">
                                <img src="/assets/images/zk/pulse.svg" alt="" />
                            </span>
                            <h5>
                                Price history
                            </h5>
                            <span className="icon arrow">
                                <img src="/assets/images/zk/arrow-down.svg" alt="" />
                            </span>
                            </div>
                            <div className="tabItem__buttons-body tabBtn wow fadeInUp" data-tab="#tab-2" data-wow-duration=".3s"
                            data-wow-delay=".14s">
                            <span className="icon">
                                <img src="/assets/images/zk/flash.svg" alt="" />
                            </span>
                            <h5>
                                No offer yet
                            </h5>
                            <span className="icon arrow">
                                <img src="/assets/images/zk/arrow-down.svg" alt="" />
                            </span>
                            </div>
                            <div className="tabItem__buttons-body tabBtn wow fadeInUp" data-tab="#tab-3" data-wow-duration=".3s"
                            data-wow-delay=".17s">
                            <span className="icon">
                                <img src="/assets/images/zk/pulse.svg" alt="" />
                            </span>
                            <h5>
                                Activities
                            </h5>
                            <span className="icon arrow">
                                <img src="/assets/images/zk/arrow-down.svg" alt="" />
                            </span>
                            </div>
                        </div>
                        <div className="tabItem__contents">
                            <div className="tabItem__contents-item tabEvent" id="tab-1">
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Mint Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    JBscG ... xgc
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Token Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    9p2yG ... zdf
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Owner
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    Nsge5 ... g6n
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Creator Royalties
                                </h6>
                                <p>
                                5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Taker Fee
                                </h6>
                                <p>
                                1.5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Listing/Bidding/Cancel
                                </h6>
                                <p>
                                Free
                                </p>
                            </div>
                            </div>
                            <div className="tabItem__contents-item tabEvent" id="tab-2">
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Mint Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    JBscG ... xgc
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Token Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    9p2yG ... zdf
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Owner
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    Nsge5 ... g6n
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Creator Royalties
                                </h6>
                                <p>
                                5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Taker Fee
                                </h6>
                                <p>
                                1.5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Listing/Bidding/Cancel
                                </h6>
                                <p>
                                Free
                                </p>
                            </div>
                            </div>
                            <div className="tabItem__contents-item tabEvent" id="tab-3">
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Mint Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    JBscG ... xgc
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Token Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    9p2yG ... zdf
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Owner
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    Nsge5 ... g6n
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Creator Royalties
                                </h6>
                                <p>
                                5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Taker Fee
                                </h6>
                                <p>
                                1.5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Listing/Bidding/Cancel
                                </h6>
                                <p>
                                Free
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="tab__inner-column">
                        <div className="tabItem">
                        <div className="tabItem__buttons">
                            <div className="tabItem__buttons-body tabBtn wow fadeInUp" data-tab="#tab-4" data-wow-duration=".3s"
                            data-wow-delay=".2s">
                            <span className="icon">
                                <img src="/assets/images/zk/user.svg" alt="" />
                            </span>
                            <h5>
                                Price historyAbout Doodle Soda
                            </h5>
                            <span className="icon arrow">
                                <img src="/assets/images/zk/arrow-down.svg" alt="" />
                            </span>
                            </div>
                            <div className="tabItem__buttons-body tabBtn wow fadeInUp" data-tab="#tab-5" data-wow-duration=".3s"
                            data-wow-delay=".24s">
                            <span className="icon">
                                <img src="/assets/images/zk/shield.svg" alt="" />
                            </span>
                            <h5>
                                Attributes
                            </h5>
                            <span className="icon arrow">
                                <img src="/assets/images/zk/arrow-down.svg" alt="" />
                            </span>
                            </div>
                            <div className="tabItem__buttons-body tabBtn wow fadeInUp active" data-tab="#tab-6" data-wow-duration=".3s"
                            data-wow-delay=".27s">
                            <span className="icon">
                                <img src="/assets/images/zk/details.svg" alt="" />
                            </span>
                            <h5>
                                Details
                            </h5>
                            <span className="icon arrow">
                                <img src="/assets/images/zk/arrow-down.svg" alt="" />
                            </span>
                            </div>
                        </div>
                        <div className="tabItem__contents">
                            <div className="tabItem__contents-item tabEvent" id="tab-4">
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Mint Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    JBscG ... xgc
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Token Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    9p2yG ... zdf
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Owner
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    Nsge5 ... g6n
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Creator Royalties
                                </h6>
                                <p>
                                5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Taker Fee
                                </h6>
                                <p>
                                1.5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Listing/Bidding/Cancel
                                </h6>
                                <p>
                                Free
                                </p>
                            </div>
                            </div>
                            <div className="tabItem__contents-item tabEvent" id="tab-5">
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Mint Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    JBscG ... xgc
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Token Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    9p2yG ... zdf
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Owner
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    Nsge5 ... g6n
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Creator Royalties
                                </h6>
                                <p>
                                5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Taker Fee
                                </h6>
                                <p>
                                1.5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Listing/Bidding/Cancel
                                </h6>
                                <p>
                                Free
                                </p>
                            </div>
                            </div>
                            <div className="tabItem__contents-item tabEvent active" id="tab-6">
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Mint Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    JBscG ... xgc
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Token Address
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    9p2yG ... zdf
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Owner
                                </h6>
                                <div className="tabItem__contents-item-text">
                                <span className="icon">
                                    <img src="/assets/images/zk/solanafm.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/selonasarch.svg" alt="" />
                                </span>
                                <span className="icon">
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    Nsge5 ... g6n
                                </p>
                                </div>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Creator Royalties
                                </h6>
                                <p>
                                5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Taker Fee
                                </h6>
                                <p>
                                1.5%
                                </p>
                            </div>
                            <div className="tabItem__contents-item-body tabEvent">
                                <h6>
                                Listing/Bidding/Cancel
                                </h6>
                                <p>
                                Free
                                </p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </section> */}
            <Footer />
        </div>
    );
}

export default NftDetails;
