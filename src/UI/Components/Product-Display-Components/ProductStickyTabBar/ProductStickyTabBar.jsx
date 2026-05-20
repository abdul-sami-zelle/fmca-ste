import React, { useEffect, useState } from 'react'
import './ProductStickyTabBar.css'
import {  CiLocationOn } from "react-icons/ci";
import { formatedPrice } from '../../../../utils/api';
import LocationPopUp from '../../LocationPopUp/LocationPopUp';
import { useGlobalContext } from '../../../../context/GlobalContext/globalContext';
import { BsTruck } from "react-icons/bs";
import { useIsMobile } from '@/utils/isMobile';

const ProductStickyTabBar = (
    {
        sectionRefs = {},
        isSticky,
        setIsSticky,
        productData,
        addToCart0,
        handleAddToCartProduct,
        variationData,
        isProtectionCheck,
        quantity,
        steperIndex,
        setSteperIndex,
        stockCheck,
        selectedVariationData,
    }) => {


    // const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    const isMobile = useIsMobile()

    const {isDeliveryAllowed, info} = useGlobalContext()



    const tabBarItems = [
        // ...(productData?.dyrc?.active === 1  ? ['DesignYourRoom'] : []),
        ...(productData?.type === 'variable'
            ? selectedVariationData?.dyrc?.active === 1
                ? ['DesignYourRoom']
                : []
            : productData?.dyrc?.active === 1
                ? ['DesignYourRoom']
                : []),
        'Description',
        'Details'
    ];

    const filteredTabItems = isMobile
        ? tabBarItems.filter(item => item !== 'DesignYourRoom')
        : tabBarItems;

    const [activeTab, setIsActiveTab] = useState('DesignYourRoom');
    const [searchLocation, setSearchLocation] = useState(false);

    // const { info } = useGlobalContext();

    useEffect(() => {
        const handleScroll = () => {
            const container = document.querySelector('.product-sticky-tab-bar-main-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                if (rect.top <= 51) {
                    setIsSticky(true);
                } else {
                    setIsSticky(false);
                }
            }

            // Detect Active Tab Based on Scroll
            let currentTab = 'DesignYourRoom';
            tabBarItems.forEach((tab) => {
                const section = sectionRefs[tab]?.current;
                if (section) {
                    const { top } = section.getBoundingClientRect();
                    if (top <= 100) {
                        currentTab = tab;
                    }
                }
            })
            setIsActiveTab(currentTab)

            // ✅ NEW: If "Reviews" tab is reached via scrolling, scroll the tab container to the last position
            const tabContainer = document.querySelector('.product-sticky-fixed-tabs-container');
            if (tabContainer) {
                if (currentTab === 'Reviews') {
                    tabContainer.scrollLeft = tabContainer.scrollWidth; // ✅ Scroll to last tab when reaching "Reviews"
                } else if (currentTab === 'DesignYourRoom') {
                    tabContainer.scrollLeft = 0; // ✅ Scroll back to the first tab when reaching "Description"
                }
            }

        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll)
    }, [sectionRefs]);

    // const handleTabClick = (tab) => {
    //     const section = sectionRefs[tab]?.current;
    //     const stickyBarHeight = document.querySelector('.product-sticky-fixed-tabs-container')?.offsetHeight || 0;
    //     const offset = 0;


    //     if (section) {
    //         const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    //         window.scrollTo({
    //             top: sectionTop - stickyBarHeight - offset, // Scroll with offset
    //             behavior: 'smooth',
    //         });
    //     }

    //     // ✅ NEW: Scroll the tab container to the last position if "Reviews" is clicked
    //     const tabContainer = document.querySelector('.product-sticky-fixed-tabs-container');
    //     if (tabContainer) {
    //         if (tab === 'Reviews') {
    //             tabContainer.scrollLeft = tabContainer.scrollWidth; // ✅ Moves to the last tab when "Reviews" is clicked
    //         } else if (tab === 'DesignYourRoom') {
    //             tabContainer.scrollLeft = 0; // ✅ Moves to the first tab when "Description" is clicked
    //         }
    //     }
    // }

    const [locationDetails, setLocationDetails] = useState({
        zipCode: '',
        city: '',
        state: '',
        country: ''
    });

    const handleSearchModal = () => {
        setSearchLocation(true)
    }

    const handleCloseSearch = () => {
        setSearchLocation(false)
    }

    const getDeliveryDate = () => {
        const options = { weekday: "long", month: "long", day: "numeric" };
        const today = new Date();

        const optionWithTimeZone = { ...options, timeZone: "America/New_York" };

        today.setDate(today.getDate() + 5);
        return today.toLocaleDateString("en-us", optionWithTimeZone)
    }

    const handleStepperIndex = (index) => {
        setSteperIndex(index);
    }

    useEffect(() => {
        if (isMobile) {
            handleStepperIndex(0); // force show Description on mobile
        }
    }, [isMobile]);

    return (
        <>
            <div className={`product-sticky-tab-bar-main-container ${isSticky ? 'add-margin' : ''}`}>
                {isSticky && <div className={`product-sticky-fixed-container`}>
                    <div className='product-sticky-fixed-detail-and-add-to-cart'>
                        <div className='product-sticky-fixed-details'>
                            <h3>{productData?.name}</h3>
                            <span className='product-sticky-fixed-delivery-detail'>
                                <BsTruck size={20} color='var(--secondary-color)' />
                                <p>Get it by</p>
                                <strong>{getDeliveryDate()}</strong>
                                <i onClick={handleSearchModal}>
                                    <CiLocationOn scale={20} />
                                    <p>{info?.locationData?.zipCode} {info?.locationData?.stateCode}</p>
                                </i>
                            </span>
                        </div>
                        <div className='product-sticky-fixed-add-to-cart'>
                            <div className='product-detail-fixed-sale-price'>
                                <p>Sale</p>
                                {productData?.sale_price !== '' ? (
                                    <span>
                                        <h3>{formatedPrice(productData?.sale_price)}</h3>
                                        <p>was <del> {formatedPrice(productData?.regular_price)} </del> </p>
                                    </span>
                                ) : (
                                    <h3>{formatedPrice(productData?.regular_price)}</h3>
                                )}
                            </div>
                            <button
                                disabled={stockCheck || isDeliveryAllowed}
                                className={stockCheck || isDeliveryAllowed ? 'disable-sticky-add-to-cart' : ''}
                                onClick={() => {
                                    addToCart0(productData, variationData, !isProtectionCheck ? 1 : 0, quantity)
                                    handleAddToCartProduct(productData);
                                }
                                }
                            >
                                Add To Cart
                            </button>
                        </div>
                    </div>




                    {/* <div className='product-sticky-fixed-tabs-container'>
                        {tabBarItems.map((item, index) => (
                            <div
                                key={index}
                                className={`product-sticky-tab-bar-item-container ${steperIndex === index ? 'active-tab' : ''}`}
                                onClick={() => handleStepperIndex(index)}
                            >
                                <p>{item === 'DesignYourRoom' ? 'Design Your Room' : item}</p>
                            </div>
                        ))}
                    </div> */}
                </div>}

                <div className='product-sticky-tab-bar'>
                    {filteredTabItems.map((item, index) => (
                        <div
                            key={index}
                            // className={`product-sticky-tab-bar-item-container ${activeTab === item ? 'active-tab' : ''}`}
                            className={`product-sticky-tab-bar-item-container ${steperIndex === index ? 'active-tab' : ''} ${item === 'DesignYourRoom' ? 'display-hide' : 'other-stepers'}`}
                            // onClick={() => handleTabClick(item)}
                            onClick={() => handleStepperIndex(index)}
                        >
                            <p>{item === 'DesignYourRoom' ? 'Design Your Room' : item}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Location Modal */}
            <LocationPopUp
                searchLocation={searchLocation}
                handleCloseSearch={handleCloseSearch}
                setLocationDetails={setLocationDetails}
                locationDetails={locationDetails}
            />
        </>

    )
}

export default ProductStickyTabBar