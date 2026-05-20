import React from 'react'
import './SectionLoader.css';
import loaderAnimation from '../../../Assets/Loader-animations/loader-check-two.gif';

const SectionLoader = () => {
    return (
        <div className="section-loader-overlay">
            <img src={'/Assets/Loader-animations/loader-check-two.gif'} alt='animation' />
            <p>Please Wait</p>
        </div>
    )
}

export default SectionLoader