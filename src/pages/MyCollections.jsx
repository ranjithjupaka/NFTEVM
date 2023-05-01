import React , { useState , useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import {NFTAddr, DevWallet, IPFS_BASE_URL, VIDEO_TYPE, IMAGE_TYPE, AUDIO_TYPE} from '../config/constants'
import { getCanonicalPath } from '../utils/utils';

const MyCollections = () => {
    const [chainId, setChainId] = useState();
    const [currentAccount, setCurrentAccount] = useState(null);
    const setAccount = (_account) => {
        setCurrentAccount(_account);
    }

    const [web3Api, setWeb3Api] = useState(null);
    const [allColData, setAllColData] = useState([]);
    const [curTab, setCurTab] = useState("col"); 
    const [show, setShow] = useState(false); 
    const [nftContract, setNftContract] = useState(); 
    const [colcnt, setColcnt] = useState(-1); 

    const navigate = useNavigate();
    
    useEffect(async () => {
        if (chainId && web3Api && currentAccount) {
            const nftContratFile = await fetch("/abis/ZkSeaNFT.json");
            const convertNftContratFileToJson = await nftContratFile.json();
            const nFTAbi = convertNftContratFileToJson;
    
            let nftContract = new web3Api.eth.Contract(nFTAbi, NFTAddr[chainId]);
            setNftContract(nftContract);
        }        
    }, [chainId, web3Api, currentAccount])

    useEffect(async () => {
        if (nftContract) {
            getMyCollections();
        }
    }, [nftContract])

    const getMyCollections = async () => {
        if (web3Api) {
            nftContract.methods.totalcollectiondetails().call({ from: currentAccount })
            .then((result) => {     
                if (result?.length == 0) setColcnt(0);                                   
                for (let i = 0; i < result?.length; i++) {
                    getCollectionDetails(result[i]);
                }
            })
            .catch((err) => {
                console.log('ererr', err)
            })
        }
    }

    const getCollectionDetails = async (id) => {
        if (web3Api) {
            nftContract.methods.collectiondetails(id).call()
            .then((_details) => {
                if (_details[1] === '0x0000000000000000000000000000000000000000') {

                } else {
                    makeAllColList(_details)
                }
            }).catch()
        }
    }

    const makeAllColList = (data) => {
        setColcnt(1);
        setAllColData((old) => [
            ...old, data
        ])
    }

    return (
        <div className='nfts'>
            <Header setAccount={setAccount} setWeb3Api={setWeb3Api} setChainId={setChainId} />
            <section className="first-section controls">
                <div className="autoContainer">
                    <div className="controls__inner filter">
                    <div className="controls__inner-filter">
                        <div className="controls__inner-filter-body">
                        <button className={`button--primary ${curTab === "col" ? 'active' : ''}`} onClick={() => {setCurTab("col");}}>
                            Collection
                        </button>
                        <button className={`ml-3 button--primary ${curTab === "nft" ? 'active' : ''}`} onClick={() => {setCurTab("nft"); navigate("/my-nfts");}}>
                            NFTs
                        </button>
                        </div>
                        <button className="button--secondary">
                        View All
                        </button>
                    </div>
                    </div>
                </div>
            </section>
            <section className="grid nft">
                <div className="autoContainer">
                    <div className="grid__inner">
                        { 
                            allColData.length > 0 ? allColData.map((item, idx) => {
                                return(
                                    <div className="cartNft" key={idx}>
                                        <Link to={`/collection/${item[0]}`}>
                                            <div className="cartNft__image">
                                                <img src={getCanonicalPath(IPFS_BASE_URL + item[6])} alt=""/>
                                            </div>
                                            <div className="cartNft__info">
                                                <p>{item[2]}</p>
                                                <span><img src="/assets/images/zk/verify.svg" alt=""/></span>
                                            </div>
                                        </Link>                                        
                                    </div>
                                )
                            })
                            :
                            colcnt == -1 ?  <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center"}}><span style={{color:"grey", fontSize: 32}}>Loading ... </span></div> 
                            :
                            colcnt > 0 ? <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center"}}><span style={{color:"grey", fontSize: 32}}>Loading ... </span></div> 
                            :
                            <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center"}}><span style={{color:"grey", fontSize: 32}}>No Items</span></div> 
                            
                        }
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default MyCollections;
