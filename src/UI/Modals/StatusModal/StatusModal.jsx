import React from 'react'
import './StatusModal.css'
import { IoIosClose } from "react-icons/io";

const StatusModal = ({showModal, setShowModal, statusIcon, textColor, message, status}) => {

    const handleCloseModal = () => {
        setShowModal(false)
    }
  return (
    <div className={`staus-modal-main-container ${showModal ? 'show-status-modal' : ''}`} onClick={handleCloseModal}>
        <div className={`status-modal-content-container ${showModal ? 'slide-content-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
            <button className='close-status-modal' onClick={handleCloseModal}>
                <IoIosClose size={30} color='#595959' />
            </button>
            
                {statusIcon}
            <span className='status-modal-status-and-message-container'>
                <h3 style={{color: textColor}}>{status}</h3>
                <p>{message}</p>
            </span>

            <button className='status-ok-modal' onClick={handleCloseModal} style={{backgroundColor: textColor}}>OK</button>
            
        </div>

    </div>
  )
}

export default StatusModal