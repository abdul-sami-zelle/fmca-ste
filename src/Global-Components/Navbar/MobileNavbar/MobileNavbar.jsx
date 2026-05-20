import React, { useState } from 'react'
import './MobileNavbar.css'
import Link from 'next/link';
import { url, useDisableBodyScroll } from '../../../utils/api';
import Image from 'next/image';
import { HiOutlineShoppingBag } from "react-icons/hi2";

import { MdKeyboardArrowRight } from "react-icons/md";
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import { CiUser } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { useUserDashboardContext } from '@/context/userDashboardContext/userDashboard';

const MobileNavbar = ({ showMobileNav, setMobileNavVisible, headerData, sale_data, headerOffer }) => {

  const handleNavbarClose = () => {
    setMobileNavVisible(false)
  }
  const { CalculateGrandTotal } = useGlobalContext()

  const [isTokenValid, setIsTokenValid] = useState(false);

  const menuFooterIcons = [
    { name: 'Track', icon: '/icons/order-icon.png', link: 'https://track.myfurnituremecca.com/' },
    { name: 'Wishlist', icon: '/icons/wishlist.png', link: '/wishlist' },
    { name: 'Stores', icon: '/icons/store-locator.png', link: '/store-locator' },
    { name: 'Financing', icon: '/icons/financing-icon.png', link: '/financing' },
    { name: 'Help', icon: '/icons/help-icon.png', link: 'tel:2153521600' },
  ]

  const router = useRouter()

  const handleNAvigateToCart = () => {
    router.push('/cart')
    handleNavbarClose()
  }


  const { setSigninClicked, setMobileSignupClicked } = useUserDashboardContext()
  // const handleNAvigateToLogin = () => {
  //   const uid = localStorage.getItem('uuid')
  //   const userToken = localStorage.getItem('userToken')

  //   if(uid && userToken) {
  //     router.push(`/user-dashboard/${id}`);
  //   }

  //   setSigninClicked(true);
  //   handleNavbarClose()
  // }

  const checkToken = async () => {
    const token = localStorage.getItem('userToken');
    const uid = localStorage.getItem('uuid');
    if (token) {
      try {
        const response = await fetch(`${url}/api/v1/web-users/verify-token`, {
          method: "GET",
          headers: {
            authorization: `${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserToken(token);
          setIsTokenValid(true);
          setMainLoader(false);
          router.push(`/user-dashboard/${uid}`)
        } else {
          localStorage.removeItem('userToken');
          setUserToken(null);
          setIsTokenValid(false);
          setMainLoader(false);
          setSigninClicked(true);
          setMobileSignupClicked(false)
          router.push(`/my-account`)
        }
      } catch (error) {
        localStorage.removeItem('userToken');
        setUserToken(null);
        setIsTokenValid(false);
        setMainLoader(false);
      }

    }
    else if (token === undefined) {
      setSigninClicked(true);
      setMobileSignupClicked(false)
      router.push(`/my-account`)
    }
    else {
      setSigninClicked(true);
      setMobileSignupClicked(false)
      router.push("/my-account")
    }
  }

  useDisableBodyScroll(isTokenValid)

  return (
    <div className={`mobile-menu-overlay ${showMobileNav ? 'show-mobile-nav' : ''}`} onClick={handleNavbarClose}>
      <div className={`mobile-nav-main-container ${showMobileNav ? 'slide-drower' : ''}`} onClick={(e) => e.stopPropagation()}>

        <div className='mobile-nav-head'>
          <div className='mobile-nav-head-container'>
            <Image src={'/icons/close-charcoal.svg'} width={15} height={15} alt='close' onClick={handleNavbarClose} />
            <Link href={'/'} className='mobile-nav-header-image-contianer' onClick={handleNavbarClose}>
              <Image src={'/Assets/Logo/fm-new-logo.png'} width={180} height={40} alt='main-logo' />
            </Link>
            <CiUser strokeWidth={0.8} className='mobile-user-icon' onClick={() => { checkToken(); handleNavbarClose() }} />
          </div>

          <div className='mobile-nav-cart-container' onClick={handleNAvigateToCart}>
            <div className='mobile-nav-cart-icon-and-total-container'>
              <span >
                <HiOutlineShoppingBag size={30} color='#FFFFFF' />
              </span>
              <div className='mobile-head-cart-total-container'>
                <p>Cart</p>
                <h3>USD {CalculateGrandTotal()}</h3>
              </div>
            </div>
            <div className='mobile-nav-head-total-price-arrow-container'>
              <MdKeyboardArrowRight size={20} color='#FFFFFF' />
            </div>
          </div>
        </div>

        <div className='mobile-nav-links-container'>
          {headerData.map((items, index) => (
            <Link href={
              items.category_slug === "outdoor"
                ? `/${items.category_slug}/shop-all-outdoor`
                : `/${items.category_slug}`
            } className='mobile-nav-single-link-container' key={index} onClick={handleNavbarClose} >
              <div className='mobile-nav-single-item-name-anchor' >
                {items.mob_img === '' ? (
                  <Image src={`/Assets/mobile-nav-assets/living-room-set.png`} width={70} height={60} alt='nav-icon' />
                ) : (
                  <Image src={`${url}${items?.mob_img}`} width={70} height={60} alt='nav-icon' />
                )}

                <p>{items.category}</p>
              </div>
              <span>
                <MdKeyboardArrowRight size={20} color='#595959' />
              </span>
            </Link>
          ))}

          {/* <Link href={`/call/${headerOffer.category_slug}`} className='mobile-nav-single-link-container' onClick={handleNavbarClose}>
            <div className='mobile-nav-single-item-name-anchor' >
           
                {!headerOffer?.mob_img
                ? (
                  <Image
                    src="/Assets/mobile-nav-assets/living-room-set.png"
                    width={70}
                    height={60}
                    alt="nav-icon"
                  />
                ) : (
                  <Image
                    src={url + headerOffer.mob_img}
                    width={70}
                    height={60}
                    alt="nav-icon"
                  />
                )}

              <p>{headerOffer.category} 🔥</p>
            </div>
            <span>
              <MdKeyboardArrowRight size={20} color='#595959' />
            </span>
          </Link> */}

          <Link href={`/sale/${sale_data.category_slug}`} className='mobile-nav-single-link-container' onClick={handleNavbarClose}>
            <div className='mobile-nav-single-item-name-anchor' >
              {/* {sale_data && sale_data?.mob_img === '' ? (
                  <Image src={'/Assets/mobile-nav-assets/living-room-set.png'} width={70} height={60} alt='nav-icon' />
                  ) : (
                   <Image src={url+sale_data?.mob_img} width={70} height={60} alt='nav-icon' />
                 )}  */}

              {!sale_data?.mob_img
                ? (
                  <Image
                    src="/Assets/mobile-nav-assets/living-room-set.png"
                    width={70}
                    height={60}
                    alt="nav-icon"
                  />
                ) : (
                  <Image
                    src={url + sale_data?.mob_img}
                    width={70}
                    height={60}
                    alt="nav-icon"
                  />
                )}

              <p>{sale_data.category}</p>
            </div>
            <span>
              <MdKeyboardArrowRight size={20} color='#595959' />
            </span>
          </Link>
        </div>

        <div className='mobile-nav-footer-buttons'>
          {menuFooterIcons.map((item, index) => (
            <Link key={index} href={item.link} target={item.name === 'Track' ? '_blank' : ''} onClick={handleNavbarClose}>
              <Image src={item.icon} width={30} height={30} alt='icon' />
              {item.name}
            </Link>
          ))}
        </div>

      </div>

    </div>

  )
}

export default MobileNavbar
