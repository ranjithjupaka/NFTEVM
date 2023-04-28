import React from 'react';
import img0 from '../../../assets/images/home/lc_none.png'
import img1 from '../../../assets/images/home/lc_1.png'
import img2 from '../../../assets/images/home/lc_2.png'
import img3 from '../../../assets/images/home/lc_3.png'

import promo from '../../../assets/images/home/promo.png'
import left from '../../../assets/images/home/left-5.png'

const Land = () => {
    const landdata = [
        {
            img: img0,
            title: "???? Land",
            plot: "bsc",
            price: "0.1",
            priceChange: "$12.246",
            total: "3800",
            avail: "3000",
            // feature: "coming soon",
            type:'s'
        },
        {
            img: img0,
            title: "???? Land",
            plot: "bsc",
            price: "0.3",
            priceChange: "$12.246",
            total: "1900",
            avail: "1500",
            // feature: "coming soon",
            type:'m'
        },
        {
            img: img0,
            title: "???? Land",
            plot: "bsc",
            price: "0.9",
            priceChange: "$12.246",
            total: "633",
            avail: "500",
            // feature: "coming soon",
            type:'l'
        }
    ]
    
    return (
        <section className="tf-section">                
            <div className="themesflat-container">
                <div className='mg-t29 mg-bt-24'>
                    <b className='fs-36'>Plots of Land</b>
                </div>
                <div className="row">                        
                    {landdata.map(data =>(
                        <div className="fl-item col-xl-4 col-lg-4 col-md-6 col-sm-6">
                        <div className={`sc-card-product style2 mg-bt ${data.feature ? 'comingsoon' : '' } `}>                    
                            <div className="card-media">
                                <img src={data.img} alt="Axies" />
                                <div className="coming-soon">{data.feature}</div>
                            </div>
                            <div className="card-title">
                                <span className='fs-24 text-center'>{data.title}</span>
                                {/* <h5>{data.price} ETH</h5> */}
                            </div>
                            <div className="meta-info">
                                <span className="fs-16 text-center">
                                To Mint : {data.avail} / {data.total}
                                </span>
                            </div>                           
                        </div> 
                        </div>
                    ))}
                </div>
            </div>  
            <div className="themesflat-container">
                <div className='row flex justify-content-center mg-bt-32 mg-t-29'>
                    <span className='fs-28 '>
                        <span className='under'>Important</span> : 1333 lands of a total supply of 6333 are not for mint. 
                  
                    <br />
                    <span className='fs-52 flex justify-content-center mg-t-20'>
                        WHY!
                    </span>                    
                    </span>
                    <span className='fs-28 mg-t-36 line-height-11' style={{maxWidth:'80%'}}>We decided to lock and reserve 1333 Lands for Genesis Birdez Hodlers who will have the privilege to claim 1 land per each Genesis owned for FREE + Gas, at the end of the launch. </span>
                    
                </div>
                <div className="row mg-t-42">                        
                    <div className="col-lg-4 col-md-4 col-12 ">
                        <div className=" flex justify-content-center">
                            <div className="content">
                                <img src={promo} alt="" className='home-media-content'/>
                            </div>
                        </div>
                        <div className='flex justify-content-center'>
                            <span className='fs-20 mg-t-20'>
                            1 Genesis Birdez hold in your wallet
                            </span>
                        </div>                        
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 flex align-items-center">
                        <div className="content">
                            <img src={left} alt=""/>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 ">
                        <div className=" flex justify-content-center">
                            <div className="content">
                                <img src={img1} alt=""/>
                            </div>
                        </div>
                        <div className='flex justify-content-center'>
                            <span className='fs-20 mg-t-20'>
                            1 Land to Claim for free randomly assigned
                            </span>
                        </div>                        
                    </div>
                </div>
                <div className="row mg-t-42">                        
                    <div className="col-lg-4 col-md-4 col-12 ">
                        <div className=" flex justify-content-center">
                            <div className="content">
                                <img src={promo} alt="" className='home-media-content'/>
                            </div>
                        </div>
                        <div className='flex justify-content-center'>
                            <span className='fs-20 mg-t-20'>
                            2 Genesis Birdez hold in your wallet
                            </span>
                        </div>                        
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 flex align-items-center">
                        <div className="content">
                            <img src={left} alt=""/>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 ">
                        <div className=" flex justify-content-center">
                            <div className="content">
                                <img src={img1} alt=""/>
                            </div>
                        </div>
                        <div className='flex justify-content-center'>
                            <span className='fs-20 mg-t-20'>
                            2 Land to Claim for free randomly assigned
                            </span>
                        </div>                        
                    </div>
                </div>
                <div className='row flex justify-content-center mg-bt-32 mg-t-40'>
                    <span className='fs-28'>Reward our hodlers is one of our main principles in Birdez Gang! </span>
                </div>                
            </div>              
        </section>
    );
}

export default Land;
