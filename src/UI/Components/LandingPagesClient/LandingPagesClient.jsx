'use client'

import React, { useEffect, useState } from 'react'
import './LandingPagesClient.css'
import { url } from '@/utils/api'
import StatickShimmer from '@/Global-Components/StaticPagesShimmer/StaticShimmer'

const LandingPagesClient = ({ slug }) => {
    const [pageData, setPageData] = useState(null)
    const [loadData, setLoadData] = useState(true)

    const getLandingPageContent = async () => {
        try {
            const response = await fetch(
                `${url}/api/v1/landing-pages/get-landing-page-full/${slug}`
            )

            const result = await response.json()

            if (result.success) {
                setPageData(result.data)
            }
        } catch (error) {
            console.error("Unexpected Server Error", error)
        } finally {
            setLoadData(false)
        }
    }

    useEffect(() => {
        if (slug) {
            getLandingPageContent()
        }
    }, [slug])

    if (loadData) {
        return <StatickShimmer />
    }

    if (!pageData) {
        return (
            <div className="policy-container">
                <h1>Page Not Found</h1>
            </div>
        )
    }

    return (
        <div className='privacy-policy-main-container-2'>
            <div className='policy-container'>
                <div
                    dangerouslySetInnerHTML={{
                        __html: pageData.content
                    }}
                />
            </div>
        </div>
    )
}

export default LandingPagesClient