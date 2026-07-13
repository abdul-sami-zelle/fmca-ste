import React, { useEffect, useState } from 'react'
import './ProductDimension.css'
import { RxDimensions } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa6";
import { url } from '../../../../utils/api';
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { SiMaterialdesignicons } from "react-icons/si";

import axios from 'axios';
import { useRouter } from 'next/navigation';
// import { AiOutlineZoomOut } from "react-icons/ai";

const ProductDimension = ({ productData, variationData, slideIndex, zoomIn, showDesignRoomModal, handleZoom, handleGalleryModal, showDrm, setZoomIn, dimensionModal }) => {

  const router = useRouter()
  const [customerPhotos, setCustomerPhotos] = useState([]);
  const fetchReviews = async (productUid) => {
    try {
      const response = await axios.get(`${url}/api/v1/reviews/get-by-product/${productUid}`);
      setCustomerPhotos(response?.data?.reviews[0]?.images)

    } catch (error) {
      console.error("UnExpected Server Error", error);
    }
  };

  useEffect(() => { fetchReviews(productData?.uid) }, [])


  // const dimensionCards = [
  //   { icon: <RxDimensions size={25} />, title: 'Dimensions' },
  //   { icon: <SiMaterialdesignicons size={22} />, title: 'Design Your Room' },
  //   ...(customerPhotos?.length > 0 ? [{ icon: <FaRegImage size={25} />, title: 'Customer Photos' }] : []),
  //   { icon: zoomIn ? <AiOutlineZoomOut size={25} /> : <AiOutlineZoomIn size={25} />, title: 'Zoom' },
  // ]

  const dimensionCards = [
     ...(productData?.dimension_image?.image_url  
      ? [ { icon: <RxDimensions size={25} />, title: 'Dimensions' },]
      : []),

   

    ...((productData?.type === "variable" ? variationData?.dyrc?.active === 1 : productData?.dyrc?.active === 1)
      ? [{ icon: <SiMaterialdesignicons size={22} />, title: 'Design Your Room' }]
      : []),

    ...(customerPhotos?.length > 0
      ? [{ icon: <FaRegImage size={25} />, title: 'Customer Photos' }]
      : []),

    {
      icon: zoomIn ? <AiOutlineZoomOut size={25} /> : <AiOutlineZoomIn size={25} />,
      title: 'Zoom',
    },
  ];



  const [dimensionIndex, setDimensionIndex] = useState(null)



  const handleDimensionSelect = (item, index) => {
    setDimensionIndex((prevIndex) => prevIndex === index ? null : index)

    if (item === 'Dimensions') {
      handleGalleryModal('image-clicked', 'dimenssion-show')
    } else if (item === 'Zoom') {
      handleZoom()
    } else if (item === 'Design Your Room') {
      showDrm()
    }
  }

  useEffect(() => {
    // setDimensionIndex((prevIndex) => prevIndex === dimensionIndex ? null : dimensionIndex)
    if (slideIndex === null) {
      setDimensionIndex(null)
    } else if (dimensionModal === false) {
      setDimensionIndex(null)
    } else if (showDesignRoomModal === false) {
      setDimensionIndex(null)
    }
  }, [slideIndex, dimensionModal, showDesignRoomModal])




  return (
    <>
      <div className={`dimension-main-container ${(productData?.type === "variable" ? variationData?.dyrc?.active === 1 : productData?.dyrc?.active === 1) ? 'dimension-3-column-container' : ''}`}>
        {dimensionCards.map((item, index) => (
          <div
            key={index}
            className={`dimension-card ${dimensionIndex === index ? 'active-dimension' : ''}`}
            onClick={() => handleDimensionSelect(item.title, index)}
          >
            {item.icon}
            <p>{item.title}</p>
          </div>
        ))}

        <div className='mobile-viw-dimension-main-contianer'>
          <div className='mobile-view-dimension-row-contianer'>

           {productData?.dimension_image?.image_url && <div className='mobile-view-dimension-main' onClick={() => handleDimensionSelect('Dimensions', null)}>
              <RxDimensions size={20} color='var(--secondary-color)' />
              <p className='dimensions-detail-button-title'>Dimensions</p>
            </div>}



            <div className='mobile-view-dimension-main' onClick={() => handleGalleryModal('image-clicked')}>
              {zoomIn ? <AiOutlineZoomOut size={20} color='var(--secondary-color)' /> : <AiOutlineZoomIn size={20} color='var(--secondary-color)' />}
              <p className='dimensions-detail-button-title'>Zoom</p>
            </div>

          </div>

          {/* <div className='mobile-view-dimension-main' onClick={showDrm}>
            <SiMaterialdesignicons size={20} color='var(--secondary-color)' />
            <p className='dimensions-detail-button-title'>Design Your Room</p>
          </div> */}

        </div>



      </div>
    </>
  )
}

export default ProductDimension
