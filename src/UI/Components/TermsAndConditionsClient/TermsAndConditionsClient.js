'use client'

import React, { useEffect, useState } from 'react'
import './TermsAndConditions.css';
import { url } from '../../../utils/api';
import StatickShimmer from '@/Global-Components/StaticPagesShimmer/StaticShimmer';

const TermsAndConditionsClient = () => {

    const [termsConditions, setTermsConditions] = useState()
    const [loadData, setLoadData] = useState(true);
    const handleTermsAndConditions = async () => {
        const api = `/api/v1/pages/terms-conditions/get`
        try {
            const response = await fetch(`${url}${api}`, {
                method: 'GET',
                headers: {
                    'content-Type': 'application/json'
                }
            });
            const result = await response.json();
            setTermsConditions(result.termsConditions.content);
        } catch (error) {
            setLoadData(false)
            console.error("UnExpected Server Error", error);
        } finally { setLoadData(false) }
    }

    useEffect(() => {
        handleTermsAndConditions();
    })
    return (
        <div className='terms-and-conditions-main-container'>
            {loadData ? (
                <StatickShimmer />
            ) : (
                <div className='term-and-condition-detail-container'>
                    <div dangerouslySetInnerHTML={{ __html: termsConditions }} ></div>
                </div>
            )}
        </div>
    )
}

export default TermsAndConditionsClient
