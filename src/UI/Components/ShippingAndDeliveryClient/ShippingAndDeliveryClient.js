'use client'

import React, { useEffect, useState } from 'react'
import './ShippingAndDelivery.css';
import storeIcon from '../../../Assets/icons/store-icon.png';
import { url } from '../../../utils/api';
import StatickShimmer from '@/Global-Components/StaticPagesShimmer/StaticShimmer';

const ShippingAndDeliveryClient = () => {

    const [shippingAndDelivery, setShippingAndDelivery] = useState()
    const [loadData, setLoadData] = useState(true);
    const fetchShippingAndDeliveryPolicy = async () => {
      const api = `/api/v1/pages/shipping-delivery/get`;
      try {
        const response = await fetch(`${url}${api}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'Application/json'
          }
        });
        const result = await response.json();
        setShippingAndDelivery(result.shippingDelivery.content)
      } catch (error) {
        setLoadData(false);
        console.error("UnExpected Server Error", error);
      } finally {setLoadData(false)}
    }


    useEffect(() => {fetchShippingAndDeliveryPolicy()})

  return (
    <div className='shipping-and-delivery-main-container'>
      {loadData ? (
        <StatickShimmer />
      ) : (
        <div className='shipping-content' dangerouslySetInnerHTML={{ __html: shippingAndDelivery }} ></div>
      )}
    </div>
  )
}

export default ShippingAndDeliveryClient
