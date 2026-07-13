'use client'

import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import './PromotionalBanner.css';
import Link from 'next/link'

import { useUserDashboardContext } from '../../../context/userDashboardContext/userDashboard';
import { url, useDisableBodyScroll } from '../../../utils/api';
import Image from 'next/image';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';


const PromotionalBanner = (
  {
    handleLanguageModal,
    handleDeliverModal,
    currentSelectedCountryFlag,
    usaFlag,
    currentSelectedCountry
  }) => {


  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0);
  const dynamicHeading = [0, 1, 2]
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dynamicHeading.length)
    }, 5000)
    return () => clearInterval(intervalId);
  }, [])


  // const { setMainLoader } = useGlobalContext();
  const { setUserToken, setSigninClicked } = useUserDashboardContext();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { info } = useGlobalContext()

  const handleUserLogin = async (clickType) => {
    const token = localStorage.getItem('userToken');
    const id = localStorage.getItem('uuid');

    try {
      if (token) {
        const response = await fetch(`${url}/api/v1/web-users/verify-token`, {
          method: "GET",
          headers: {
            authorization: `${token}`,
          },
        });
        if (response.ok) {
          router.push(`/user-dashboard/${id}`);
        }
      } else {
        localStorage.removeItem('userToken');
        setUserToken(null);
        setSigninClicked(clickType === 'login' ? true : false);
        router.push('/my-account');
      }
    } catch (error) {
      console.error("UnExpected Server Error", error);
    }
  }

  const handleCloseLoginMessageModal = () => {
    setIsTokenValid(false)
  }

  // Indicator
  const bannerLinks = [
    { label: 'Blogs', link: '/blogs' },
    { label: 'Log In', link: '' },
    { label: 'Stores', link: '/store-locator' },
    { label: 'Track Order', link: 'https://track.myfurnituremecca.com/' },
    { label: 'Financing', link: '/financing' },
    { label: 'Help', link: '/contact-us' },
  ]
  const indicatorRef = useRef(null);
  const linksRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(4);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const lastMovedIndex = useRef(null);// hovered
  const activeIndexRef = useRef(activeIndex);
  const hoverIndexRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const moveIndicator = () => {
    const index = hoverIndexRef.current != null
      ? hoverIndexRef.current
      : activeIndexRef.current;

    if (lastMovedIndex.current === index) return;

    const link = linksRef.current[index];
    const indicator = indicatorRef.current;

    if (link && indicator) {
      // disable transition only for first paint
      if (!mounted) {
        indicator.style.transition = "none";
      } else {
        indicator.style.transition = "all 0.3s ease"; // normal smooth slide
      }

      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.left = `${link.offsetLeft}px`;
      indicator.style.opacity = "1";
      lastMovedIndex.current = index;
    }
  };

  // useEffect(() => {
  //   moveIndicator();
  //   requestAnimationFrame(() => setMounted(true));
  // }, []);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lastMovedIndex.current = null;
        moveIndicator();
        setMounted(true)
      })
    })
  }, [])

  const handleHover = (index) => {
    hoverIndexRef.current = index;
    moveIndicator();
  };

  const handleLeave = () => {
    hoverIndexRef.current = null;
    moveIndicator();
  };


  useEffect(() => {
    moveIndicator();
  }, [activeIndex, hoveredIndex]);

  useEffect(() => {
    const handleResize = () => {
      lastMovedIndex.current = null; // ✅ Force recalc
      moveIndicator();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    const currentIndex = bannerLinks.findIndex(
      item => item.link && pathname.startsWith(item.link)
    );

    let indexToUse = currentIndex;

    // Fallback to "Track Order" if nothing matches
    if (indexToUse === -1) {
      indexToUse = bannerLinks.findIndex(item => item.label === 'Track Order');
    }

    if (indexToUse !== -1) {
      setActiveIndex(indexToUse);
      activeIndexRef.current = indexToUse; // ✅ Sync ref
      lastMovedIndex.current = null; // ✅ Force indicator to recalculate
      moveIndicator();
    }
  }, [pathname]);

  useDisableBodyScroll(isTokenValid)

  return (
    <div className='furniture-mecca-promotional-banner'>

      <div className='rotating-message'>
        {currentIndex === 1 ? (
          <span>
            Need help ordering?{' '}
            <a className='toll-free-ancor' href='tel:2153521600'>
              Call 215 352 1600
            </a>
          </span>
        ) : currentIndex === 2 ? (
          <span>
            Learn about my{' '}
            <Link href='/financing' className='toll-free-ancor'>
              Financing Options
            </Link>
          </span>
        ) : (
          <span>Shop everyday low prices!</span>
        )}
      </div>

      <Link href={'https://track.myfurnituremecca.com/'} target='_blank' className='promotion-banner-track-order'>Track Your Order</Link>

      <div className='header-links-and-select-language'>
        <nav className='banner-link-container-nav'>
          <ul className='banner-link-container'>

            {
              bannerLinks.map((item, index) => {
                const isExternal = item.link.startsWith('http');
                const isActive =
                  index === activeIndex &&
                  (pathname === item.link || item.label === 'Track Order');

                if (item.label === 'Log In') {
                  return (
                    <li key={`link-${index}`}>
                      <p
                        onClick={() => {
                          handleUserLogin('Log In');
                          setActiveIndex(index);
                          handleHover(index);
                        }}
                        ref={(el) => (linksRef.current[index] = el)}
                        onMouseEnter={() => handleHover(index)}
                        onMouseLeave={handleLeave}
                        className={isActive ? 'active' : ''}
                      >
                        {item.label}
                      </p>
                    </li>
                  );
                }

                return (
                  <li key={`link-${index}`}>
                    <Link
                      href={item.link}
                      target={isExternal ? '_blank' : '_self'}
                      ref={(el) => (linksRef.current[index] = el)}
                      onClick={() => setActiveIndex(index)}
                      onMouseEnter={() => handleHover(index)}
                      onMouseLeave={handleLeave}
                      className={isActive ? 'active' : ''}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })
            }

            <span className="indicator" ref={indicatorRef}></span>

          </ul>
        </nav>
        <div className='header-main-banner-language-div'>
          <button onClick={handleLanguageModal}>
            <Image src={currentSelectedCountryFlag || usaFlag} width={22} height={22} alt='flag' />
            {currentSelectedCountry || 'English'}
          </button>
        </div>
      </div>

      <div className='on-tab-deliver-to' onClick={handleDeliverModal}>
        <img src={'/Assets/icon/truck-white.svg'} alt="delivery" />
        <div className='mobile-view-delever-to'>
          <p>Deliver to : </p>
          {info?.locationData?.zipCode && info?.locationData?.stateCode && (
            <Link href="#">
              {info.locationData.zipCode} {info.locationData.stateCode}
            </Link>
          )}
        </div>
      </div>

      <div className={`login-warning-modal-main-container ${isTokenValid ? 'show-login-warning-modal' : ''}`} onClick={handleCloseLoginMessageModal}>
        <div className={`login-warning-modal-inner-container ${isTokenValid ? 'zoom-login-inner-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCloseLoginMessageModal}
            className='login-warning-modal-close-btn'
          >
            <img src={'/Assets/icons/close-btn.png'} alt='cross' />
          </button>
          <div className='login-warning-modal-inner-content'>
            <p>Login Required</p>
            <p>To access your orders dashboard, please log in.</p>
            <div className='navigate-to-login-btn-container'>
              <button className='navigate-to-login-btn' onClick={() => handleUserLogin('Log In')}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromotionalBanner