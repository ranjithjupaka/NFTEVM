import React , { useState , useEffect } from 'react';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { NFTAddr, IPFS_BASE_URL, VIDEO_TYPE, IMAGE_TYPE, AUDIO_TYPE} from '../config/constants'
import { Link , useNavigate} from 'react-router-dom';
import { getCanonicalPath } from '../utils/utils';

const NFTs = () => {
    const [currentAccount, setCurrentAccount] = useState(null);   
    const [chainId, setChainId] = useState(); 
    const setAccount = (_account) => {
        setCurrentAccount(_account);
    }

    const [web3Api, setWeb3Api] = useState(null);
    const [curTab, setCurTab] = useState("nft"); 
    const [nftContract, setNftContract] = useState(); 

    const [saleList, setSaleList] = useState([]);
    const [aucList, setAucList] = useState([]);
    const [arr, setArr] = useState([]);
    const [price, setprice] = useState([]);
    const [pricearr, setpricearr] = useState();
    const [allFixedSale, setAllFixedSale] = useState([]);
    const [allp, setallp] = useState([]);
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
            totalcolection();
            getTotalNftCount();
        }
    }, [nftContract])

    // const saleNft = async (id) => {
    //     if (web3Api) {
    //         nftContract.methods.listofsalenft(id).call({ from: currentAccount })
    //             .then((result) => {
    //                 setSaleList(result[0]);
    //                 setAucList(result[1]);
    //                 var listlen = result[0]?.length
    //                 for (let i = 0; i < listlen; i++) {
    //                     const ll = result[0][i];
    //                     if (ll == "0") continue;
    //                     getNftInfo(ll);
    //                 }
    //             })
    //             .catch()
    //     }
    // }

    // const getNftInfo = async (id) => {
    //     // console.log(id)
    //     if (web3Api) {
    //         await nftContract.methods.nftinformation(id).call({ from: currentAccount })
    //         .then((result) => {
    //             saveAllFixedSaleList({ ...result, 12: JSON.parse(result[5])[1] })
    //             localStorage.setItem(`buylist${id}`, JSON.stringify(result))
    //             setArr(id)
    //             getListOfSaleNft(result[0])
    //         }).catch()
    //     }
    // }

    // const saveAllFixedSaleList = (data) => {
    //     setAllFixedSale((old) => [
    //         ...old, data
    //     ])
    // }    

    // const getListOfSaleNft = async (id) => {
    //     if (web3Api) {
    //         nftContract.methods.listofsalenft(id).call({ from: currentAccount })
    //         .then((result) => {
    //             const val = {
    //                 id: id, value: result[3]
    //             }
    //             localStorage.setItem(`normasale${id}`, (result[3]))
    //             setpricearr(id)
    //             getallprice(val)
    //         })
    //         .catch()
    //     }
    // }

    // const getallprice = (data) => {
    //     if (data.id === "0") {

    //     } else {
    //         setallp((old) => [
    //             ...old, data
    //         ])
    //         setallprice(allp)
    //     }
    // }

    // useEffect(() => {
    //     newlist.map((val, i) => {
    //         const pist = localStorage.getItem(`normalsale${val}`)
    //         setprice((old) => {
    //             return [...old, pist]
    //         })
    //     })
    // }, [arr, pricearr]);

    // const buyNft = (collectionid, tokenid) => {
    //     buyfixednft(collectionid, tokenid);
    // }

    // const buyfixednft = async (collectionid, tokenid) => {

    //     let amount = Number((allp.find(p => p.id === tokenid ? allp : null)).value)
    //     let ckamout = amount / 1000000000000000000
    //     // console.log(collectionid, tokenid, ckamout) 

    //     if (web3Api && ckamout) {
    //         const accounts = await web3Api.eth.getAccounts();
    //         setShow(true)
    //         settokenid(accounts)

    //         let amountIn = web3Api.utils.toBN(fromExponential((ckamout) * Math.pow(10, 18)));
    //         let address = '0x0000000000000000000000000000000000000000'
    //         const gasPriceNumber = await getGasPriceZk();

    //         nftContract.methods.buynft(collectionid, tokenid, address).send({ from: currentAccount, value: amountIn , gasPrice: gasPriceNumber})
    //             .then((recipt) => {
    //                 setShow(false)
    //                 // history.push('/mycollection')
    //             })
    //             .catch((err) => {
    //                 setShow(false)
    //                 settokenid('')
    //             })
    //     }
    // }

    const getTotalNftCount = async () => {
        if (web3Api) {
            const totalNftCnt = await nftContract.methods.tokenidmint().call();
            setNftcnt(Number(totalNftCnt));
        }
    }
    
    const totalcolection = async () => {
        if (web3Api) {
            nftContract.methods.collectionform().call({ from: currentAccount })
            .then((length) => {
                setcolllist(length)
            })
            .catch()
        }
    }

    useEffect(() => {
        for (let i = 1; i <= colllist; i++) {
            // collectiondetails(i);
            getAllNFTsByCol(i);
        }
    }, [colllist]);

    // const collectiondetails = async (id) => {
    //     if (web3Api) {
    //         nftContract.methods.collectiondetails(id).call({ from: currentAccount })
    //             .then((fees) => {
    //                 getalllist(fees)
    //             }).catch()
    //     }
    // }

    // const getalllist = (data) => {
    //     setalldata((old) => [
    //         ...old, data
    //     ])
    // }

    const getAllNFTsByCol = async (id) => {
        if (web3Api) {
            nftContract.methods.totalnft(id).call()
            .then((nftcount) => {
                for (let i = 0; i < nftcount; i++) {
                    // collectiondetails(i);
                    getAllNFTs(id, i);
                }
            }).catch()
        }
    }

    const getAllNFTs = async (id, index) => {
        if (web3Api) {
            nftContract.methods.collectionstored(id, index).call({ from: currentAccount })
                .then((nftId) => {
                    getNftInfo(nftId);
                }).catch()
        }
    }

    const getNftInfo = async (id) => {
        // console.log(id)
        if (web3Api) {
            await nftContract.methods.nftinformation(id).call({ from: currentAccount })
            .then((result) => {
                saveAllFixedSaleList({ ...result, 12: JSON.parse(result[5])[1] })
            }).catch()
        }
    }

    const saveAllFixedSaleList = (data) => {
        setAllFixedSale((old) => [
            ...old, data
        ])
    }
    
    return (
        <div className='nfts'>
            <Header setAccount={setAccount} setWeb3Api={setWeb3Api} setChainId={setChainId}/>
            <section className="first-section controls">
                <div className="autoContainer">
                    <div className="controls__inner filter">
                    <div className="controls__inner-filter">
                        <div className="controls__inner-filter-body">
                        <button className={`button--primary ${curTab === "col" ? 'active' : ''}`} onClick={() => {setCurTab("col"); navigate("/collections");}}>
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
                        {  allFixedSale.length > 0 ? allFixedSale.map((item, idx) => {
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

export default NFTs;
