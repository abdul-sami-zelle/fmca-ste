'use client'

import React, { useState } from 'react'
import './Careers.css';
// import careersMainBanner from '../../../Assets/Furniture Mecca/Careers/careers-main-banner.png'
import StartWithUs from '../../Components/Carrers-Components/StartWith/StartWithUs';
import Loader from '../../Components/Loader/Loader';


const CareersClient = ({params}) => {
  const [loading, setLoading] = useState(false)
  return (
    <div className='careers-main-page'>
        {loading && <Loader />}
        <div className='careers-main-baneer'>
            <img src={'/Assets/Furniture Mecca/Careers/careers-main-banner.png'} alt='carrer main banner' />
        </div>
        <StartWithUs setLoading={setLoading} />
    </div>
  )
}

export default CareersClient
