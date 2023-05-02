import React , { useState, useEffect } from 'react';
import { create } from 'ipfs-http-client'
import { useNavigate } from 'react-router-dom';

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

const CreateCollection = () => {
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
        collectionName: "", displayName: "", websiteUrl: "", collectionDescription: "", marketFee: "0"
    })
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [dataType, setDataType] = useState();
    const [errStr, setError] = useState(false);
    const [underminting, setUnderminting] = useState(false);
    const [nftContract, setNftContract] = useState();
    const [errText, setErrText] = useState("");

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

    const selectImage = (e) => {
        setErrText("");
        if (e.target.files[0]?.type === "image/jpeg" || e.target.files[0]?.type === "image/png" || e.target.files[0]?.type === "image/gif" || e.target.files[0]?.type === "image/svg" || e.target.files[0]?.type === "image/jpg") {
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

    const submit = async (_event) => {

        _event.preventDefault();
        // back if under minting
        if(underminting) return;
        
        if (web3Api) {
            setErrText("");
            setUnderminting(true);
            try {
                const uploadResult = await ipfsClient.add(buffer);
                createCollection(uploadResult.path)
            } catch (error) {
                console.log('error - IPFS', error);
                setErrText("Error from IPFS")
                setUnderminting(false)
            }
            
        } else {
            setErrText("Connect to wallet")
            setUnderminting(false)
        }
    }

    const checkDuplicatedImage = async (_imgPath) => {        
        return await nftContract.methods.stopduplicate(_imgPath).call();
    }

    const createCollection = async (_imgPath) => {
        if (web3Api) {

            const duplicatedImage = await checkDuplicatedImage(_imgPath);
            if (duplicatedImage == true) {
                setUnderminting(false);
                setErrText("Collection image already used.");
                return false;
            }  

            setUnderminting(true);
            const gasPriceNumber = await getGasPrice();

            nftContract.methods.createcollection(data.collectionName, data.displayName, data.websiteUrl, data.collectionDescription, _imgPath, parseInt(data.marketFee)).send({ from: currentAccount, gasPrice: gasPriceNumber })
            .then((result) => {                
                console.log(result);
                setErrText("");
                setUnderminting(false);
                navigate("/my-collections");
            }).catch((err) => {
                setErrText("");
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
                                {displayImage ? <img src={displayImage} alt="" /> : <img src="/assets/images/default_img.png" style={{ width: '100%', borderRadius:8 }} />}
                            </div>
                        </div>
                        <div className="creatCollection__inner-form" onSubmit={submit} style={{paddingBottom: 60}}>
                            <div className="creatCollection__form-buttons">
                                <button className="button--primary">Create Collection</button>
                                <button className="button--border">
                                    <span> Collection Details </span>
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
                            <div className="creatCollection__form-inputs">
                                <input type="text" placeholder="Collection Name" onChange={(e) => setData({ ...data, collectionName: e.target.value })}/>
                                <textarea placeholder="Description" onChange={(e) => setData({ ...data, collectionDescription: e.target.value })}></textarea>
                                <div className="creatCollection__form-inputs-body">
                                    <input type="text" placeholder="Display Name" onChange={(e) => setData({ ...data, displayName: e.target.value })}/>
                                    <input type="text" placeholder="Website" onChange={(e) => setData({ ...data, websiteUrl: e.target.value })}/>
                                </div>
                            </div>
                            <button onClick={(e) => {submit(e);}} className="button--primary">Create Collection {underminting && <i className='fas fa-spinner fa-pulse fa-1x ml-3'></i>}</button>
                            <p style={{color:"red", position:"absolute", bottom:10}}>{errText}</p>
                        </div>
                    </div>                    
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default CreateCollection;
