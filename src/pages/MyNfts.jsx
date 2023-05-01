import React , { useState , useEffect } from 'react';
import fromExponential from 'from-exponential';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import {NFTAddr, IPFS_BASE_URL, VIDEO_TYPE, IMAGE_TYPE, AUDIO_TYPE} from '../config/constants'
import { Link, useNavigate } from 'react-router-dom';
import { getCanonicalPath, getGasPrice } from '../utils/utils';

const MyNFTs = () => {
    const [chainId, setChainId] = useState();
    const [currentAccount, setCurrentAccount] = useState(null);    
    const setAccount = (_account) => {
        setCurrentAccount(_account);
    }

    const [web3Api, setWeb3Api] = useState(null);
    const [curTab, setCurTab] = useState("nft"); 
    const [show, setShow] = useState(false); 
    const [nftContract, setNftContract] = useState(); 

    const [arr, setArr] = useState([]);
    const [price, setprice] = useState([]);
    const [pricearr, setpricearr] = useState();
    const [allFixedSale, setAllFixedSale] = useState([]);
    const [allp, setallp] = useState([]);
    const [tokenid, settokenid] = useState();
    const [allprice, setallprice] = useState();
    const [colllist, setcolllist] = useState();
    const [alldata, setalldata] = useState([]);
    const [newlist, setnewlist] = useState([]);
    const [nftcnt, setNftcnt] = useState(-1);

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
            saleNft(0);
            totalcolection();
        }
    }, [nftContract])

    const saleNft = async (id) => {
        if (web3Api) {
            await nftContract.methods.balanceOf(currentAccount).call({ from: currentAccount })
            .then((bal) => {
                setNftcnt(bal);
                if (parseInt(bal) > 0) {
                    getMyNfts(bal);                    
                }                
            })
            .catch();
        }
    }

    const getMyNfts = async (_balance) => {
        if (web3Api) {
            for (let i = 0; i < parseInt(_balance); i++) {
                let nftId = await nftContract.methods.tokenOfOwnerByIndex(currentAccount, i).call({ from: currentAccount });
                if (nftId) {
                    nftInfo(nftId);
                }
            }
        }
    }

    const nftInfo = async (id) => {
        if (web3Api) {
            nftContract.methods.nftinformation(id).call({ from: currentAccount })
            .then((result) => {
                saveFixedSaleList({ ...result, 12: JSON.parse(result[5])[1] });
                localStorage.setItem(`buylist${id}`, JSON.stringify(result));
                setArr(id);
                saleNftPrie(result[0]);
            }).catch()
        }
    }

    const saveFixedSaleList = (data) => {
        setAllFixedSale((old) => [
            ...old, data
        ])
    }

    const saleNftPrie = async (id) => {
        if (web3Api) {
            nftContract.methods.listofsalenft(id).call({ from: currentAccount })
            .then((length) => {
                const val = {
                    id: id, value: length[3]
                }
                localStorage.setItem(`normasale${id}`, (length[3]))
                setpricearr(id)
                getallprice(val)
            })
            .catch()
        }
    }

    const getallprice = (data) => {
        if (data.id === "0") {

        } else {
            setallp((old) => [
                ...old, data
            ])
            setallprice(allp)
        }
    }

    useEffect(() => {
        newlist.map((val, i) => {
            const pist = localStorage.getItem(`normalsale${val}`)
            setprice((old) => {
                return [...old, pist]
            })
        })
    }, [arr, pricearr]);

    const buyNft = (collectionid, tokenid) => {
        buyFixedNft(collectionid, tokenid);
    }

    const buyFixedNft = async (collectionid, tokenid) => {

        let amount = Number((allp.find(p => p.id === tokenid ? allp : null)).value)
        let ckamout = amount / 1000000000000000000
        if (web3Api && ckamout) {
            const accounts = await web3Api.eth.getAccounts();
            setShow(true)
            settokenid(accounts)

            const gasPriceNumber = await getGasPrice();

            let amountIn = web3Api.utils.toBN(fromExponential((ckamout) * Math.pow(10, 18)));
            let address = '0x0000000000000000000000000000000000000000'
            nftContract.methods.buynft(collectionid, tokenid, address).send({ from: currentAccount, value: amountIn, gasPrice: gasPriceNumber })
                .then((recipt) => {
                    setShow(false)
                    // history.push('/mycollection')
                })
                .catch((err) => {
                    setShow(false)
                    settokenid('')
                })
        }
    }
    
    const totalcolection = async () => {
        if (web3Api) {
            nftContract.methods.collectionform().call({ from: currentAccount })
                .then((result) => {
                    setcolllist(result)
                })
                .catch()
        }
    }

    useEffect(() => {
        for (let i = 1; i <= colllist; i++) {
            collectiondetails(i);
        }
    }, [colllist]);

    const collectiondetails = async (id) => {
        if (web3Api) {
            nftContract.methods.collectiondetails(id).call({ from: currentAccount })
                .then((fees) => {
                    getalllist(fees)
                }).catch()
        }
    }

    const getalllist = (data) => {
        setalldata((old) => [
            ...old, data
        ])
    }
    const handleClick = (Id) => {
        // const col = alldata?.find(p => p[0] === Id);
        localStorage.setItem('a', Id)
    }
    
    return (
        <div className='nfts'>
            <Header setAccount={setAccount} setWeb3Api={setWeb3Api} setChainId={setChainId}/>
            <section className="first-section controls">
                <div className="autoContainer">
                    <div className="controls__inner filter">
                    <div className="controls__inner-filter">
                        <div className="controls__inner-filter-body">
                        <button className={`button--primary ${curTab === "col" ? 'active' : ''}`} onClick={() => {setCurTab("col"); navigate("/my-collections");}}>
                            Collection
                        </button>
                        <button className={`ml-3 button--primary ${curTab === "nft" ? 'active' : ''}`} onClick={() => {setCurTab("nft")}}>
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
                        {   allFixedSale.length > 0 ? allFixedSale.map((item, idx) => {
                                return(
                                    <div className="cartNft" key={idx}>
                                        <Link to={`/nft/${item[0]}`}>
                                            <div className="cartNft__image">
                                                {VIDEO_TYPE.includes(JSON.parse(item[5])[1]) ?
                                                    <video alt="" muted autoPlay loop>
                                                        <source src={getCanonicalPath(IPFS_BASE_URL + item[6])} />
                                                    </video> 
                                                    : IMAGE_TYPE.includes(JSON.parse(item[5])[1]) ?
                                                    <img src={getCanonicalPath(IPFS_BASE_URL + item[6])} alt=""/>
                                                    : AUDIO_TYPE.includes(JSON.parse(item[5])[1]) ?
                                                    <audio style={{ width: '90%' }} src={getCanonicalPath(IPFS_BASE_URL + item[6])} />
                                                    : null
                                                }
                                            </div>
                                            <div className="cartNft__info">
                                                <p>{item[1]}</p>
                                                <span><img src="/assets/images/zk/verify.svg" alt=""/></span>
                                            </div>
                                        </Link>                                        
                                    </div>
                                )
                            })
                            :
                            nftcnt == -1 ?  <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center"}}><span style={{color:"grey", fontSize: 32}}>Loading ... </span></div> 
                            :
                            nftcnt > 0 ? <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center"}}><span style={{color:"grey", fontSize: 32}}>Loading ... </span></div> 
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

export default MyNFTs;
