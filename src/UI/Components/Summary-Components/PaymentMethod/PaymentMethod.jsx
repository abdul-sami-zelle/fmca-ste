import React, { useEffect, useState } from 'react'
import './PaymentMethod.css';
import { useMyOrders } from '../../../../context/orderContext/ordersContext';
// import { Link } from 'react-router-dom';
import PaymentTypes from '../PaymentTypes/PaymentTypes';
import CreditCard from '../CreditCard/CreditCard';
import FinancingAccount from '../FinancingAccount/FinancingAccount';
import Paypal from '../Paypal/Paypal';

const PaymentMethod = ({ handleSubmitOrder }) => {

  const {orderPayload, setOrderPayload } = useMyOrders()
  const handleSelectedLabel = (method) => {
    // setSelectedLabel(method);
    setOrderPayload((prev) => ({
      ...prev,
      payment_method: method
    }));
  };



  // const { addOrder } = useOrder()
  

  // new design scripts
  const [selectedPaymentType, setSelectedPaymentType] = useState('cybersource_credit_card');

  useEffect(() => {
    setOrderPayload((prev) => ({
      ...prev,
      payment_method: selectedPaymentType
    }))
  }, [selectedPaymentType])

  



  return (
    <div className='payment-method-main-container'>

      <div className='payment-types-outer-container'>
        <PaymentTypes
          onSelectLabel={handleSelectedLabel}
          selectedPaymentType={selectedPaymentType}
          setSelectedPaymentType={setSelectedPaymentType}
        />


        <div className='selected-payment-type'>
          {
            selectedPaymentType === 'cybersource_credit_card' ?
              (
                <CreditCard />
              )
              : selectedPaymentType === 'finance-account' ?
                (
                  <FinancingAccount
                    topHeadng={'Look up your financing account.'}
                    askQuestion={'Need To Apply?'}
                    applyText={'Apply Now'}
                  />
                )
                : selectedPaymentType === 'acima-leasing' ?
                  (
                    <FinancingAccount
                      topHeadng={'Look up your lease account.'}
                      askQuestion={'Need To Apply?'}
                      applyText={'Apply Now'}
                    />
                  )
                  : (
                    <Paypal />
                  )
          }
          <div className=''></div>
          <div>
            <div></div>
            <div></div>
          </div>
        </div>


        
      </div>
    </div>
  )
}

export default PaymentMethod
