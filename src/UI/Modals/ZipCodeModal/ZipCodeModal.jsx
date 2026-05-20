import React, { useEffect } from 'react'
import './ZipCodeModal.css'
import { FaTruck } from 'react-icons/fa'
import Image from 'next/image'
import { useGlobalContext } from '@/context/GlobalContext/globalContext'
import ZipModal from '../ZipModal/ZipModal'

const ZipCodeModal = ({handleINitialLocationSetModal}) => {
  const {
      zipCode,
      handleInputChange,
      handleButtonClick,
    } = useGlobalContext();


  return (
    <div className='nearby-store-set-location-modal'>
      <div className='nearby-store-set-location-modal-head'>
        <span>
          <FaTruck size={20} color='#595959' />

          Delivery Zip Zode
        </span>

        <button className='nearby-store-set-location-close-button' onClick={handleINitialLocationSetModal}>
          <Image src={'/icons/close-charcoal.svg'} width={15} height={15} alt='img' />
        </button>
      </div>

      <div className='nearby-store-set-location-modal-body'>
        <p>Update your zip code for products availability pricing, and delivery in your area</p>

        <div className='nearby-store-set-location-input-and-submit-button'>
          <label>
            ENTER YOUR ZIP CODE
            <input type='text' value={zipCode} onChange={handleInputChange} />
          </label>
          <button onClick={async () => { await handleButtonClick(); handleINitialLocationSetModal() }}>Update Zip Code</button>
        </div>
      </div>

      {/* <ZipModal
                showMessage={wrongZip}
                errorDetail={wrongZipMessage}
                footerMessage={'Wrong Zip Code'}
                closeModal={handleZipWarningClose}
            /> */}
    </div>
  )
}

export default ZipCodeModal