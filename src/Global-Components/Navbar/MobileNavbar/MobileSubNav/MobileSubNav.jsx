import React from 'react'
import './MobileSubNav.css'
import mainLogo from '../../../../Assets/Logo/m_logo_360 2.png'
import ordersIcon from '../../../../Assets/icons/order.png';
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from 'next/router';
// import { Link, useNavigate } from 'react-router-dom';
import Link from 'next/link'

const MobileSubNav = ({ 
    openSubNav, 
    setOpenSubNav, 
    setMobileNavVisible, 
    subNavData
}) => {

    // const navigate = useRouter()
    const handleCloseSubNav = () => {
        setOpenSubNav(false)
    }

    const handleCloseAllNav = () => {
        setMobileNavVisible(false);
        setOpenSubNav(false);
    }

    const handleNavigateToHome = () => {
        // navigate('/');
        setMobileNavVisible(false);
        setOpenSubNav(false);
    }

    return (
        <div className={`mobile-sub-navbar ${openSubNav ? 'show-sub-nav' : ''}`}>
            <button className='close-sub-nav' onClick={handleCloseSubNav}>
                <Link href={'#'}>
                    <IoMdArrowBack size={25} />
                </Link>
            </button>
            <div onClick={handleNavigateToHome} className='mobile-sub-nav-head'>
                <img src={mainLogo} alt='main-logo' />
            </div>
            <div className='mobile-sub-nav-body'>
                <div className='mobile-sub-nav-title-div'>
                    <img src={ordersIcon} alt='title-image' className='mobile-sub-nav-title-image' />
                    <h3 className='mobile-nav-category-heading'>{subNavData.category}</h3>
                </div>
                <div className='mobile-sub-nav-items'>
                    {subNavData.subCategories && subNavData.subCategories.map((items, index) => (
                        <Link href={`/${items.slug}`} key={index} className='mobile-sub-nav-single-item' onClick={handleCloseAllNav}>
                            {/* <img src={ordersIcon} alt='sub-nav-icon' /> */}
                            <p >{items.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MobileSubNav
