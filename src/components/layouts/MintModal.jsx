import React from 'react';
import { Modal } from "react-bootstrap";

const MintModal = (props) => {
    
return (

    <Modal
    show={props.show}
    onHide={props.onHide}
  >
    <Modal.Header closeButton></Modal.Header>

    <div className="modal-body space-y-20 pd-40">
        <div className='img-mint-modal-wrap'>
            <img className='img-mint-modal' src="/assets/images/land_s.png" alt="" />
        </div>
        
        <h3>Mint Small Land</h3>
        <p className="text-center">Select the amount of Small Land you would like to mint.</p>
        
        <p>Enter quantity. <span className="color-popup">5 available</span>
        </p>
        <input type="number" className="form-control" placeholder="1" step='2' />
        <div className="hr"></div>
        {/* <div className="d-flex justify-content-between">
            <p> You must bid at least:</p>
            <p className="text-right price color-popup"> 4.89 ETH </p>
        </div>
        <div className="d-flex justify-content-between">
            <p> Service free:</p>
            <p className="text-right price color-popup"> 0,89 ETH </p>
        </div>
        <div className="d-flex justify-content-between">
            <p> Total bid amount:</p>
            <p className="text-right price color-popup"> 4 ETH </p>
        </div> */}
        <div className="progress">
            <div className="progress-bar"></div>      
        </div>
        
        <button onClick={() =>props.mint('s')} className="btn btn-primary" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close"> Mint  <i className='fas fa-spinner fa-pulse fa-1x'></i> </button>

    </div>
    </Modal>
    
  );
};

export default MintModal;
