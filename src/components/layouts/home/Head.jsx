import React from 'react';
import imgsample from '../../../assets/images/home/lc_1.png'

const Head = () => {
    const subtitle = 'NFT MARKETPLACE'
    const title = 'Hodlers Kingdom'
    const description = 'A decentralized island in the Birdez metaverse to build, to learn and to play where everyone is welcome. '
    
    return (
        <section className="flat-title-page inner">
            <div className="overlay"></div>
            <div className="themesflat-container">
                <div className="d-flex">
                    <div className="content">
                        {/* <h4 className="mg-bt-11"><span className="fill">{subtitle}</span></h4> */}
                        <b className="heading mg-t-20 fs-52">{title}<sup><small  className='fs-16'>TM</small></sup>                                                                                     
                        </b>	
                        <p className="sub-heading mg-t-10 mg-bt-39 fs-20">{description}
                        </p>
                        <div className="flat-bt-slider style2 flex mg-t-20">
                            <a href="/nft" className="sc-button fl-button pri-1 "><span> <i class="fab fa-discord"></i> Join Our Discord
                            </span></a>
                        </div>
                    </div>      
                    <div className='img home-head-img'>
                        <img src={imgsample} alt=""/>
                    </div>     
                </div>
            </div>                           
        </section>
    );
}

export default Head;
