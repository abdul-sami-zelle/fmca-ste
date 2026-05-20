import React, { useState } from 'react'
import './BillingAddressModal.css';
import { IoClose } from "react-icons/io5";

const BillingAddressModal = ({ showBilling, handleCloseBillingModal }) => {

  const [billingData, setBillingData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: 'USA',
    street_address: '',
    zipCode: '',
    town: '',
    state: '',
    phone: ''
  })

  return (
    <div className={`billing-modal-main-container ${showBilling ? 'show-billing-modal' : ''}`}>
      <div className='billing-modal-inner-container'>

        <div className='billing-modal-sub-container'>

          <div className='billing-sub-modal-head'>
            <h3>Billing Address</h3>

            <button className='billing-modal-close-button' onClick={handleCloseBillingModal}>
              <IoClose size={25} color='var(--secondary-color)' />
            </button>

          </div>

          <div className='billing-sub-modal-form-body'>
            <div className='user-first-and-last-name'>
              <label>
                
              </label>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default BillingAddressModal
