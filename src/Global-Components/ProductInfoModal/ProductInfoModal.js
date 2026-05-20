import React from 'react'
import './ProductInfoModal.css'
import Link from 'next/link';
import { IoIosClose } from "react-icons/io";
import Image from 'next/image';
import { getAdjustedPrice } from '@/utils/api';

const ProductInfoModal = ({openModal, closeModal, salePrice, regPrice}) => {
  return (
    <div className={`info-modal-main-container ${openModal ? 'show-info-modal' : ''}`} onClick={(e) => {e.stopPropagation(); closeModal()}}>
      <div className='info-modal-inner-container' onClick={(e) => e.stopPropagation()}>
        <div className='info-modal-inner-sub-container'>
          <button className='info-modal-close-button' onClick={closeModal}>
            {/* <IoIosClose size={25} color='#595959' className='info-modal-close-button' onClick={closeModal}/> */}
            <Image src={'/icons/close-charcoal.svg'} width={15} height={15} alt='close' />

          </button>
          <div className='info-modal-head'>
            <h3>Enjoy Time To Pay</h3>
          </div>

          <div className='info-modal-center-body-container'>
            <h3>12 Months With Equal Payments of ${getAdjustedPrice(
              Number(salePrice && salePrice !== "" ? salePrice : regPrice)
            )}/mo.</h3>
            <h3>Based on Regular Price of ${salePrice && salePrice !== "" ? salePrice : regPrice}</h3>
          </div>

          <div className='info-modal-eligibility-check-container'>
            <button
              onClick={() => window.open('https://apply.acima.com/lease/select-location?app_id=lo&merchant_guid=merc-3bd04932-d6a0-4848-8a30-af0a9d935f25&utm_campaign=merchant&utm_source=web&lang=en', '_blank')}
            >
              Check Eligibility
            </button>

            <a target='_blank' href={'https://apply.acima.com/lease/select-location?app_id=lo&merchant_guid=merc-3bd04932-d6a0-4848-8a30-af0a9d935f25&utm_campaign=merchant&utm_source=web&lang=en'}>View  Pricing & Terms</a>
          </div>
    
          {/* <div className='info-modal-center-body-container'>
            <h3>48 months 0% APR with Equal Payments of $41/mo.</h3>
            <h3>Based on reg. price of $1,949.95</h3>
          </div> */}

          {/* <div className='info-modal-eligibility-check-container'>
            <button>Check Eligibility</button>
            <Link href={'#'}>View  Pricing & Terms</Link>
            <p>
              <strong>0% APR for 48 Months with Equal Payments:</strong>
               Outlet product excluded, and may not be combined with all advertised offers. Minimum purchase $1,200.00. 
               0% APR from date of eligible purchase until paid in full. Monthly payment is the purchase amount divided by the number 
               of months in the offer. Last payment may vary due to rounding. On-time payments will pay off the promotional balance. 
               Advertised monthly payment, if any, excludes taxes, delivery, or other charges. Other transactions and charges affect 
               total monthly payment amount. Prior purchases excluded. Account must be in good standing. Limited time offer. Standard 
               account terms apply to purchases that do not qualify. New accounts: standard Purchase APR 29.99%. Minimum interest charge $1. 
               Existing accounts, see your Cardholder Agreement for applicable terms. Subject to credit approval. Raymour and Flanigan 
               financing account issued by TD Bank, N.A.
            </p>

          </div> */}

        </div>
      </div>
    </div>
  )
}

export default ProductInfoModal