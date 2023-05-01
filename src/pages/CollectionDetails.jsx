import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import NftItems from '../components/layouts/nfts/NftItems';
import {NFTAddr, DevWallet, IPFS_BASE_URL} from '../config/constants'
import { getCanonicalPath, getGasPrice } from '../utils/utils';

const CollectionDetails = () => {
    const { colId } = useParams();
    const [chainId, setChainId] = useState();
    const [currentAccount, setCurrentAccount] = useState(null);    
    const setAccount = (_account) => {
        setCurrentAccount(_account);
    }
    const [web3Api, setWeb3Api] = useState(null);    
    const [searchWord, setSearchWord] = useState("");    
    const [nftContract, setNftContract] = useState(); 
    const [colData, setColData] = useState(); 
    const [show, setShow] = useState(); 
    const [totalSupply, setTotalSupply] = useState(0);
    const [allNftData, setAllNftData] = useState([]);
    const [saleNFT, setSaleNFT] = useState([]);
    const [ownersData, setOwnersData] = useState([]);
    let owners = [];
    const navigate = useNavigate();

    useEffect(async () => {
        if (chainId && web3Api) {
            const nftContratFile = await fetch("/abis/ZkSeaNFT.json");
            const convertNftContratFileToJson = await nftContratFile.json();
            const nFTAbi = convertNftContratFileToJson;

            let nftContract = new web3Api.eth.Contract(nFTAbi, NFTAddr[chainId]);
            setNftContract(nftContract);
            getCollectionDetails(colId, nftContract);
            getNftsInCol(colId, nftContract);
            getSaleNft(0, nftContract);
        }
    }, [chainId, web3Api])

    const getNftsInCol = async (_colId, _nftContract) => {
        if (web3Api) {
            _nftContract.methods.collectionnft(_colId).call()
            .then((colItemIndex) => {
                setTotalSupply(colItemIndex.length);
                for (let i = 0; i < colItemIndex?.length; i++) {
                    getNftDetails(colItemIndex[i], _nftContract)
                }
            }).catch()
        }
    }

    const getNftDetails = async (id, _nftContract) => {
        if (web3Api) {
            _nftContract.methods.nftinformation(id).call()
            .then((nftDetail) => {
                makeAllNftData({...nftDetail, 12:JSON.parse(nftDetail[5])[1] })
            }).catch()
        }
    }

    const getSaleNft = async (id, _nftContract) => {
        if (web3Api) {
            _nftContract.methods.listofsalenft(id).call()
            .then((result) => {
                setSaleNFT(result[0]);
            }).catch()
        }
    }

    const makeAllNftData = (data) => {
        if (!owners.includes(data[8])) {
            owners.push(data[8]);
            setOwnersData(owners);
        }

        setAllNftData((old) => [
            ...old, data
        ])
    } 

    const getCollectionDetails = async (id, _nftContract) => {
        if (web3Api) {
            _nftContract.methods.collectiondetails(id).call()
            .then((data) => {
                setColData(data)
            }).catch()
        }
    }

    const deleteCollection = async (id) => {
        if (web3Api) {
            setShow(true)
            const accounts = await web3Api.eth.getAccounts();
            let usrWallet = accounts[0];

            const gasPriceNumber = await getGasPrice();

            nftContract.methods.deletecollection(id).send({ from: usrWallet , gasPrice: gasPriceNumber})
            .then((result) => {
                console.log(result);
                // history.push('/mycollection');
                setShow(false)
            }).catch((err) => {
                console.log()
                setShow(false)
            })
        }
    }

    return (
        <div className='item-details'>
            <Header setAccount={setAccount} setWeb3Api={setWeb3Api} setChainId={setChainId}/>
            <section className="first-section productInfo">
                <div className="autoContainer">
                    <div className="productInfo__inner">
                    <div className="productInfo__inner-image">
                        <div className="ratioImage">
                            <img src={colData && (getCanonicalPath(IPFS_BASE_URL + colData[6]))} alt="" />
                        </div>
                    </div>
                    <div className="productInfo__inner-details">
                        <div className="productInfo__inner-details-text">
                        <h2>
                            {colData && colData[2]}
                        </h2>
                        <p>
                            By:
                            <span>
                            {colData && colData[3]}
                            </span>
                        </p>
                        </div>
                        <div className="productInfo__inner-details-wrapper">
                            <div className="productInfo__inner-details-items">
                                <div className="productInfoItem">
                                <h6>
                                    FLOOR
                                </h6>
                                <p>
                                    <span>
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    _ _
                                </p>
                                </div>
                                <div className="productInfoItem">
                                <h6>
                                    TOTAL VOL
                                </h6>
                                <p>
                                    <span>
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    _ _
                                </p>
                                </div>
                                <div className="productInfoItem">
                                <h6>
                                    AVG. SALE 24H
                                </h6>
                                <p>
                                    <span>
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                    </span>
                                    _ _
                                </p>
                                </div>
                                <div className="productInfoItem">
                                <h6>
                                    OWNERS
                                    <span>
                                    <img src="/assets/images/zk/info-circle.svg" alt="" />
                                    </span>
                                </h6>
                                <p>
                                    {ownersData.length}
                                </p>
                                </div>
                                <div className="productInfoItem">
                                <h6>
                                    LISTED
                                </h6>
                                <p>
                                    {allNftData.filter((item) => {
                                        return saleNFT.includes(item[0]);
                                    }).length}
                                </p>
                                </div>
                                <div className="productInfoItem">
                                <h6>
                                    TOTAL SUPPLY
                                    <span>
                                    <img src="/assets/images/zk/info-circle.svg" alt="" />
                                    </span>
                                </h6>
                                <p>
                                    {totalSupply}
                                </p>
                                </div>                            
                            </div>
                            <div className="productInfo__inner-details-social">
                                <div className="productInfoSocials">
                                <a href="https://discord.gg/YUBcETkpAT" className="button--social" target='_blank'>
                                    <span>
                                        <img src="/assets/images/zk/discord.svg" alt="" />
                                    </span>
                                </a>
                                <a href="https://twitter.com/zkzerosea" className="button--social" target='_blank'>
                                    <span>
                                        <img src="/assets/images/zk/twitter.svg" alt="" />
                                    </span>
                                </a>
                                <a href="#" className="button--social" target='_blank'>
                                    <span>
                                        <img src="/assets/images/zk/globus.svg" alt="" />
                                    </span>
                                </a>
                                <a href="#" className="productInfoSocials__button">
                                    <span>
                                    <img src="/assets/images/zk/telescope.svg" alt="" />
                                    </span>
                                    <p>
                                    Watch
                                    </p>
                                </a>
                                <a href="#" className="button--social">
                                    <svg>
                                    <span>more</span>
                                    </svg>
                                </a>
                                </div>
                                <h6>
                                {colData && colData[5]}
                                </h6>
                                <h6>
                                <span>
                                    <img src="/assets/images/zk/crown.svg" alt="" />
                                </span>
                                <p>
                                    Royalties enforced.
                                </p>
                                </h6>
                            </div>                                                        
                        </div>
                        <div className="productInfo__inner-details-items">
                            <button onClick={() => {navigate("/mint/" + colData[0]);}} className="button--primary" style={{borderRadius:8, width:"100%", marginTop:5}}>Create a new NFT</button>                            
                        </div>   
                        {(currentAccount == DevWallet) &&
                            <div className="productInfo__inner-details-items">
                                <button onClick={() => {deleteCollection(colId);}} className="button--primary" style={{borderRadius:8, width:"100%", marginTop:5}}>Delete Collection</button>                            
                            </div> 
                        }                     
                    </div>
                    </div>
                </div>
                </section>
                <section className="controls">
                <div className="autoContainer">
                    <div className="controls__inner">
                    <div className="controls__inner-tabs">
                        <span className="controls__inner-tabs-button active">
                        Items
                        </span>
                        <span className="controls__inner-tabs-button">
                        Activity
                        </span>
                        <span className="controls__inner-tabs-button">
                        Analytics
                        </span>
                        <span className="controls__inner-tabs-button">
                        Announcements
                        </span>
                    </div>
                    <div className="controls__inner-tools">
                        <div className="controls__inner-tools-search">
                        <span className="button--tool">
                            <img src="/assets/images/zk/filter.svg" alt="" />
                        </span>
                        <span className="button--tool">
                            <img src="/assets/images/zk/refresh.svg" alt="" />                           
                        </span>
                        <div className="input input--search">
                            <input type="text" placeholder="Search items"/>
                            <span>
                                <img src="/assets/images/zk/search.svg" alt="" />
                            </span>
                        </div>
                        </div>
                        <div className="controls__inner-tools-filter">
                        <div className="dropdown bg">
                            <div className="dropdown__button ">
                            Price: Low to High
                            <span className="arrow">
                                <img src="/assets/images/zk/arrow-down.svg" alt="" />
                            </span>
                            </div>
                            <div className="dropdown__content">
                            <div className="dropdown__content-item">
                                <div className="input--radio">
                                <input type="radio" value="price-1" name="dropdown-1" checked onChange={(e)=>{}}/>
                                <label className="tick" >
                                    <span className="checkbox__text">
                                    <img src="/assets/images/zk/tick-circle.svg" alt="" />
                                    </span>
                                    <p>
                                    Price: Low to High
                                    </p>
                                </label>
                                </div>
                                <div className="input--radio">
                                <input type="radio" value="price-2" name="dropdown-1" />
                                <label className="tick" >
                                    <span className="checkbox__text">
                                    <img src="/assets/images/zk/tick-circle.svg" alt="" />
                                    </span>
                                    <p>
                                    Price: Low to High
                                    </p>
                                </label>
                                </div>
                                <div className="input--radio">
                                <input type="radio" value="price-3" name="dropdown-1" />
                                <label className="tick" >
                                    <span className="checkbox__text">
                                    <img src="/assets/images/zk/tick-circle.svg" alt="" />
                                    </span>
                                    <p>
                                    Price: Low to High
                                    </p>
                                </label>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="dropdown bg">
                            <div className="dropdown__button">
                            Price: Low to High
                            <span className="arrow">
                                <img src="/assets/images/zk/arrow-down.svg" alt="" />
                            </span>
                            </div>
                            <div className="dropdown__content">
                            <div className="dropdown__content-item">
                                <div className="input--radio">
                                <input type="radio" value="price-4" name="dropdown-2" checked onChange={() => {}}/>
                                <label className="tick" >
                                    <span className="checkbox__text">
                                    <img src="/assets/images/zk/tick-circle.svg" alt="" />
                                    </span>
                                    <p>
                                    Price: Low to High
                                    </p>
                                </label>
                                </div>
                                <div className="input--radio">
                                <input type="radio" value="price-5" name="dropdown-2" />
                                <label className="tick" >
                                    <span className="checkbox__text">
                                    <img src="/assets/images/zk/tick-circle.svg" alt="" />
                                    </span>
                                    <p>
                                    Price: Low to High
                                    </p>
                                </label>
                                </div>
                                <div className="input--radio">
                                <input type="radio" value="price-6" name="dropdown-2" />
                                <label className="tick" >
                                    <span className="checkbox__text">
                                    <img src="/assets/images/zk/tick-circle.svg" alt="" />
                                    </span>
                                    <p>
                                    Price: Low to High
                                    </p>
                                </label>
                                </div>

                            </div>
                            </div>
                        </div>
                        <span className="button--tool filter active">
                            <img src="/assets/images/zk/filterIcon1.svg" alt="" />
                        </span>
                        
                        <span className="button--tool filter active">
                            <img src="/assets/images/zk/filterIcon2.svg" alt="" />
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                </section>
                <section className="grid">
                <div className="autoContainer">
                    <NftItems colId={colId} web3Api={web3Api} searchWord={searchWord} chainId={chainId}></NftItems>
                </div>
                </section>            
            <Footer />
        </div>
    );
}

export default CollectionDetails;
