import React , {useState} from 'react';
import img1 from '../../../assets/images/home/land_11.png'
import img2 from '../../../assets/images/home/land_12.png'
import img3 from '../../../assets/images/home/land_13.png'

const HowItWorks = () => {

    return (
        <section className="tf-activity s1 tf-section">
            
            <div className="themesflat-container">
                
                <div className="row">                    
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="home-media-activity style1">
                            <div className="content">
                                <img src={img1} alt="" className='home-media-content'/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                        <h2 className="mb-25">How The Lands Work</h2>
                        <div id="side-bar">
                            <span className='fs-20 line-height-18'>
                            When you own a plot of land, you are able to explore from the top the entire map and see which plot is near you. You can make an offer to the owner or directly buy it if is on sale and after you own that too, you are able to connect 2 plots together exdpanding your ownership and power. 
                            </span>  
                        </div>
                    </div>
                </div>
                <div className="row mg-t-36">                                
                    <div className="col-lg-6 col-md-6 col-12">
                        <h2 className="mb-25">Geographical Privilege Pass </h2>
                        <div>
                            <span className='fs-20 line-height-18'>
                            The entire Hodler Kingdom is divided in 5 main areas. 
                            North west. North East. The Center. South West and South est. 
                            Based on where your polts are, each area gives you a Privilege Pass that grants you free access to the island of games near you. 
                            In order to get access to in sland far away from your area, you have three possibilities: Buy a land in that area with $SEED token or $ETH. Pay the access ticket of that area with $SEED token. Pay the rent to a land owner in that area with $SEED token. 
                            </span>  
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="home-media-activity style1">
                            <div className="content">
                                <img src={img2} alt="" className='home-media-content'/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mg-t-36">
                    <div className="col-lg-6 col-md-6 col-12">
                        <div className="home-media-activity style1">
                            <div className="content">
                                <img src={img3} alt="" className='home-media-content'/>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                        <h2 className="mb-25">Play to Earn </h2>
                        <div>
                            <span className='fs-20 line-height-18'>
                                Description here !
                            </span>  
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;
