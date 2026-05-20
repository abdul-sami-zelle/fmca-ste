import React from 'react'
import './ZipModal.css'
import { IoIosClose } from "react-icons/io";

const ZipModal = ({showMessage, errorDetail, title, message, footerMessage, closeModal}) => {
  return (
    <div className={`zip-warning-warning-modal-main-container ${showMessage ? 'zip-warning-show-warining-modal' : ''}`} onClick={closeModal}>
        <div className={`zip-warning-warning-modal-body ${showMessage ? 'zip-warning-show-modal-body' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className='zip-warning-warning-moda-head'>
                <h3>{errorDetail.title}</h3>
                <button onClick={closeModal}>
                    <IoIosClose size={25} color='#595959' />
                </button>
            </div>
            <div className='zip-warning-modal-message-container'>
                <p>{errorDetail.message}</p>
            </div>
            <div className='zip-warning-modal-footer'>
                <p>Need help?  <a href="mailto:meccacustomercare@gmail.com">Contact Support</a></p>
            </div>
        </div>
    </div>
  )
}

export default ZipModal