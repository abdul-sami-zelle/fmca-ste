'use client'

import React, { useEffect, useState } from 'react'
import './PrivacyPolicyClient.css'
import { url } from '@/utils/api'
import StatickShimmer from '@/Global-Components/StaticPagesShimmer/StaticShimmer'

const PrivacyPolicyClient = () => {
  const [privacyPolicyData, setPrivacyPolicyData] = useState()
  const [loadData, setLoadData] = useState(true);
    const getPrivacyPolicyContent = async () => {
        const api = `/api/v1/pages/privacy-policy/get`
        try {
            const response = await fetch(`${url}${api}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }// Data to send
            });
            const result = await response.json();
            setPrivacyPolicyData(result?.privacyPolicy?.content)
        } catch (error) {
            setLoadData(false);
            console.error("UnExpected Server Error", error);
        } finally {
            setLoadData(false);
        }
    }


    useEffect(() => {
        getPrivacyPolicyContent();
    }, [])

    return (
        <div className='privacy-policy-main-container'>
            {loadData ? (
                <StatickShimmer />
            ) : (
                <div className='policy-container'>
                    <div dangerouslySetInnerHTML={{ __html: privacyPolicyData }} ></div>
                </div>
            ) }
        </div>
    )
}

export default PrivacyPolicyClient