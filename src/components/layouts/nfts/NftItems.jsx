import React , { useState , useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {NFTAddr, DevWallet, IPFS_BASE_URL} from '../../../config/constants'
import { getCanonicalPath } from '../../../utils/utils';

const NFTs = props => {

    const [web3Api, setWeb3Api] = useState(null);
    const [allNftData, setAllNftData] = useState([]);
    const [saleNFT, setSaleNFT] = useState([]);
    const [show, setShow] = useState(false);
    const [nftContract, setNftContract] = useState(); 
    const [nftcnt, setNftcnt] = useState(-1);
    
    useEffect(async () => {
        if(props.chainId, props.web3Api){

            const nftContratFile = await fetch("/abis/ZkSeaNFT.json");
            const convertNftContratFileToJson = await nftContratFile.json();
            const nFTAbi = convertNftContratFileToJson;

            let nftContract = new props.web3Api.eth.Contract(nFTAbi, NFTAddr[props.chainId]);
            setNftContract(nftContract);
            getNftsIndexFromCol(props.colId, nftContract);
        }
    }, [props.chainId, props.web3Api])

    const getNftsIndexFromCol = async (_colId, _nftContract) => {
        if (props.web3Api) {
            _nftContract.methods.collectionnft(_colId).call()
            .then((colItemIndex) => {
                for (let i = 0; i < colItemIndex?.length; i++) {
                    getNftDetails(colItemIndex[i], _nftContract);                    
                }
            }).catch()
        }
    }

    const getNftDetails = async (id, _nftContract) => {
        if (props.web3Api) {
            _nftContract.methods.nftinformation(id).call()
            .then( async (nftDetail) => {               
                const nftPrice = await getPriceFromListSale(id, _nftContract);
                makeAllNftData({...nftDetail, 12:JSON.parse(nftDetail[5])[1], 13: props.web3Api.utils.fromWei(nftPrice, 'ether') });
            }).catch()
        }
    }

    const makeAllNftData = (data) => {
        setNftcnt(1);
        setAllNftData((old) => [
            ...old, data
        ])
    } 
    
    const getPriceFromListSale = async (id, _nftContract) => {
        if (props.web3Api) {
           const result = await _nftContract.methods.listofsalenft(id).call(); 
           return result[3];

        }
    }

    return (
        <div className="grid__inner">
            { 
                allNftData.length > 0 ? allNftData.map((item, idx) => {
                    return(
                        <Link to={`/nft/${item[0]}`} className="cartProduct" key={idx}>
                            <div className="cartProduct__image">
                                <img src={getCanonicalPath(IPFS_BASE_URL + item[6])} alt="" />
                            </div>
                            <div className="cartProduct__info">
                            <h6>
                                <span style={{color:"white"}}>{item[1]}</span>
                                <small>
                                {item[3]}
                                </small>
                            </h6>
                            <div className="cartProduct__info-text">
                                <div className="cartProduct__info-text-icons">
                                <span>
                                    <img src="/assets/images/zk/eth.svg" alt="" />
                                </span>
                                <p>
                                    {item[13]}
                                </p>
                                <span>
                                    <img src="/assets/images/zk/info-circle.svg" alt="" />
                                </span>
                                <span>
                                    <img src="/assets/images/zk/crown.svg" alt="" />
                                </span>
                                </div>
                                <Link className="button--border" to={"/nft/" + item[0]}>
                                    <span>
                                        Details
                                    </span>
                                </Link>
                            </div>
                            </div>
                        </Link>
                        
                    )
                })
                :
                nftcnt == -1 ?  <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", marginTop:50, marginBottom:50}}><span style={{color:"grey", fontSize: 32}}>Loading ... </span></div> 
                :
                nftcnt > 0 ? <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", marginTop:50, marginBottom:50}}><span style={{color:"grey", fontSize: 32}}>Loading ... </span></div> 
                :
                <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", marginTop:50, marginBottom:50}}><span style={{color:"grey", fontSize: 32}}>No Items</span></div> 
            }
        </div>
    );
}

export default NFTs;
