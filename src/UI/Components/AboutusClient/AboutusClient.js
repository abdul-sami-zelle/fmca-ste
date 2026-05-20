'use client'

import React, { useEffect, useState } from 'react'
import { url } from '../../../utils/api';
import StatickShimmer from '@/Global-Components/StaticPagesShimmer/StaticShimmer';

const AboutUsClient = () => {
    const [aboutusData, setAboutusData] = useState();
    const [loadData, setLoadData] = useState(true);
    const fetchAboutUs = async () => {
        const api = `/api/v1/pages/about-us/get`;
        try {
            const response = await fetch(`${url}${api}`, {
                method: 'GET',
                headers: {
                    "Content-type": 'Application/json'
                }
            });
            const result = await response.json();
            setAboutusData(result.aboutUs.content)

        } catch (error) {
          setLoadData(false)
            console.error("UnExpected Server Error", error);
        } finally {
          setLoadData(false)
        }
    }

    useEffect(() => {fetchAboutUs()})
  return (
    <div 
      className='shipping-and-delivery-main-container'
    >
      {loadData ? (
        <StatickShimmer />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: aboutusData }} ></div>
      )}
    </div>
  )
}

// display: flex;
//     flex-direction: column;
//     width: 100%;
//     gap: 35px;
//     padding: var(--global-padding);

export default AboutUsClient
