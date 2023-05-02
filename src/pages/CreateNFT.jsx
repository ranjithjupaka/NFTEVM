import React , { useState, useEffect } from 'react';
import { Link, useParams , useNavigate} from 'react-router-dom';
import {ethers, BigNumber} from "ethers"
import { create } from 'ipfs-http-client'

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import {NFTAddr, DevWallet} from '../config/constants'
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

const CreateNFT = () => {
    
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
        nftName: "", ownerName: "", description: "", price: "0",  numMint: "0"
    })
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [dataType, setDataType] = useState();
    const [errStr, setError] = useState(false);
    const [underminting, setUnderminting] = useState(false);
    const [mintMulti, setMintMulti] = useState(false);
    const [nftContract, setNftContract] = useState();
    const [errText, setErrText] = useState("");

    const navigate = useNavigate();

    let clickedMultiYN = false;

    useEffect(async () => {
        if (chainId && web3Api && currentAccount) {
            const nftContratFile = await fetch("/abis/ZkSeaNFT.json");
            const convertNftContratFileToJson = await nftContratFile.json();
            const nFTAbi = convertNftContratFileToJson;
    
            let nftContract = new web3Api.eth.Contract(nFTAbi, NFTAddr[chainId]);
            setNftContract(nftContract);
        }
        
    }, [chainId, web3Api, currentAccount])

    const selectImage = (e) => {
        setErrText("");
        if (e.target.files[0]?.type === "video/mp4" || e.target.files[0]?.type === "video/webm" || e.target.files[0]?.type === "audio/mpeg" || e.target.files[0]?.type === "image/jpeg" || e.target.files[0]?.type === "image/png" || e.target.files[0]?.type === "image/gif" || e.target.files[0]?.type === "image/svg" || e.target.files[0]?.type === "image/jpg") {
            setDataType(e.target.files[0]?.type)
            setImage(e.target.files[0])
            const file = e.target.files[0];
            const render = new FileReader()
            render.onload = () => {
                if (render.readyState === 2) {
                    setDisplayImage(render.result)
                }
                const reader = new window.FileReader()
                reader.readAsArrayBuffer(file)
                reader.onloadend = () => {
                    const buffer = Buffer.from(reader.result);
                    setBuffer(buffer);
                }
            }
            if (e.target.files[0]) {
                render.readAsDataURL(e.target.files[0]);
            }
        } else {
            alert('Choose the supported file')
        }
    }

    const checkSubmitValidation = () => {

        if (!data.nftName) {
            setErrText('Please input NFT name');
            return false;
        } else {
            setErrText('');
        }

        if (!data.ownerName) {
            setErrText('Please input Owner name');
            return false;
        } else {
            setErrText('');
        }

        if (!data.description) {
            setErrText('Please input NFT description');
            return false;
        } else {
            setErrText('');
        }

        if (!image) {
            setErrText('Please choose NFT image');
            return false;
        } else {
            setErrText('');
        }

        let validPrice = true;    
        let validCopies = true; 

        if (clickedMultiYN) {
            if (data.price && Number(data.price) > 0) {
                validPrice = true;
            } else {
                validPrice = false;
            }

            if (data.numMint && Number(data.numMint) > 0) {
                validCopies = true;
            } else {
                validCopies = false;
            }
        } else {
            setErrText('');
        }

        if (!validPrice) {
            setErrText('Please input NFT price');
            return false;
        }

        if (!validCopies) {
            setErrText('Please input number of NFTs');
            return false;
        }
    }

    const submit = async (_event) => {

        _event.preventDefault();
        // back if under minting
        if(underminting) return;
        
        if(checkSubmitValidation() === false) {
            setShow(false);
            return;
        }

        if (clickedMultiYN) {
            setMintMulti(true);
        } else {
            setMintMulti(false);
        } 

        if (web3Api) {
            setError(false);
            setUnderminting(true);
            try {
                const uploadResult = await ipfsClient.add(buffer);
                if (clickedMultiYN) {
                    setMintMulti(true);
                    mintMultiple(uploadResult.path);
                } else {
                    setMintMulti(false);
                    mintNft(uploadResult.path);
                }                
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

    const checkDuplicatedImage = async (_imgPath) => {        
        return await nftContract.methods.stopduplicate(_imgPath).call();
    }

    const mintNft = async (_imgPath) => {
        
        if (web3Api) {
            const duplicatedImage = await checkDuplicatedImage(_imgPath);
            console.log(duplicatedImage);
            if (duplicatedImage == true) {
                setUnderminting(false);
                setErrText("NFT image already used.");
                return false;
            }
            
            setUnderminting(true);
            const des = JSON.stringify([data.description, dataType])
            const gasPriceNumber = await getGasPrice();

            let mintfee = await nftContract.methods.mintfee().call({ from: currentAccount });
            nftContract.methods.create(colId, currentAccount, _imgPath, data.nftName, data.ownerName, 1, des).send({ from: currentAccount, value: mintfee, gasPrice: gasPriceNumber })
            .then((result) => {
                nftIndex();
            }).catch((err) => {
                setUnderminting(false)
            })
        }
    }

    const nftIndex = async () => {
        if (web3Api) {
            nftContract.methods.tokenidmint().call()
            .then((id) => {
                if(data.price != "0") {
                    fixedSale(id);
                } else {
                    setUnderminting(false);
                    navigate("/nft/" + id);
                }                
            })
            .catch(() => {
                setUnderminting(false);
            })
        }
    }

    const fixedSale = async (tokenid) => {
        if (web3Api) {
            let amount = 0;
            if (data.price)
                amount = ethers.utils.formatUnits(ethers.utils.parseUnits(data.price.toString(), 18), 0);

            const gasPriceNumber = await getGasPrice();
            
            nftContract.methods.fixedsales(tokenid, amount).send({ from: currentAccount, gasPrice: gasPriceNumber })
            .then((length) => {
                if (length.status === true) {
                    setUnderminting(false);
                    navigate("/nft/" + tokenid);
                } else {
                    alert('failed');
                    setUnderminting(false);
                }
            })
            .catch((err) => {
                setUnderminting(false)
            })
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
            
            nftContract.methods.createMulti(colId, currentAccount, nftImage, data.nftName, data.ownerName, copies, des, _times, amount).send({ from: currentAccount, value: mintfeeTotal, gasPrice: gasPriceNumber})
            .then((result) => {
                if (result.status === true) { 
                    // history.goBack();
                    navigate("/my-nfts")
                    setShow(false);
                    setUnderminting(false)
                } else {
                    alert('failed');
                    setUnderminting(false)
                }
            }).catch((err) => {
                setShow(false);
                setUnderminting(false)
            })
        }
    }

    return (
        <div className='nftland'>
            <Header setAccount={setAccount} setWeb3Api={setWeb3Api} setChainId={setChainId}/>
            <section className="main-section creatCollection">
                <div className="autoContainer">
                    <div className="creatCollection__inner">
                        <div className="creatCollection__inner-image">
                            <div className="ratioImage">
                                {displayImage ? <img src={displayImage} alt="" /> : <img src="/assets/images/default_media.png" style={{ width: '100%', borderRadius:8 }} />}
                            </div>
                        </div>
                        <div className="creatCollection__inner-form" >
                            <div className="creatCollection__form-buttons">
                                <button className="button--primary">Create NFT</button>
                                <button className="button--border">
                                    <span> NFT Details </span>
                                </button>
                            </div>
                            <div className="creatCollection__form-file">
                                <h5>File type supported: JPG,JPEG,PNG,GIF</h5>
                                <div className="creatCollection__form-file-input">
                                <input type="file" name="sd" id="" onChange={selectImage}/>
                                <span><img src="/assets/images/zk/document-upload.svg" alt="" /></span>
                                <p>Choose a file</p>
                                </div>
                            </div>
                            <div className="creatCollection__form-inputs" style={{marginBottom:0}}>
                                <div className="creatCollection__form-inputs-body">
                                    <input type="text" placeholder="NFT Name" onChange={(e) => setData({ ...data, nftName: e.target.value })}/>
                                    <input type="text" placeholder="Owner Name" onChange={(e) => setData({ ...data, ownerName: e.target.value })}/>
                                </div>
                                <textarea placeholder="Description" onChange={(e) => setData({ ...data, description: e.target.value })} style={{marginTop:8}}></textarea>
                                <input type="number" placeholder="Leave Price Empty To Auction Your NFT" onChange={(e) => setData({ ...data, price: e.target.value })}/>
                            </div>
                            <button className="button--primary" onClick={(e)=> {clickedMultiYN = false; submit(e);}}>Mint {!mintMulti && underminting && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                            
                            <div className="creatCollection__form-inputs" style={{marginTop:8}}>                                
                                <div className="creatCollection__form-inputs-body">
                                    <input type="text" placeholder="Number of NFTs" onChange={(e) => setData({ ...data, numMint: e.target.value })}/>
                                    <button className="button--primary"  onClick={(e)=> {clickedMultiYN = true; submit(e);}}>Mint(Multiple) {mintMulti && underminting && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                                </div>                                
                            </div>                            
                            <p style={{color:"red", position:"absolute", bottom:20}}>{errText}</p>
                        </div>
                    </div>                    
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default CreateNFT;
