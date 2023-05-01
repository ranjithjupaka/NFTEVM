import React , { useRef , useState , useEffect } from 'react';
import { Link , useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3"

import menus from "../../pages/menu";
import menuChains from "../../pages/menuChains";
import DarkMode from './DarkMode';
import logoheader from '../../assets/images/logo/logo.svg'
import logoheader2x from '../../assets/images/logo/logo.svg'
import logodark from '../../assets/images/logo/logo.svg'
import logodark2x from '../../assets/images/logo/logo.svg'
import { CHAIN_ARBI_ONE, CHAIN_ARBI_TEST, CHAIN_BSC, CHAIN_BSC_TEST, CHAIN_INFO, CHAIN_ZKMAIN, CHAIN_ZKTEST } from '../../config/constants';

let web3Modal;
let provider;
let selectedAccount;
let chainIdSaved;

// import Web3 from 'web3'
function init() {    
    if (localStorage) {
        chainIdSaved = localStorage.getItem('nftzksea-chainId');
        if (chainIdSaved == undefined || chainIdSaved == "undefined") {
            chainIdSaved = CHAIN_ZKTEST;
        }   
    } else {
        chainIdSaved = CHAIN_ZKTEST;
    }
    
    let rpcOption = {};

    switch (Number(chainIdSaved)) {
        case CHAIN_BSC:
            rpcOption = {
                56:CHAIN_INFO[CHAIN_BSC].rpcUrls[0]
            }
            break;
        case CHAIN_BSC_TEST:
            rpcOption = {
                97:CHAIN_INFO[CHAIN_BSC_TEST].rpcUrls[0]
            }
            break;
        case CHAIN_ZKMAIN:
            rpcOption = {
                324:CHAIN_INFO[CHAIN_ZKMAIN].rpcUrls[0]
            }
            break;
        case CHAIN_ARBI_ONE:
            rpcOption = {
                42161:CHAIN_INFO[CHAIN_ARBI_ONE].rpcUrls[0]
            }
            break;
        case CHAIN_ARBI_TEST:
            rpcOption = {
                421613:CHAIN_INFO[CHAIN_ARBI_TEST].rpcUrls[0]
            }
            break;
    
        default:
            rpcOption = {
                280:CHAIN_INFO[CHAIN_ZKTEST].rpcUrls[0]
            }
            break;
    }

    const providerOptions = {
        walletconnect: {
        package: WalletConnectProvider,
        options: {
            network:'mainnet',
            rpc: rpcOption,
            chainId:chainIdSaved
        }
        },           
    };

    web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
    });
    
    window.w3m = web3Modal;
}

async function fetchAccountData() {
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    selectedAccount = await signer.getAddress();
    console.log(selectedAccount);    
    return selectedAccount;
}

async function refreshAccountData() {
    await fetchAccountData(provider);
    window.location.reload();
}

async function onConnect() {
    console.log("Opening a dialog", web3Modal);
    if (window.ethereum) {
        try {
            provider = await web3Modal.connect({ cacheProvider: true });
        } catch (e) {
            console.log("Could not get a wallet connection", e);
            return;
        }
    
        provider.on("accountsChanged", (accounts) => {
            console.log('accountsChanged',accounts);
            fetchAccountData();
            window.location.reload();
        });
    
        provider.on("chainChanged", (chainId) => {
            fetchAccountData();
            window.location.reload();
        });
    
        provider.on("networkChanged", (networkId) => {
            fetchAccountData();
            // window.location.reload();
        });
        // window.location.reload()
    
        await refreshAccountData();
    } else {
        alert("Please install Crypto Walelt ");
    }
    
}

async function disconnet() {
    console.log("Opening a dialog", web3Modal);
    try {
        // provider = await web3Modal.connect();
        await web3Modal.clearCachedProvider();
        // await window.ethereum.disable()
        window.location.reload()
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }   
}

const Header = (props) => {   

    const [modalShow, setModalShow] = useState(false);
    /*****************************  wallet connection ***************************/
    const [acc,setacc] = useState()
    const [accountid, setaccountid] = useState();
    const [web3, setWeb3] = useState();
    const [activeSubLink, setActiveSubLink] = useState();
    const [chainId, setChainId] = useState();
    
    // iniit web3 provider
    useEffect(async () => {
        if (acc) {
            // const accounts1 = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // setaccountid(accounts1[0])
            provider = await web3Modal.connect();
            let web3_2 = new Web3(provider);
            const accounts = await web3_2.eth.getAccounts();
            setWeb3(web3_2);
            props.setWeb3Api(web3_2);
            setaccountid(accounts[0]);
            props.setAccount(accounts[0]);
            setProviderEvent();
        }

    }, [acc]);

    useEffect(() => {
        init();
        props.setChainId(chainIdSaved);
        setChainId(chainIdSaved);
        getAccount();
        if (web3Modal.cachedProvider) {
            setacc(true)
        }
    }, []); 

    function setProviderEvent() {
        provider.on("accountsChanged", (accounts) => {
            console.log('accountsChanged',accounts)
            fetchAccountData();
            window.location.reload();
        });
    
        provider.on("chainChanged", (chainId) => {
            fetchAccountData();
            window.location.reload();
        });
    
        provider.on("networkChanged", (networkId) => {
            fetchAccountData();
        });
    }

    async function getAccount() {
        // const web3_2 = new Web3(window.ethereum, null, { transactionConfirmationBlocks: 1 })
        if (window.ethereum) {
            // request change chain
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: CHAIN_INFO[chainIdSaved].chainId}],
                });
            } catch (switchError) {
                console.log(switchError);
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        const data = [CHAIN_INFO[chainIdSaved]]

                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: data,
                        });
                    } catch (addError) {
                        
                    }
                }
            }
        } 
    }

    /****************************  wallet connection end *************************/

    const changeChain = (_chainId) => {
        if (_chainId) {
            if (_chainId == chainIdSaved) return;

            localStorage.setItem('nftzksea-chainId', _chainId);
            init();
            props.setChainId(_chainId);
            getAccount();
            // window.location.reload();
        }
        
    }
    /****************************  wallet connection end *************************/
    const { pathname } = useLocation();
    const headerRef = useRef (null)
    useEffect(() => {
        window.addEventListener('scroll', isSticky);
        return () => {
            window.removeEventListener('scroll', isSticky);
        };
    });

    const isSticky = (e) => {
        const header = document.querySelector('.js-header');
        const scrollTop = window.scrollY;
        scrollTop >= 300 ? header.classList.add('is-fixed') : header.classList.remove('is-fixed');
        scrollTop >= 400 ? header.classList.add('is-small') : header.classList.remove('is-small');
    };

    const menuLeft = useRef(null)
    const btnToggle = useRef(null)
    const btnSearch = useRef(null)

    const menuToggle = () => {
        menuLeft.current.classList.toggle('active');
        btnToggle.current.classList.toggle('active');
    }

    const [activeIndex, setActiveIndex] = useState(null);
    const handleOnClick = index => {
        setActiveIndex(index); 
    };
    
    const onHideModal = () => {
        setModalShow(false);
    }

    return (
        <header id="header_main" className="header_1 js-header" ref={headerRef}>
            <div className="themesflat-container">
                <div className="row">
                    <div className="col-md-12">                              
                        <div id="site-header-inner"> 
                            <div className="wrap-box flex">
                                <div id="site-logo" className="clearfix">
                                    <div id="site-logo-inner">
                                        <Link to="/" rel="home" className="main-logo">
                                            <img className='logo-dark'  id="logo_header" style={{height:40}} src={logodark} srcSet={`${logodark2x}`} alt="Sea Pro" />
                                            <img className='logo-light'  id="logo_header" style={{height:40}} src={logoheader} srcSet={`${logoheader2x}`} alt="Sea Pro" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="mobile-button" ref={btnToggle} onClick={menuToggle}><span></span></div>
                                <nav id="main-nav" className="main-nav" ref={menuLeft} >
                                    <ul id="menu-primary-menu" className="menu">
                                        {
                                            menus.map((data,index) => (
                                                <li key={index} onClick={()=> handleOnClick(index)} className={`menu-item ${data.namesub ? 'menu-item-has-children' : '' } ${activeIndex === index ? 'active' : ''} ${data.id ==6 ? 'menu-item-chain' : '' }` } >
                                                    <Link to={data.links}>{data.id == 6 ? chainId && <span style={{color:"#baff00"}}>{CHAIN_INFO[chainId].chainName}</span> : data.name}</Link>
                                                    {
                                                         data.namesub &&
                                                         <ul className="sub-menu" >
                                                            {
                                                                data.namesub.map((submenu) => (
                                                                    <li key={submenu.id} className={
                                                                        chainId && chainId === submenu.chainId
                                                                        ? "menu-item current-item"
                                                                        : "menu-item"
                                                                    }>{data.id == 6 ? <Link to="#" onClick={() => {changeChain(submenu.chainId);}}>{submenu.sub}</Link> : <Link to={submenu.links}>{submenu.sub}</Link>}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    }
                                                    
                                                </li>
                                            ))
                                        }
                                    </ul>                                    
                                </nav>                                
                         
                                <div className="flat-search-btn flex">
                                    {/* <div className="main-nav" >
                                        <ul id="menu-primary-menu" className="menu">
                                            {
                                                menuChains.map((data,index) => (
                                                    <li key={index} onClick={()=> handleOnClick(index)} className={`menu-item ${data.namesub ? 'menu-item-has-children' : '' } ${activeIndex === index ? 'active' : ''} ` }   >
                                                        <Link to={data.links}>{data.name}</Link>
                                                        {
                                                            data.namesub &&
                                                            <ul className="sub-menu" >
                                                                {
                                                                    data.namesub.map((submenu) => (
                                                                        <li key={submenu.id} className={
                                                                            pathname === submenu.links
                                                                            ? "menu-item current-item"
                                                                            : "menu-item"
                                                                        }><Link to="#" onClick={() => {changeChain(submenu.chainId);}}>{submenu.sub}</Link></li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        }
                                                        
                                                    </li>
                                                ))
                                            }
                                        </ul>                                    
                                    </div> */}
                                {
                                    accountid ?
                                    <div>
                                        <a onClick={()=> setModalShow(true)}>
                                            <span className='fs-16 user-data'>
                                                {accountid?.substr(0, 6) + '....' + accountid?.substr(accountid?.length - 4, accountid?.length)}
                                                <img className='avatar-header mg-l-8' src="/assets/images/icon_default.svg" alt="" />
                                            </span>
                                        </a>                                        
                                    </div>
                                    :
                                    <div className="sc-btn-top mg-r-12" id="site-header">
                                        <button onClick={()=> onConnect()} className="button--primary header-slider style style-1 wallet fl-button pri-1">
                                            <span>Wallet Connect</span>
                                        </button>
                                    </div>
                                } 
                                </div>                                
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
            <DarkMode />
            <Modal
                show={modalShow}
                onHide={onHideModal}
            >
                <Modal.Header closeButton></Modal.Header>

                <div className="modal-body space-y-20 pd-40">
                <h2>My Account</h2>
                    <div className="" id="header_admin">
                        
                        <div className="header_avatar">
                            <div className="flex justify-content-between">
                                <span className='fs-16'> {accountid?.substr(0, 6) + '....' + accountid?.substr(accountid?.length - 4, accountid?.length)}</span>
                                <i className="fal fa-copy fs-16"></i>
                            </div>
                            <div className="avatar_popup mt-20">
                                <div className="d-flex align-items-center copy-text justify-content-between">
                                    
                                </div>
                                
                                <div className="hr"></div>
                                <div className='card-bottom flex justify-content-center'>                                    
                                    {/* <button className="mt-10" href="/edit-profile">
                                        <i className="fas fa-pencil-alt"></i> <span> Edit Profile</span>
                                    </button> */}
                                    <button onClick={()=> disconnet()} id="logout" className='mt-10'>
                                        <i className="fal fa-sign-out"></i> <span>{'  '} Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </header>
    );
}

export default Header;
