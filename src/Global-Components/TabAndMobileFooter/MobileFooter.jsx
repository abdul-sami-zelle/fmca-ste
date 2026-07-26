import React, { useState } from 'react'
import './MobileFooter.css';
import Link from 'next/link';
import redFurnitureMecca from '../../Assets/global-images/furniture-mecca-red.jpeg'
import locationIcon from '../../Assets/icons/location.png'
import callIcon from '../../Assets/icons/call.png'
import calander from '../../Assets/icons/white-calander.png'
import mailIcon from '../../Assets/icons/mail.png'
import clock from '../../Assets/icons/white-clock.png'
import { FaPlus } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";

import { getCurrentDay, getCurrentTimeForNewYork, url } from '../../utils/api';
import RatingReview from '../../UI/Components/starRating/starRating';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FaRegCopyright } from "react-icons/fa";

const MobileFooter = ({ checkoutPage }) => {

    const [googleRating, setGoogleRating] = useState(null);

    const pathname = usePathname()



    const socialIcons = [
        { socialIcon: '/icons/facebook.svg', socialLink: 'https://www.facebook.com/myfurnituremecca' },
        { socialIcon: '/icons/tiktok.svg', socialLink: 'https://www.tiktok.com/@myfurnituremecca?_t=8gcQvVGSaGI&_r=1' },
        { socialIcon: '/icons/youtube.svg', socialLink: 'https://www.youtube.com/@FurnitureMecca1' },
        { socialIcon: '/icons/insta.svg', socialLink: 'https://www.instagram.com/myfurnituremecca/?igshid=MzRlODBiNWFlZA%3D%3D' },
    ]

    function cleanPhoneNumber(str) {
        return str.replace(/[-()]/g, '');
    }


 

    const footerCustomerCareAndAbout = [
        {
            heading: 'Customer Care', navLinks: [
                { name: 'Track Your Order', link: 'https://track.myfurnituremecca.com/' },
                { name: 'Financing', link: '/financing' },
                { name: 'Shipping & Delivery', link: '/shipping-and-delivery' },
                { name: 'Terms & Conditions', link: '/terms-and-conditions' },
                { name: 'Return Policy', link: '/return-policy' },
                { name: 'Contact Us', link: '/contact-us' },






            ]
        },
        {
            heading: 'About Furniture Mecca', navLinks: [
                { name: 'About Us', link: '/about-us' },

                // { name: 'Design your Room', link: '/free-design-consultation' },
                { name: 'Career', link: '/careers' },
                { name: 'Store Locations', link: '/store-locator' },
                // { name: 'Reference', link: '#' },
                { name: 'Protection Plan', link: '/premium-bed-care' },
                { name: 'My Account', link: '/user-dashboard/:id' },
                { name: 'Blogs', link: '/blogs' },
            ]
        },
    ];

    const { stores } = useGlobalContext()
    const findDefaultStore = () => {
        const defaultStore = stores.find(store => store.postal_code === '19134')
        return defaultStore;
    }

    const defaultStore = findDefaultStore();

    const currentDay = getCurrentDay(getCurrentTimeForNewYork(), 'en-us')
    const defaultStoreTimings = defaultStore?.timings?.find(day => day.day === currentDay);

    const nearStoreDetails = [
        {
            icon: locationIcon,
            details: defaultStore?.name
        },
        {
            icon: callIcon,
            details: defaultStore?.phone

        },
        {
            icon: clock,
            details: defaultStoreTimings?.time
        },
        {
            icon: calander,
            details: 'Monday - Sunday'
        },
    ]

    const [footerAccordionIndex, setFooterAccordionIndex] = useState(null);
    const handleFooterAccordion = (index) => {
        setFooterAccordionIndex((prev) => prev === index ? null : index);
    }

    const [locationAccordion, setLocationAccordion] = useState(false);
    const handleNearStoreAccordion = () => {
        setLocationAccordion(!locationAccordion);
    }

    const handleSnakeBarOpen = (message) => {
        setShowSnakeBar(true);
        setSnakeBarMessage(message)
    }

    const handleClick = () => {
        if (defaultStore?.latitude && defaultStore?.longitude) {
            const googleMapsUrl = `https://www.google.com/maps?q=${defaultStore?.latitude},${defaultStore?.longitude}`;
            // Open the URL in a new tab
            window.open(googleMapsUrl, "_blank");
        } else {
            handleSnakeBarOpen("Latitude and Longitude are not available.");
        }
    };


       const contactData = [
        // { icon: locationIcon, title: 'Philadelphia', link: '#' },
        // { icon: callIcon, title: '215 352 1600', link: 'tel:2153521600' },
        // { icon: mailIcon, title: 'meccacustomercare@gmail.com', link: 'mailto:meccacustomercare@gmail.com' }
        { name:  stores?.[0]?.city ? `${stores?.[0]?.city}` : 'Philadelphia', icon: locationIcon, link: '#' },
        { name: stores?.[0]?.phone || '215 352 1600', href: `tel:${stores?.[0]?.phone && cleanPhoneNumber(stores?.[0]?.phone)}` || 'tel:2153521600', icon: callIcon, link: '#' },
        { name: stores?.[0]?.email || 'meccacustomercare@gmail.com', href: `mailto:${stores?.[0]?.email}` || 'mailto:meccacustomercare@gmail.com', icon: mailIcon, link: '#' }
    ]





    return (
        <div className={`mobile-view-footer-main-container ${pathname === '/cart' ? 'hide-mobile-footer' : ''} ${checkoutPage ? 'hide-mobile-footer' : ''} `}>

            <div className='mobile-location-section'>
                <div className='mobile-footer-accordion-heading-div' onClick={handleNearStoreAccordion}>
                    <h3 className='mobile-footer-location-section'>Nearest Store</h3>
                    <button className={`mobile-footer-accordion-button ${locationAccordion ? 'rotate-accordion' : ''}`}>
                        <FaPlus color='#FFFFFF' size={15} />
                    </button>
                </div>
                <div className={`mobile-view-near-store-containt-section ${locationAccordion ? 'show-mobile-footer-location' : ''}`}>
                    <div className='near-store-image-div'>
                        {defaultStore?.images?.[0]?.image_url && (<Image src={`${url}${defaultStore?.images?.[0]?.image_url}`} width={220} height={32} alt='near store' />)}
                    </div>
                    <div className='near-store-details-section'>
                        {nearStoreDetails.map((item, index) => (
                            <span key={index}>
                                <Image src={item.icon} width={17} height={17} alt='icon' />
                                <p>{item.details}</p>
                            </span>
                        ))}
                    </div>
                    <div className='appointment-and-outlet-div'>
                        <Link href={'/store-locator'}>
                            <p>Outlet</p>
                        </Link>
                        <Link href={'#'}>
                            <p onClick={handleClick}>Directions</p>
                        </Link>
                        <Link href={'/book-an-appointment'}>
                            <p>Book an Appointment</p>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='mobile-view-terms-and-rights'>
                {footerCustomerCareAndAbout.map((item, index) => (
                    <div key={index} className='mobile-footer-nav-links'>
                        <div className='mobile-footer-accordion-heading-div' onClick={() => handleFooterAccordion(index)}>
                            <h3 className='mobile-footer-nav-links-heading'>{item.heading}</h3>
                            <button className={`mobile-footer-accordion-button ${footerAccordionIndex === index ? 'rotate-accordion' : ''}`}>
                                <FaPlus color='#FFFFFF' size={15} />
                            </button>
                        </div>
                        <div className={`mobile-footer-nav-items ${footerAccordionIndex === index ? 'show-footer-accordion' : ''}`}>
                            {item.navLinks.map((innerItems, innerIndex) => (
                                <Link className='footer-nav-span' key={innerIndex} href={innerItems.link} target={innerItems.name === 'Design your Room' ? '_blank' : innerItems.name === 'Track Your Order' ? '_blank' : '_self'} >
                                    {/* <Image src={arrowRightWhite} width={10} height={10} alt='arrow right' /> */}
                                    <MdKeyboardArrowRight color='#FFF' size={20} />
                                    {innerItems.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

            </div>


            {
                googleRating &&
                <div className='footer-banner'>
                    <div className='mobile-view-footer-banner-logo'>
                        <img src={redFurnitureMecca} alt='img' className='company-name-image' />
                    </div>
                    <div className='banner-content'>
                        <h3>Furniture Mecca</h3>
                        <RatingReview rating={googleRating?.rating} disabled={true} bgColor={"#FFD700"} size={"20px"} />
                        <p>{googleRating?.number_of_reviews} Google Reviews</p>
                    </div>
                </div>
            }

            <div className='contact-container'>
                {contactData.map((item, index) => {
                    return <span key={index}>
                        <Image src={item.icon} width={22} height={22} alt='img' />
                        {/* <Link href={item.link}>{item.title}</Link> */}
                        {/* {
                            item.title === 'meccacustomercare@gmail.com' ?
                                <a href='mailto:meccacustomercare@gmail.com'>{item.title}</a> :
                                <Link href={item.link}>{item.title}</Link>
                        } */}
                        {index===0?<p>{ item.name}</p>:<p>{item.href === "" ? item.name : <a href={item.href}>{item.name}</a>}</p>}


                    </span>
                })}
            </div>

            <div className='footer-social-icons'>
                {socialIcons.map((item, index) => {
                    return <Link key={index} target='_blank' href={item.socialLink}>
                        <Image src={item.socialIcon} width={25} height={25} alt="icon" />
                    </Link>
                })}
            </div>

            {/* <div className='copy-rights-contianer-main'>
                <div className='copy-rights-dual-links'>
                    <span>
                        <Link href={'/shipping-and-delivery'}>Shipping & Delivery</Link>
                    </span>
                    <span>
                        <Link href={'/terms-and-conditions'}>Term & Conditions</Link>
                    </span>
                </div>
                <div className='copy-rights-single-link'>
                    <Link href={'/return-policy'}>Return Policy</Link>
                </div>
            </div> */}

            <div className='footer-mobile-copy-sight-and-manage-by'>
                <span className='mobile-footer-copy-rights'>
                    <FaRegCopyright color='#FFF' size={15} />
                    <p>2020 - 2026 Furniture Mecca. All Rights Reserved.</p>
                </span>

                <div className='mobile-view-right'>
                    <span>
                        <p>Designed & Managed by </p>
                        <Link target='_blank' href={'https://zellesolutions.com/'}>Zelle Solutions</Link>
                    </span>
                </div>
            </div>







        </div>
    )
}

export default MobileFooter
