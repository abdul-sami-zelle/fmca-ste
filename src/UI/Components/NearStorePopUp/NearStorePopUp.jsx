'use client'

import React, { useState, useEffect } from 'react'
import './NearStorePopUp.css';
import { IoCloseOutline, IoSearchCircle } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import Link from 'next/link';
import { useGlobalContext } from '../../../context/GlobalContext/globalContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CloseButton from '@/Global-Components/CloseButton/CloseButton';
import MessageModal from '@/UI/Modals/MessageModal/MessageModal';
import ZipModal from '@/UI/Modals/ZipModal/ZipModal';


const NearStorePopUp = ({ isOpen, setIsOpen, handleCloseNearBy }) => {

    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const {
        savedInfo, fetchAllstores, stores,
        zipCode,
        setZipCode,
        handleInputChange,
        handleButtonClick,
        info,
        zipLoading,
    } = useGlobalContext();

    const [storeOpenIndex, setOpenStoreIndex] = useState(-1);
    const handleStoreHoursDetails = (index) => {
        setOpenStoreIndex(storeOpenIndex === index ? -1 : index)
    };



    async function fetchAllStoresUsingDelZip() {
        if (info?.locationData?.zipCode !== undefined || info?.locationData?.zipCode !== "") {
            try {
                // Await the fetchAllstores function to complete
                const stores = await fetchAllstores("code", info?.locationData?.zipCode);

                // Handle the fetched stores data here if needed
            } catch (error) {
                // Handle errors if fetchAllstores fails
                console.error('Error fetching stores:', error);
            }
        } else {
            console.log('Search query is empty');
        }
    }

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            return;
        }

        try {
            // Wait for the position using a Promise wrapper
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            setLocation({ latitude, longitude });

            // Call your async function after getting the location
            await fetchAllstores("latlng", "", latitude, longitude);

            setError(null); // Clear any previous errors
        } catch (err) {
            setError(err.message);
            setLocation(null); // Clear any previous location
        }
    };

    function getDayInPhiladelphia() {
        const options = { weekday: "long", timeZone: "America/New_York" }; // Philadelphia is in the America/New_York timezone
        const formatter = new Intl.DateTimeFormat("en-US", options);
        return formatter.format(new Date()).toLowerCase();
    }

    const [currentDay, setCurrentDay] = useState();
    useEffect(() => {
        setCurrentDay(getDayInPhiladelphia())
    }, [])

    const [currentStoreId, setCurrentStoreId] = useState(stores[0]?._id);
    const fetchData = async () => {
        await handleButtonClick();
    };

    const handleCurrentStore = (item, index) => {
        setCurrentStoreId(item._id)
        setCurrentIndex(index)

        setZipCode(item.postal_code)
    }


    useEffect(() => {

        fetchData();
    }, []);
    // useEffect(() => {

    //     fetchData();
    // }, [zipCode]);

    const handleFindStores = () => {
        router.push(`/store-locator`)
        handleCloseNearBy()
    }



    return (
        <div
            className={`near-store-pop-up ${isOpen ? 'show' : ''}`}
            onClick={handleCloseNearBy}
        >


            <div
                className={`near-store-container ${isOpen ? 'show-near-store-inner-container' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >

                <div className='pop-up-header'>

                    <CloseButton
                        handleClose={handleCloseNearBy}
                        position={'absolute'}
                        top={15}
                        right={15}
                    />
                    <i onClick={handleFindStores}>
                        <svg
                            width="50"
                            height="38"
                            viewBox="0 0 64 49"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className='near-store-svg'
                        >
                            <path d="M59.5177 0C59.733 0.000356785 59.9448 0.0544467 60.1336 0.157315C60.3224 0.260183 60.4823 0.408542 60.5985 0.5888L60.7015 0.7808L63.8976 8.2688C63.9738 8.4474 64.0083 8.6409 63.9983 8.83469C63.9883 9.02848 63.9342 9.21747 63.84 9.38738C63.7458 9.55729 63.614 9.70368 63.4546 9.81546C63.2951 9.92725 63.1122 10.0015 62.9197 10.0326L62.7138 10.048H56.458V47.36C56.4581 47.6596 56.3526 47.9497 56.1598 48.1799C55.967 48.41 55.6991 48.5656 55.4029 48.6195L55.1713 48.64H8.83273C8.53158 48.6401 8.23994 48.5351 8.00859 48.3433C7.77724 48.1515 7.62084 47.8851 7.56664 47.5904L7.54605 47.36L7.53833 10.048H1.28763C1.09252 10.0481 0.899938 10.0041 0.724444 9.91933C0.54895 9.83452 0.395143 9.71111 0.274657 9.55845C0.154171 9.40579 0.0701612 9.22787 0.0289833 9.03815C-0.0121947 8.84843 -0.00946265 8.65188 0.0369727 8.46336L0.101307 8.2688L3.3 0.7808C3.38406 0.583138 3.51673 0.409676 3.68581 0.276368C3.85488 0.14306 4.05494 0.0541859 4.26758 0.01792L4.48375 0H59.5177ZM53.8846 10.048H10.1194V46.0774H17.1215V20.2035C17.1214 19.9039 17.227 19.6138 17.4198 19.3837C17.6126 19.1535 17.8804 18.9979 18.1766 18.944L18.4082 18.9235H45.5958C45.8965 18.924 46.1876 19.0293 46.4184 19.221C46.6492 19.4128 46.8052 19.6789 46.8593 19.9731L46.8825 20.2035L46.8799 46.0774H53.8898V10.048H53.8846ZM30.7115 29.7114H19.6949L19.6923 46.0774H30.7141L30.7115 29.7114ZM44.3014 29.7114H33.2874V46.0774H44.304L44.3014 29.7114ZM30.7141 21.481H19.6923V27.1514H30.7089V21.481H30.7141ZM44.3014 21.481H33.2874V27.1514H44.3014V21.481ZM58.6634 2.56H5.33296L3.23052 7.488H60.7658L58.6634 2.56Z" fill="var(--orange-outline)" />
                        </svg>
                    </i>
                    <h3>Find a Store</h3>
                    <div className='pop-up-header-search'>
                        <input
                            type='search'
                            placeholder='Search by Zip Code or City & State'
                            value={zipCode} // Bind the value to the state
                            onChange={handleInputChange} // Update state on input change
                        />
                        <button className='header-search-button' onClick={() => handleButtonClick()}>
                            {zipLoading ? (
                                <div className='loader_2' style={{background: '#FFF'}}></div>
                            ) : (
                                <IoIosSearch size={22} height={22} color='var(--text-oposite)' />
                            )}
                        </button>
                    </div>
                    <div className='pop-up-header-location'>
                        <button className='current-location-button' onClick={() => { getCurrentLocation() }}>

                            Use Current Location
                        </button>
                        <button className='delivery-zip-button' onClick={() => { fetchAllStoresUsingDelZip() }}>
                            Use My Delivery Zip
                        </button>
                    </div>
                </div>

                <ul className='pop-up-single-city-card'>

                    <li className='pop-up-single-city-cart'>

                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 64 49"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className='near-store-svg'
                        >
                            <path d="M59.5177 0C59.733 0.000356785 59.9448 0.0544467 60.1336 0.157315C60.3224 0.260183 60.4823 0.408542 60.5985 0.5888L60.7015 0.7808L63.8976 8.2688C63.9738 8.4474 64.0083 8.6409 63.9983 8.83469C63.9883 9.02848 63.9342 9.21747 63.84 9.38738C63.7458 9.55729 63.614 9.70368 63.4546 9.81546C63.2951 9.92725 63.1122 10.0015 62.9197 10.0326L62.7138 10.048H56.458V47.36C56.4581 47.6596 56.3526 47.9497 56.1598 48.1799C55.967 48.41 55.6991 48.5656 55.4029 48.6195L55.1713 48.64H8.83273C8.53158 48.6401 8.23994 48.5351 8.00859 48.3433C7.77724 48.1515 7.62084 47.8851 7.56664 47.5904L7.54605 47.36L7.53833 10.048H1.28763C1.09252 10.0481 0.899938 10.0041 0.724444 9.91933C0.54895 9.83452 0.395143 9.71111 0.274657 9.55845C0.154171 9.40579 0.0701612 9.22787 0.0289833 9.03815C-0.0121947 8.84843 -0.00946265 8.65188 0.0369727 8.46336L0.101307 8.2688L3.3 0.7808C3.38406 0.583138 3.51673 0.409676 3.68581 0.276368C3.85488 0.14306 4.05494 0.0541859 4.26758 0.01792L4.48375 0H59.5177ZM53.8846 10.048H10.1194V46.0774H17.1215V20.2035C17.1214 19.9039 17.227 19.6138 17.4198 19.3837C17.6126 19.1535 17.8804 18.9979 18.1766 18.944L18.4082 18.9235H45.5958C45.8965 18.924 46.1876 19.0293 46.4184 19.221C46.6492 19.4128 46.8052 19.6789 46.8593 19.9731L46.8825 20.2035L46.8799 46.0774H53.8898V10.048H53.8846ZM30.7115 29.7114H19.6949L19.6923 46.0774H30.7141L30.7115 29.7114ZM44.3014 29.7114H33.2874V46.0774H44.304L44.3014 29.7114ZM30.7141 21.481H19.6923V27.1514H30.7089V21.481H30.7141ZM44.3014 21.481H33.2874V27.1514H44.3014V21.481ZM58.6634 2.56H5.33296L3.23052 7.488H60.7658L58.6634 2.56Z" fill="var(--orange-outline)" />
                        </svg>

                        <h3>Your Store {stores && stores?.length}</h3>
                    </li>
                    {stores && stores?.map((items, index) => {
                        return <li key={index} className={`${currentStoreId === items._id ? 'near-stores-current-store' : 'other-nearby-stores'} `} onClick={() => handleCurrentStore(items, index)}>
                            <div className={`pop-up-city-and-distance ${storeOpenIndex === index ? 'rotate-btn' : ''}`}>
                                <span>
                                    <button className={`near-store-popup-accordion-icon ${storeOpenIndex === index ? 'rotate-btn' : ''}`} onClick={() => { handleStoreHoursDetails(index) }}> <IoIosAdd size={20} color='#fff"' /> </button>
                                    <h3>{items?.name}</h3>
                                </span>
                                <p> {items?.distance} </p>
                            </div>
                            <div className='pop-up-store-open-time'>
                                <p>{items?.openUntil}</p>
                                <span>
                                    {items?.openUntilIcon}
                                </span>
                            </div>
                            <div className='pop-up-complete-address'>
                                <p>{items?.address_1}</p>
                                <p><span>Call</span> {items?.phone}</p>
                            </div>
                            <div className={`pop-up-store-open-days-and-time ${storeOpenIndex === index ? 'open-store' : ''}`}>
                                <Link href={items?.appointmentLink || '#'}>{items?.appointment}</Link>
                                <div className='store-hours-detail'>
                                    <p className='store-timing'>Store Timings</p>
                                    <ul className='store-hours'>
                                        {items?.timings && items?.timings?.map((hoursItem, index) => {
                                            return <li key={index}>
                                                <p className={currentDay === hoursItem?.day?.toLowerCase() ? 'bold-current-day' : ''}> <span>{hoursItem?.day}</span> <span>{hoursItem?.time}</span> </p>
                                            </li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </li>
                    })}

                </ul>
            </div>
            {/* <ZipModal
                showMessage={wrongZip}
                errorDetail={wrongZipMessage}
                footerMessage={'Wrong Zip Code'}
                closeModal={handleZipWarningClose}
            /> */}
        </div>
    )
}

export default NearStorePopUp