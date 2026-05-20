import React from 'react'
import './Comparision.css'
import { url } from '../../../utils/api';

const Comparision = ({heading,image,mobileImage}) => {
  
  return (
    <div className='comparision-main-div'>
        <h3>{heading}</h3>
        <div className='comparision-img-div'>
            <img src={url+image.image_url} alt='img'  />
        </div>
        <div className='mobile-view-comparission'>
          <img src={url+mobileImage.image_url} alt='img'  />
        </div>
    </div>
  )
}

export default Comparision
