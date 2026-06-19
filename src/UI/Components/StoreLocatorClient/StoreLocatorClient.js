'use client'

import React, { useEffect, useRef } from 'react'
import './StoreLocator.css'
import { useState } from 'react';
import directionArrow from '../../../Assets/icons/direction-arrow.png'
import storeImage from '../../../Assets/all-stores-location-images/store-image.png'
import { FaStar } from "react-icons/fa";
import { GoogleMap, useLoadScript, LoadScript, Marker } from '@react-google-maps/api';
import directionIcon from '../../../Assets/icons/direction-icon.png';
import closeBtn from '../../../Assets/icons/cancel.png';
import blueTick from '../../../Assets/icons/blue-tick.png'
import axios from 'axios';
import DeliveryLocationMap from './DeliveryLocationMap';
import StoreLocationMap from './StoreLocationMap';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { SlLocationPin } from "react-icons/sl";
import { getGoogleStoreDetails, useDisableBodyScroll } from '../../../utils/api';
import RatingReview from '../../Components/starRating/starRating';
import { url } from '../../../utils/api';
import { MdOutlineDirections } from "react-icons/md";
import UserComment from './userComment';
import { FaPhone } from "react-icons/fa6";
import { IoIosMailOpen, IoIosClose } from "react-icons/io";
import loader from "../../../Assets/Loader-animations/loader-check-two.gif"
// import { useLocation } from 'react-router-dom';
import SectionLoader from '../../Components/Loader/SectionLoader';
import Image from 'next/image';
import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';
// import MapComp from '../MapComp/MapComp';

import dynamic from "next/dynamic";
import StoreLocatorFAQ from '../FAQ/StoreLocatorFAQs';

const MapComp = dynamic(() => import("../MapComp/MapComp"), { ssr: false });

const StoreLocatorClient = () => {
  const API_KEY = `AIzaSyBhUqdMX-GUuJUlMuEj7oggAkLuDkVdjbU&amp;libraries=maps,marker,places,geometry`
  const [storesApiData, setStoresApiData] = useState()
  const [isFetching, setFetching] = useState(false)
  //   const location = useLocation()
  //   const showStore = location.state || {}
  const showStore = {}

  const commentData = [
    {
      useName: 'Nana Adwoa Serwah',
      profile: '/Assets/all-stores-location-images/store-image.png',
      comment: `Owner was Amazing. He had the time to talk with us concerning the couch we bought. We even got a deal. Come here for sure for my next furniture shopping.`,
    }
  ]
  // const [googleReviewDetails, setGoogleReviewDetails] = useState(null);
  const [selectedLatitude, setSelectedLatitude] = useState(null);
  const [selectedLongitude, setSelectedLongitude] = useState(null);
  const [showLocationDetails, setShowLocationDetails] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [selectedStore, setSelectedStore] = useState([]);
  const [zipCode, setZipCode] = useState('');
  const [selectedStoreData, setSelectedStoreData] = useState([])


  const [showModal, setShowModal] = useState(null)

  useEffect(() => {
    setShowModal(Object.keys(showStore).length > 0
      ? storesApiData?.findIndex(
        (store) => store.store_id === showStore.store_id
      )
      : null)

    handleLocationDetails(showStore, showModal)
  }, [])

  const handleLocationDetails = async (item, index) => {
    setShowModal((prevIndex) => prevIndex === index ? null : index)
    setSelectedLatitude(null)
    setSelectedLongitude(null)
    // setGoogleReviewDetails(null)
    setCurrentIndex((prevIndex) => prevIndex === index ? null : index);
    setShowLocationDetails(item);
    // setSelectedStore(item)
    // setGoogleReviewDetails(await getGoogleStoreDetails(item.placeId))
  }


  const [sliderIndex, setSliderIndex] = useState(0);

  const images = [
    '/Assets/all-stores-location-images/store-image.png', // Replace with storeImage dynamically if needed
    '/Assets/all-stores-location-images/store-image.png', // Duplicate or add more images for demonstration
    '/Assets/all-stores-location-images/store-image.png',
  ];

  const handleDotClick = (index) => {
    setSliderIndex(index);
  };


  // mobile view script
  const [storeSelected, setStoreSelected] = useState('store-list');
  const [showBottomModal, setShowBottomModal] = useState(false);
  const [altitude, setAltitude] = useState({
    longitude: 0,
    latitude: 0
  })

  const handleShowTab = (type, lat, long) => {
    setStoreSelected(type);
    if (type === 'store-list') {
      setSelectedStoreData([])
      setSelectedLatitude(null)
      setSelectedLongitude(null)
    }
    altitude.latitude = lat
    altitude.longitude = long
  }
  const handleCloseBottomModal = () => {
    setShowBottomModal(false)
    setSteperValue('images')
  }

  const fetchStoresData = async (using, zip, lat, lng) => {
    const api = `${url}/api/v1/stores/get`;
    const zipApi = `${url}/api/v1/stores/get-distant?zipcode=${zip}`;
    const locApi = `${url}/api/v1/stores/get-distant?latitude=${lat}&longitude=${lng}`;

    try {
      setFetching(true)
      let response;
      // Determine which API to use based on the 'using' parameter
      if (using === 'zipcode' && zip) {
        response = await axios.get(zipApi); // Use zipApi when 'zipcode' is passed and zip is provided
      } else if (using === 'latlng' && lat && lng) {
        response = await axios.get(locApi); // Use locApi when 'latlng' is passed and lat/lng are provided
      } else {
        response = await axios.get(api); // Use api for all other cases
      }

      const stores = response.data.data;
      setStoresApiData(stores); // Store the data in your state
      setFetching(false)
    } catch (error) {
      console.error("Error fetching stores data", error);
      setFetching(false)
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchStoresData("latlng", null, latitude, longitude)
          setFetching(false)
        },
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }


  useEffect(() => {
    fetchStoresData("all");
  }, [])

  const libraries = ["places"];

  // Load Google Maps API

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY, // Replace with your actual API key
    libraries: libraries
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  const handleInputChange = (e) => {
    setZipCode(e.target.value);
  };

  const fetchStoreUsingZipCode = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (zipCode) {
      await fetchStoresData("zipcode", zipCode, null, null)
    } else {
      alert('Please enter a valid zip code');
    }
  };


  const handleStoreData = (item) => {
    setSelectedStoreData([item])

    setSelectedLatitude(item.latitude)
    setSelectedLongitude(item.longitude)
    setStoreSelected('map');
  }

  const handleOnlyModalOpen = (item) => {
    setShowBottomModal(true)
    setSelectedStoreData([item])
  }

  const [steperValue, setSteperValue] = useState('images')


  const handleSteperValue = (value) => {
    setSteperValue(value);
  }


  // Open Streat Map

  // useEffect(() => {
  //   const handler = (e) => {
  //     setSelectedStore(e.detail);
  //   };

  //   window.addEventListener("selectStore", handler);
  //   return () => window.removeEventListener("selectStore", handler);
  // }, []);


  useDisableBodyScroll(showBottomModal)



  return (
    <>
    <div className='store-locator-main-container'>

      <img className='store-locator-banner' src='/storenearme.jpeg' />


      <h1 className='store-locator-main-heading'>Find Furniture or Mattress Store Near You</h1>

      {/* Desktop view */}
      <div className='all-stores-side-section-and-map'>
        <div className='all-stores-side-section'>
          {isFetching && <SectionLoader />}


          <div className='all-stores-search-and-location-bar'>
            <div className='all-store-search-bar-container'>
              <form className='all-store-search-bar' onSubmit={fetchStoreUsingZipCode}>
                <input
                  type='text'
                  placeholder='Enter Zip Code'
                  className='all-store-search-input'
                  value={zipCode}
                  onChange={handleInputChange} // Update state on input change
                />
                <button
                  type='submit'
                  className='all-store-search-button'
                >
                  <LiaSearchLocationSolid />
                </button>
              </form>
            </div>
            <div className='all-store-location-button-div'>
              <button className='all-store-location-button' onClick={() => { getCurrentLocation() }}>
                <SlLocationPin />
                Current Location
              </button>
            </div>
          </div>

          <div className='all-stores-cards'>
            {storesApiData && storesApiData?.map((item, index) => (
              <div key={index} className='store-single-card'>
                <div className='single-store-head'>
                  <h3>{item.name}</h3>
                  <p>{item.distance}</p>
                </div>
                <div className='single-card-address-and-contact'>
                  <span className='single-card-address-and-contact-span'>
                    <p className='single-card-span-heading'><svg viewBox="0 0 64 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M59.5177 0C59.733 0.000356785 59.9448 0.0544467 60.1336 0.157315C60.3224 0.260183 60.4823 0.408542 60.5985 0.5888L60.7015 0.7808L63.8976 8.2688C63.9738 8.4474 64.0083 8.6409 63.9983 8.83469C63.9883 9.02848 63.9342 9.21747 63.84 9.38738C63.7458 9.55729 63.614 9.70368 63.4546 9.81546C63.2951 9.92725 63.1122 10.0015 62.9197 10.0326L62.7138 10.048H56.458V47.36C56.4581 47.6596 56.3526 47.9497 56.1598 48.1799C55.967 48.41 55.6991 48.5656 55.4029 48.6195L55.1713 48.64H8.83273C8.53158 48.6401 8.23994 48.5351 8.00859 48.3433C7.77724 48.1515 7.62084 47.8851 7.56664 47.5904L7.54605 47.36L7.53833 10.048H1.28763C1.09252 10.0481 0.899938 10.0041 0.724444 9.91933C0.54895 9.83452 0.395143 9.71111 0.274657 9.55845C0.154171 9.40579 0.0701612 9.22787 0.0289833 9.03815C-0.0121947 8.84843 -0.00946265 8.65188 0.0369727 8.46336L0.101307 8.2688L3.3 0.7808C3.38406 0.583138 3.51673 0.409676 3.68581 0.276368C3.85488 0.14306 4.05494 0.0541859 4.26758 0.01792L4.48375 0H59.5177ZM53.8846 10.048H10.1194V46.0774H17.1215V20.2035C17.1214 19.9039 17.227 19.6138 17.4198 19.3837C17.6126 19.1535 17.8804 18.9979 18.1766 18.944L18.4082 18.9235H45.5958C45.8965 18.924 46.1876 19.0293 46.4184 19.221C46.6492 19.4128 46.8052 19.6789 46.8593 19.9731L46.8825 20.2035L46.8799 46.0774H53.8898V10.048H53.8846ZM30.7115 29.7114H19.6949L19.6923 46.0774H30.7141L30.7115 29.7114ZM44.3014 29.7114H33.2874V46.0774H44.304L44.3014 29.7114ZM30.7141 21.481H19.6923V27.1514H30.7089V21.481H30.7141ZM44.3014 21.481H33.2874V27.1514H44.3014V21.481ZM58.6634 2.56H5.33296L3.23052 7.488H60.7658L58.6634 2.56Z" fill="var(--quaternary-color)" />
                    </svg></p>
                    <p className='single-card-details'>{item.address_1}</p>
                  </span>
                  <span className='single-card-address-and-contact-span'>

                    <p className='single-card-span-heading'><FaPhone /></p>
                    <p className='single-card-details'>{item.phone}</p>
                  </span>
                </div>
                <div className='single-card-view-details-button-div'>
                  <button className='single-card-view-details-button' onClick={() => handleLocationDetails(item, index)}>
                    <MdOutlineRemoveRedEye />
                    View Location
                  </button>
                </div>
              </div>
            ))}

          </div>

          <div className={`single-location-full-details  ${currentIndex !== null ? 'show-single-location-details' : ''}`}>

            <div className='single-location-details-bar-slider'>
              <div className="single-location-slider">
                <SwiperSlider
                  slidesData={showLocationDetails?.images}
                  renderSlide={(img, index) => (

                    <Image
                      src={`${url}${img.image_url}`}
                      alt={`slide ${index + 1}`}
                      width={480}
                      height={190}
                      className='store-locator-mobile-image'
                    />
                  )}
                  showDots={true}
                  showArrows={false}
                  spaceBetween={10}
                  delayTime={5000}
                  autoplay={true}
                  slidesPerView={1}
                  arrowSlide={true}
                  isPadding={false}
                />
              </div>

            </div>


            <div className={`single-location-details-bar-heading-and-direction-button `}>
              <div className='single-store-bar-heading-and-rating'>
                <h3>{showLocationDetails?.name}</h3>
                {/* <RatingReview rating={googleReviewDetails?.data?.rating} disabled={true} size={"20px"} /> */}
              </div>
              <button
                className='single-location-direction-button'
                onClick={() => {setSelectedStore([showLocationDetails]); setCurrentIndex(null)}}
                // onClick={() => {
                //   setSelectedLatitude(showStore?.length > 0 ? showStore?.latitude : showLocationDetails?.latitude);
                //   setSelectedLongitude(showStore?.length > 0 ? showStore?.longitude : showLocationDetails?.longitude);
                // }}
              >
                <MdOutlineDirections />
              </button>
            </div>

            <div className='single-location-address-and-contact-details'>
              <h3>{showLocationDetails?.address_1}</h3>
              <p><FaPhone style={{ marginRight: "5px", marginTop: "2px" }} />  {showLocationDetails?.phone}</p>
              <p><IoIosMailOpen style={{ marginRight: "5px", marginTop: "2px" }} />  {showLocationDetails?.email}</p>

            </div>

            <h3 className='comments-top-heading'>Store Timings</h3>
            <div className="store_timings">
              {showLocationDetails?.timings?.map((item, index) => {
                return (
                  <div className="timing_row" key={index}>
                    <p className="day">{item.day}</p>
                    <p className="time">{item.time}</p>
                  </div>
                );
              })}
            </div>

          </div >


        </div >
        <div className="all-store-map">
          {isLoaded ? (
            <MapComp
              storesData={
                  Object.keys(selectedStore).length === 0
                    ? storesApiData
                    : selectedStore
                }
              selectedLocation={{
                lat: selectedLatitude ? parseFloat(selectedLatitude) : null,
                lng: selectedLongitude ? parseFloat(selectedLongitude) : null,
              }}
            />
          ) : (
            <div className="loading-map-container">
              <div className='loading-map-shimmer'></div>
            </div>
          )}

        </div>
      </div >

      {/* Mobile view */}
      <div className='mobile-view-store-and-map'>
        <div className='mobile-view-list-and-map-toggler-button'>
          <button className={`mobile-view-store-list-button ${storeSelected === 'store-list' ? 'selected-store-list-map-button' : ''}`} onClick={() => handleShowTab('store-list')}>Store List</button>
          <button className={`mobile-view-map-button ${storeSelected === 'map' ? 'selected-store-list-map-button' : ''}`} onClick={() => handleShowTab('map')} >Map</button>
        </div>
        {storeSelected === 'map' ? (
          <div className='mobile-view-single-store-map'>
            {isLoaded ? (

              <MapComp
                storesData={
                  Object.keys(selectedStoreData).length === 0
                    ? storesApiData
                    : selectedStoreData
                }
                selectedLocation={{
                  lat: selectedLatitude ? parseFloat(selectedLatitude) : null,
                  lng: selectedLongitude ? parseFloat(selectedLongitude) : null,
                }}
              />

              // <DeliveryLocationMap
              //   mapWidth={'320px'}
              //   address_info={``}
              //   storesData={
              //     Object.keys(selectedStoreData).length === 0
              //       ? storesApiData
              //       : selectedStoreData
              //   }
              //   selectedLocation={{ lat: selectedLatitude ? parseFloat(selectedLatitude) : null, lng: selectedLongitude ? parseFloat(selectedLongitude) : null }}
              // />
            ) : (
              <div className="loading-map-container">
                <p>Loading map...</p>
              </div>
            )}
          </div>
        ) : (
          <div className='mobile-view-stores-list'>
            {storesApiData && storesApiData.map((item, index) => (
              <div
                key={index}
                className='mobile-view-single-store-card'

              >
                <div className='mobille-view-single-store-content-container' onClick={() => handleOnlyModalOpen(item)}>
                  <div className='mobile-view-single-store-image-div'>
                    <img src={`${url}${item?.images?.[0]?.image_url}`} alt='store profile' className='mobile-view-single-store-image' />
                  </div>
                  <div className='mobile-view-single-store-details'>
                    <p>{item.address_1}</p>
                    <p>{item.phone}</p>
                    <p>{item.timings[0].time}</p>
                    <div className='mobile-view-single-card-days'>
                      {item.timings?.map((day, dayIndex) => (
                        <p key={dayIndex}>{day.day},</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='mobile-view-single-store-modal-show-container' onClick={() => handleStoreData(item)}>
                  <button className='mobile-view-show-map-and-location'>View On Map</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile view Bottom Modal */}
      <div className={`mobile-view-bottom-modal ${showBottomModal ? 'show-bottom-modal' : ''}`} onClick={handleCloseBottomModal}>
        <div className={`mobile-view-bottom-modal-inner-container ${showBottomModal ? 'drag-store-detail-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className='mobile-view-store-locator-modal-stepper-container'>
            <button className={`mobile-view-store-images ${steperValue === 'images' ? 'active-store-images-steper' : ''}`} onClick={() => handleSteperValue('images')}>
              Images
            </button>
            <button className={`mobile-view-store-details ${steperValue === 'details' ? 'active-store-details-steper' : ''}`} onClick={() => handleSteperValue('details')}>
              Details
            </button>
          </div>
          <div className='mobile-view-bottom-modal-inner-scrollable-container'>

            <div className='mobile-view-bottom-modal-header'>
              <div className='mobile-view-bottom-modal-top-header-line'>
                <hr className='horizontal-line' />
              </div>
              <button className='mobile-view-bottom-modal-close-button' onClick={handleCloseBottomModal}>
                <Image src={'/icons/close-charcoal.svg'} width={15} height={15} alt='close btn' />
                {/* <IoIosClose size={25} color='#595959' /> */}
              </button>
            </div>

            {steperValue === 'images' ? (
              <div className="single-location-slider">

                <div className='mobile-view-bottom-modal-delivery-options'>
                  <h3 className='mobile-heading-comments-top-heading'>{selectedStoreData[0]?.name}</h3>
                  <span>
                    {/* <Image src={'/Assets/icons/blue-tick.png'} width={12} height={12} alt='blue-tick' /> */}
                    <FaPhone size={15} color='#595959' />
                    {selectedStoreData[0]?.phone}
                  </span>
                  <span>
                    {/* <Image src={'/Assets/icons/blue-tick.png'} width={12} height={12} alt='blue-tick' /> */}
                    <IoIosMailOpen size={15} color='#595959' />
                    {selectedStoreData[0]?.email}
                  </span>
                </div>

                <SwiperSlider
                  slidesData={selectedStoreData[0]?.images}
                  renderSlide={(img, index) => (

                    <Image
                      src={`${url}${img.image_url}`}
                      alt={`slide ${index + 1}`}
                      width={480}
                      height={190}
                      className='store-locator-mobile-image'
                    />
                  )}
                  showDots={true}
                  showArrows={false}
                  spaceBetween={15}
                  delayTime={5000}
                  autoplay={true}
                  slidesPerView={2}
                  arrowSlide={true}
                  isPadding={false}
                />

              </div>
            ) : (
              <div className='mobile-view-single-store-details'>
                <div className='mobile-view-bottom-modal-delivery-options'>
                  <h3 className='mobile-heading-comments-top-heading'>{selectedStoreData[0]?.name}</h3>
                  <span>
                    {/* <Image src={'/Assets/icons/blue-tick.png'} width={12} height={12} alt='blue-tick' /> */}
                    <FaPhone size={15} color='#595959' />
                    {selectedStoreData[0]?.phone}
                  </span>
                  <span>
                    {/* <Image src={'/Assets/icons/blue-tick.png'} width={12} height={12} alt='blue-tick' /> */}
                    <IoIosMailOpen size={15} color='#595959' />
                    {selectedStoreData[0]?.email}
                  </span>
                </div>

                <h3 className='mobile-heading-comments-top-heading'>Store Timings</h3>
                {selectedStoreData[0]?.timings.map((item) => (
                  <span className='mobile-bottom-modal-single-store-timing-contianer'>
                    <p>{item.day}</p>
                    <p>{item.time}</p>
                  </span>
                ))}

              </div>
            )}




          </div>
        </div>
      </div>


      


    </div >
    <StoreLocatorFAQ/>
    </>
  )
}

export default StoreLocatorClient
