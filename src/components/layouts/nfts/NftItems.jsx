import React , { useState , useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {NFTAddr, DevWallet, IPFS_BASE_URL} from '../../../config/constants'
import { getCanonicalPath } from '../../../utils/utils';

const NFTs = props => {

    const [web3Api, setWeb3Api] = useState(null);
    const [allNftData, setAllNftData] = useState([]);
    const [show, setShow] = useState(false);
    const [nftContract, setNftContract] = useState(); 
    
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
                    getNftDetails(colItemIndex[i], _nftContract)
                }
            }).catch()
        }
    }

    const getNftDetails = async (id, _nftContract) => {
        if (props.web3Api) {
            _nftContract.methods.nftinformation(id).call()
            .then((nftDetail) => {
                makeAllNftData({...nftDetail, 12:JSON.parse(nftDetail[5])[1] })
            }).catch()
        }
    }

    const makeAllNftData = (data) => {
        setAllNftData((old) => [
            ...old, data
        ])
    }    

    return (
        <div className="grid__inner">
            { 
                allNftData.map((item, idx) => {
                    return(
                        <Link to={`/nft/${item[0]}`} className="cartProduct" key={idx}>
                            <div className="cartProduct__image">
                                <img src={getCanonicalPath(IPFS_BASE_URL + item[6])} alt="" />
                            </div>
                            <div className="cartProduct__info">
                            <h6>
                                {item[1]}
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
                                    0.5
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
            }
        </div>
    );
}

export default NFTs;
