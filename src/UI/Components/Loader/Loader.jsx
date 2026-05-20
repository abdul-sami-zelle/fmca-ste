import React from 'react'
import './Loader.css';
import loaderAnimation from '../../../Assets/Loader-animations/loader-check-two.gif';
import Image from 'next/image';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <Image src={'/Assets/Loader-animations/loader-check-two.gif'} width={1590} height={800} alt='animation' />
      <p>Please Wait</p>
    </div>
  )
}

export default Loader
