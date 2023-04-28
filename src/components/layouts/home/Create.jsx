import React from 'react';
import { Link } from 'react-router-dom'
import icon1 from '../../../assets/images/icon/Wallet.png'
import icon2 from '../../../assets/images/icon/Category.png'
import icon3 from '../../../assets/images/icon/Image2.png'
import icon4 from '../../../assets/images/icon/Bookmark.png'
import img1 from '../../../assets/images/home/map.png'

const Create = () => {
    const data = [
        {
            title: "Set Up Your Wallet",
            description: "Once you’ve set up your wallet of choice, connect it to OpenSeaby clicking the NFT Marketplacein the top right corner.",
            icon : icon1,
            colorbg : "icon-color1"
        },
        {
            title: "Select Your Land",
            description: "Click Create and set up your collection. Add social links, a description, profile & banner images, and set a secondary sales fee.",
            icon : icon2,
            colorbg : "icon-color2",
        },
        {
            title: "Mint The Land",
            description: "Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs with properties, stats",
            icon : icon3,
            colorbg : "icon-color3",
        },
        {
            title: "Play The Game",
            description: "Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs!",
            icon : icon4,
            colorbg : "icon-color4",
        },
    ]
    return (
        <>
            <section className="tf-box-icon create tf-section bg-home-3">
                <div className="themesflat-container">
                    <div className="row">
                        {
                            data.map((item , index) => (
                                <CreateItem key={index} item={item} />
                            ))
                        }
                    </div>                 
                </div>           
                        
            </section>
            <section className="tf-box-icon create tf-section bg-home-3">
                <div className="themesflat-container">
                    <div className='row flex justify-content-center mg-bt-32'>
                        <span className='fs-52'>
                        What is Hodlers Kingdom?
                        </span>
                    </div>
                    <div className="row">                        
                        <div className="col-lg-6 col-md-6 col-12">
                            <div className="home-media-activity style1">
                                <div className="content">
                                    <img src={img1} alt="" className='home-media-content'/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12">
                            <div id="side-bar" className="side-bar style-2">
                                <span className='fs-24 line-height-18'>
                                Hodlers KingDom is a free and funny island made up of 6333 different and unique plots of land NFTs, that all together creat a gigantic birdez. Seen from the elicopter you are able to appreciate its shape and its large feathers that form the amazing fronds of this island. 
                                </span>  
                            </div>
                        </div>
                    </div>
                </div>  
            </section>
        </>        
    );
}

const CreateItem = props => (
    <div className='col-lg-3 col-md-6 col-12'>
        <div className="sc-box-icon">
        <div className="image center">
            <div className={`icon-create ${props.item.colorbg}`}>
                <img src={props.item.icon} alt="" />
            </div>                                                                           
            </div>
            <h3 className="heading"><Link to="/wallet-connect">{props.item.title}</Link></h3>
            <p className="content">{props.item.description}</p>
        </div>
    </div>
    
)

export default Create;
