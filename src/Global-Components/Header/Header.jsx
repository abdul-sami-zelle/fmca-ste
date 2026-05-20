'use client'

import React, { useState, useEffect } from 'react'
import './Header.css';
import Link from 'next/link';

import axios from 'axios';
import { useUserDashboardContext } from '@/context/userDashboardContext/userDashboard';

// Assets
import logo from '../../Assets/Logo/m_logo_360 2.png'
import searchIcon from '../../Assets/icons/search-icon-charcol.png';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import profileIcon from '../../Assets/icon/profile-icon.svg'
import locationIcon from '../../Assets/icons/location-red.png';
import navToggler from '../../Assets/icons/Union.png'
import searchRed from '../../Assets/icons/search-red.png'
import { IoIosSearch } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";

// Components
import Nav from '../Navbar/Nav';
import TabMenu from '../Navbar/TabMenu/TabMenu';
import NearStorePopUp from '@/UI/Components/NearStorePopUp/NearStorePopUp';
import LocationPopUp from '@/UI/Components/LocationPopUp/LocationPopUp';
import LanguagePopUp from '@/UI/Components/LanguagePopUp/LanguagePopUp';
import PromotionalBanner from '@/UI/Components/PromotionalBanner/PromotionalBanner';
import CartSidePannel from '@/UI/Components/Cart-side-section/CartSidePannel';
import MobileNavbar from '../Navbar/MobileNavbar/MobileNavbar';

// Context and functions
import { useCart } from '../../context/cartContext/cartContext';
import { getCurrentDay, getCurrentTimeForNewYork, url, useDisableBodyScroll } from '../../utils/api';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';

import { CiUser } from "react-icons/ci";

import { GiHamburgerMenu } from "react-icons/gi";
import { IoLocationOutline } from "react-icons/io5";

import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import { useProductPage } from '@/context/ProductPageContext/productPageContext';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/utils/Fetcher';
import ZipCodeModal from '@/UI/Modals/ZipCodeModal/ZipCodeModal';
import SideCart from '@/UI/Components/Cart-side-section/SideCart';
import ZipModal from '@/UI/Modals/ZipModal/ZipModal';

const Header = ({ checkoutPage }) => {

  // States and variables
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false)
  const [headerData, setHeaderData] = useState([]);
  const [headerOffer, setHeaderOffer] = useState([])
  const [headerSale, setHeaderSale] = useState([]);
  const [nearStorePopUp, setNearStorePopUp] = useState(false)
  const [changeLanguage, setChangeLanguage] = useState(false)
  const [currentSelectedCountry, setCurrentSelectedCountry] = useState('');
  const [currentSelectedCountryFlag, setCurrentSelectedCountryFlag] = useState();
  // const [searchLocation, setSearchLocation] = useState(false);
  const [mobileNavVisible, setMobileNavVisible] = useState(false)
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentInd, setCurrentInd] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const {
    cartProducts
  } = useCart()




  const {
    setMainLoader,
    info, fetchAllstores,
    stores,
    wrongZip,
    wrongZipMessage,
    handleZipWarningClose,
    searchLocation, 
    setSearchLocation,
  } = useGlobalContext();

  const [cartTotalProducts, setCartTotalProducts] = useState(0);
  useEffect(() => {
    if (cartProducts?.products?.length <= 9) {
      setCartTotalProducts(`0${cartProducts?.products?.length}`)
    } else {
      setCartTotalProducts(cartProducts?.products?.length)
    }
  }, [cartProducts])

  const cartItemCount = cartProducts?.products?.length || 0;

  const [isMobileSearched, setIsMobileSearched] = useState(false);
  const { singleProductData, setSingleProductData } = useProductPage();


  const navLinks = [
    { name: "Living Room", link: 'living-room-category', hasDropdown: true },
    { name: "Bedroom", link: '/bedroom-category', hasDropdown: true },
    { name: "Dining Room", link: '/dining-room-category', hasDropdown: true },
    { name: "Mattresses", link: '/mattresses-category', hasDropdown: true },
    { name: "Kids", link: '/kids-category', hasDropdown: true },
    { name: "Accent Furniture / Rugs", link: '/accent-furniture-category', hasDropdown: true },
    { name: "Small Spaces", link: '/small-spaces', hasDropdown: true },
    { name: "Outlets", link: '/sale-category', hasDropdown: true },
    { name: "Holiday Sale", link: '/holiday-sale', hasDropdown: true },

  ]

  // Functions and logincs
  const handleCartSectionOpen = () => {
    setShowCart(true)
  }


  const handleCartSectionClose = () => {
    setShowCart(false)
  }

  const handleTabMenu = () => {
    setIsTabMenuOpen(!isTabMenuOpen)
  }

  const headerApi = `${url}/api/v1/header-payloads/get`;
  const header = {
    "Content-Type": "application/json", // Adjust headers as needed
  }
  const [headerCount, setHeaderCount] = useState(0);
  const { data: headerContent, error: headerError, isLoading: headerLoading } = useSWR(headerApi, fetcher, header, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60
  })
  if (headerError && headerCount < 3) {
    setTimeout(() => {
      setHeaderCount(headerCount + 1);
    }, 1000)
  }

  useEffect(() => {
    if (headerContent) {
      setHeaderData(headerContent.data[0].categories)
      setHeaderSale(headerContent.data[0].sale)
      // setHeaderOffer(headerContent.data[0].lastCall)
    }
  }, [headerContent])

  const handleNearStorePopUp = () => {
    setNearStorePopUp(true)
  }

  const handleCloseNearStoreModal = () => {
    setNearStorePopUp(false)
  }

  const handleLanguageModal = () => {
    setChangeLanguage(true)
  }

  const handleCLoseLanguageModal = () => {
    setChangeLanguage(false);
  }

  const handleSearchModal = () => {
    setSearchLocation(true)
  }

  const handleCloseSearch = () => {
    setSearchLocation(false)
  }

  const showMobileNav = () => {
    setMobileNavVisible(true)
  }

  const searchForProducts = async (text) => {
    const api = `/api/v1/products/by-name?name`;
    try {
      setIsSearching(true)
      setIsLoading(true);
      const response = await axios.get(`${url}${api}=${text}`)
      setSearchedProducts(response.data.products)
    } catch (error) {
      console.error("error fething data", error);
    } finally {
      setIsSearching(false)
      setIsLoading(false)
    }
  }


  // const [searchedQuery, setSearchedQuery] = useState('');
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 2) {
      searchForProducts(value);
    } else {
      setSearchedProducts([]);
    }
  }

  const handleSearchInputFocus = () => setIsSearchInputFocused(true);
  const path = usePathname();
  useEffect(() => { setIsSearchInputFocused(false) }, [path])


  // Card title words limit

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const maxLength = 15;
  // const nameLength = 20;

  const descriptionLength = 150
  const truncateTitle = (title, maxLength) => {
    if (!title) return '';
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title
  };

  // const formatedSku = searchedProducts[currentInd].sku.split(':');
  const handleProductHOver = (index) => {
    setCurrentInd(index);
  }

  const handleMouseLeave = () => {
    // setCurrentInd(0)
  }

  const highLightText = (text, searchTerm) => {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ fontWeight: 'bold' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  const handleNavigateToSingleProduct = (items) => {
    router.push(`/product/${items.slug}`);
    setSingleProductData(items)
    setSearchQuery('')
    setSearchedProducts([])
    setIsSearchInputFocused(false)
    setIsMobileSearched(false)

  }

  // Navigate To product archive page with search query
  const handleNavigateToSearchedProducts = (e) => {
    e.stopPropagation();
    router.push(`/searched-products?query=${searchQuery}`);
    setSearchQuery('')
    setIsSearchInputFocused(false)
    setSearchedProducts([]);
    setIsMobileSearched(false)
  }

  const [mobileProductSearch, setMobileSearchProduct] = useState('')
  const handleNavigateToMobileViewSearchedProducts = (e) => {
    e.stopPropagation();
    router.push(`/searched-products?query=${mobileProductSearch}`)
    setIsMobileSearched(false);
    setMobileSearchProduct('');
    setSearchedProducts([]);
  }

  const handleClearSearch = () => {
    setMobileSearchProduct('')
    setSearchedProducts([])
  }

  const closeSearchModal = () => {
    setSearchQuery('');
    setIsSearchInputFocused(false);
    setSearchedProducts([])
  }


  const [locationDetails, setLocationDetails] = useState({
    zipCode: '',
    city: '',
    state: '',
    country: ''
  });


  const handleMobileSearchModal = () => {
    setIsMobileSearched(true)
  }


  const handleMobileSearchValue = (e) => {
    const value = e.target.value;
    setMobileSearchProduct(value);
    if (value.length > 2) {
      searchForProducts(value);
    } else {
      setSearchedProducts([]);
    }

  }


  const handleCloseMobileSearchProductModal = () => {
    setIsMobileSearched(false);
    setMobileSearchProduct('');
    setSearchedProducts([]);
  }

  const formatePrice = (price) => {
    return new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  // Nearest Stores

  const currentDay = getCurrentDay(getCurrentTimeForNewYork(), 'en-us')



  const findDefaultStore = () => {
    const defaultStore = stores.find(store => store.postal_code === '19134')
    return defaultStore;
  }
  const defaultStore = findDefaultStore()
  const defaultStoreTimings = defaultStore?.timings?.find(day => day.day === currentDay)


  const [timings, setTimings] = useState();

  useEffect(() => {
    const matchedTime = stores?.[0]?.timings?.find(day => day.day === currentDay);

    setTimings(matchedTime || { day: currentDay, time: 'close' })
  }, [stores])


  const { setUserToken, userUid, setSigninClicked, setMobileSignupClicked } = useUserDashboardContext();

  const [isTokenValid, setIsTokenValid] = useState(false);

  const checkToken = async () => {
    const token = localStorage.getItem('userToken');
    const uid = localStorage.getItem('uuid');
    if (token) {
      try {
        setMainLoader(true);
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
          router.push(`/my-account`)
        }
      } catch (error) {
        localStorage.removeItem('userToken');
        setUserToken(null);
        setIsTokenValid(false);
        setMainLoader(false);
      }

      setMainLoader(false);
    }
    else if (token === undefined) {

      // navigate.push("/my-account", { state: { message: "decided" } });
      router.push(`/my-account`)
    }
    else {
      setMainLoader(false);
      router.push("/my-account")
    }
  }

  const moveToLoginDash = async () => {
    setSigninClicked(true)
    setMobileSignupClicked(false)
    await checkToken();
  }



  useEffect(() => {
    fetchAllstores("code", info?.locationData?.zipCode);
  }, [])

  useEffect(() => {
    fetchAllstores("code", info?.locationData?.zipCode);
  }, [info?.locationData?.zipCode])


  const [showLocationSetStarter, setShowLocationSetStarter] = useState(false);
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
      setShowLocationSetStarter(true);
      sessionStorage.setItem('hasVisited', "true");
    }
  }, [])

  const handleINitialLocationSetModal = () => {
    setShowLocationSetStarter(false)
  }


  useDisableBodyScroll(isSearchInputFocused, nearStorePopUp, changeLanguage, searchLocation, showCart, mobileNavVisible, showLocationSetStarter)

  return (
    <div className={`haider-main-container ${checkoutPage ? 'hide-header' : ''}`}>

      {/* Banner Responsive */}
      <PromotionalBanner
        handleLanguageModal={handleLanguageModal}
        handleDeliverModal={handleSearchModal}
        currentSelectedCountryFlag={currentSelectedCountryFlag}
        usaFlag={'/Assets/icons/usa-flage.png'}
        currentSelectedCountry={currentSelectedCountry}
      />
      {/* Desktop view header */}
      <div className='header'>
        {/* <div className="tab-view-menu-togller-contianer">
          <GiHamburgerMenu strokeWidth={1.3} onClick={showMobileNav} className='tab-nav-toggler' />
        </div> */}
        <div className='logo-container'>
          <Link href={'/'}>
            <img src={'/Assets/Logo/fm-new-logo.png'} alt="logo" />
          </Link>
        </div>

        {isSearchInputFocused ? <div className='on-input-focus-overlay' onClick={closeSearchModal}></div> : <></>}
        <div className={`search-bar-container ${searchedProducts.length > 0 || isSearchInputFocused ? 'focused-search-container' : ''}`} >
          <div className='search-bar-input-and-button-container'>
            <div className='search-bar-div'>
              {/* <img src={'/Assets/icons/search-icon-charcol.png'} alt="search icon" /> */}
              <IoIosSearch size={20} color='#595959' />
              <input
                type='search'
                value={searchQuery}
                placeholder='Search Furniture Mecca'
                onFocus={handleSearchInputFocus}
                onChange={handleSearchInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchedProducts?.length > 0) {
                    handleNavigateToSearchedProducts(e);
                  }
                }}
              />
              {isLoading ? <div className='input-loader'></div> : <></>}
            </div>
            <button
              className='search-bar-search-product-button'
              onClick={searchedProducts?.length > 0 ? handleNavigateToSearchedProducts : null}
            >
              Search
            </button>
          </div>

          <div className={`search-product-display-div ${isSearchInputFocused === true && searchedProducts.length > 0 ? 'search-product-display-div-focused' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className='search-products-display-left'>
              <div className='searched-products'>
                {searchedProducts.map((items, index) => (
                  <Link
                    key={index}
                    className='searched-product'
                    onMouseEnter={() => handleProductHOver(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => { setSearchQuery(''); setIsSearchInputFocused(false); setSearchedProducts([]) }}
                    href={{ pathname: `/product/${items.slug}`, state: items }}
                  >
                    {items?.image?.image_url && (<Image src={`${url}${items?.image?.image_url}`} width={80} height={40} alt='main' />)}

                    <div className='searched-product-name-and-sku'>
                      <h3>{highLightText(items.name, searchQuery)}</h3>
                      <p>SKU: ({items.sku})</p>
                    </div>
                    <div className='searched-product-prices'>
                      {
                        items.sale_price === "" ?
                          <h3 className='searched-product-regular-price'>${items.regular_price}</h3> :
                          <h3 className='searched-product-sale-price'> <del>${items.regular_price}</del>  ${items.sale_price}</h3>
                      }
                    </div>
                  </Link>
                ))}
              </div>
              <button
                className='see-all-searched-products'
                onClick={handleNavigateToSearchedProducts}
              >
                See all Products ({searchedProducts?.length})
              </button>
            </div>
          </div>
        </div>

        <div className='nearby-address-container'>

          {stores && stores.length > 0 ? (
            <div className='nearby-address-div'>
              <div className='icon-and-nearby-city'>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 64 49"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className='near-store-svg'
                  onClick={handleNearStorePopUp}
                >
                  <path d="M59.5177 0C59.733 0.000356785 59.9448 0.0544467 60.1336 0.157315C60.3224 0.260183 60.4823 0.408542 60.5985 0.5888L60.7015 0.7808L63.8976 8.2688C63.9738 8.4474 64.0083 8.6409 63.9983 8.83469C63.9883 9.02848 63.9342 9.21747 63.84 9.38738C63.7458 9.55729 63.614 9.70368 63.4546 9.81546C63.2951 9.92725 63.1122 10.0015 62.9197 10.0326L62.7138 10.048H56.458V47.36C56.4581 47.6596 56.3526 47.9497 56.1598 48.1799C55.967 48.41 55.6991 48.5656 55.4029 48.6195L55.1713 48.64H8.83273C8.53158 48.6401 8.23994 48.5351 8.00859 48.3433C7.77724 48.1515 7.62084 47.8851 7.56664 47.5904L7.54605 47.36L7.53833 10.048H1.28763C1.09252 10.0481 0.899938 10.0041 0.724444 9.91933C0.54895 9.83452 0.395143 9.71111 0.274657 9.55845C0.154171 9.40579 0.0701612 9.22787 0.0289833 9.03815C-0.0121947 8.84843 -0.00946265 8.65188 0.0369727 8.46336L0.101307 8.2688L3.3 0.7808C3.38406 0.583138 3.51673 0.409676 3.68581 0.276368C3.85488 0.14306 4.05494 0.0541859 4.26758 0.01792L4.48375 0H59.5177ZM53.8846 10.048H10.1194V46.0774H17.1215V20.2035C17.1214 19.9039 17.227 19.6138 17.4198 19.3837C17.6126 19.1535 17.8804 18.9979 18.1766 18.944L18.4082 18.9235H45.5958C45.8965 18.924 46.1876 19.0293 46.4184 19.221C46.6492 19.4128 46.8052 19.6789 46.8593 19.9731L46.8825 20.2035L46.8799 46.0774H53.8898V10.048H53.8846ZM30.7115 29.7114H19.6949L19.6923 46.0774H30.7141L30.7115 29.7114ZM44.3014 29.7114H33.2874V46.0774H44.304L44.3014 29.7114ZM30.7141 21.481H19.6923V27.1514H30.7089V21.481H30.7141ZM44.3014 21.481H33.2874V27.1514H44.3014V21.481ZM58.6634 2.56H5.33296L3.23052 7.488H60.7658L58.6634 2.56Z" fill="var(--orange-outline)" />
                </svg>
                <NearStorePopUp isOpen={nearStorePopUp} setIsOpen={setNearStorePopUp} handleCloseNearBy={handleCloseNearStoreModal} />
                {stores && stores?.[0]?.distance ? (
                  <>
                    <div className='near-by-city-time' onClick={handleNearStorePopUp}>
                      <p>Nearest Store</p>
                      <span>
                        <Link href={'#'}> {stores?.[0]?.name ?? defaultStore?.name} </Link><p>({timings?.time})</p>
                      </span>
                    </div>
                    <span className='deliver-to' onClick={handleSearchModal}>
                      <p>Deliver to</p>
                      <span>{info.locationData.zipCode} {info.locationData.stateCode}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <div className='near-by-city-time' onClick={handleNearStorePopUp}>
                      <p>Nearest Store</p>
                      <span>
                        {/* <Link> {defaultStore?.city} </Link><p> ({defaultStoreTimings?.time})</p> */}
                        <Link href={'#'}> {stores?.[0]?.name ?? defaultStore?.name} </Link><p> ({defaultStoreTimings?.time})</p>
                      </span>
                    </div>
                    <span className='deliver-to' onClick={handleSearchModal}>
                      <p>Deliver to</p>
                      <span>{info.locationData.zipCode} {info.locationData.stateCode}</span>
                    </span>
                  </>
                )}

              </div>
            </div>
          ) : (
            <div className='shimmer-near-store-main-container'>

              <div className='shimmer-near-store-icon'></div>

              <div className='shimmer-near-store-city-and-timing-main'>
                <div className='shimmer-near-store-heading'></div>
                <div className='shimmer-state-and-timing'></div>
              </div>

              <div className='shimmer-delivery-and-zip-container'>
                <div className='shimmer-delivery-heading'></div>
                <div className='shimmer-zip-heading'></div>
              </div>

            </div>
          )}
          {stores && stores.length > 0 && showLocationSetStarter && <div className='nearby-store-set-location-modal-overlay'></div>}
          {stores && stores.length > 0 && showLocationSetStarter && (
            <ZipCodeModal
              handleINitialLocationSetModal={handleINitialLocationSetModal}
            />
          )}

        </div>

        <div className='header-icons-container'>
          <div style={{ paddingTop: '4px' }} onClick={moveToLoginDash} className='header-login'>
            <Image src={'/Assets/icon/user-outlined.svg'} width={23} height={23} alt="profile" />
          </div>

          <Link href={'/wishlist'} className='header-wishlist'>
            <Image src={'/Assets/icon/heart-outlined.svg'} width={31} height={27} alt="heart" />
          </Link>
          <button className='header-cart-icon-count' onClick={handleCartSectionOpen}>
            {/* <HiOutlineShoppingBag className='cartIcon' strokeWidth={1} /> */}
            <Image src={'/Assets/icon/cart-outlined.svg'} width={31} height={27} alt="heart" />
            {hasMounted && (<p className='header-cart-products-count'>{cartTotalProducts}</p>)}
          </button>
        </div>
      </div>

      {/* Tablate Haider */}
      <div className='tab-view-header'>
        <div className='tab-view-header-containt'>
          <div className='header-view-toggle-and-profile-div'>
            <img src={navToggler} alt="togle button" onClick={handleTabMenu} className='tab-view-humburger-icon' />
            <img src={profileIcon} alt="profile" />
          </div>
          <div className='tab-view-logo-and-searchbar'>
            <Link href={'/'}><img src={logo} alt='logo' /></Link>
            <div className='tab-view-searchbar-container'>
              <input type='search' placeholder="Search all things Furniture Mecca" />
              <img src={searchRed} alt="search" />
            </div>
          </div>
          <div className='tab-view-card-and-location'>
            <img src={locationIcon} alt="location" />
            {/* <img src={cartIcon} alt="cart" /> */}
            <HiOutlineShoppingBag className='cartIcon' strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Mobile View Header */}
      <div className='mobile-view-header'>

        <div className='mobile-view-logo-and-other-containt-section'>
          <div className="left_section_1">
            <GiHamburgerMenu strokeWidth={1.3} onClick={showMobileNav} className='nav-toggler' />
          </div>
          {/* <img className='nav-toggler' src={navToggler} alt="togle button" onClick={showMobileNav} /> */}
          <Link className='center_section_logo' href='/'>
            <Image className='mobile-logo' src={'/Assets/Logo/fm-new-logo.png'} width={120} height={32} alt='mobile-logo' />
          </Link>
          <div className='mobile-view-cart-and-location'>
            {/* <img src={locationIcon} alt='location' onClick={handleNearStorePopUp} /> */}
            <IoLocationOutline strokeWidth={1.2} className='locationIcon' onClick={handleNearStorePopUp} />
            <NearStorePopUp isOpen={nearStorePopUp} handleCloseNearBy={handleCloseNearStoreModal} />
            <button className='header-cart-icon-count' onClick={handleCartSectionOpen}>
              {/* <img src={cartIcon} alt="cart" /> */}
              <HiOutlineShoppingBag className='cartIcon' strokeWidth={1.5} />
              {/* <p className='header-cart-products-count'>{cartItemCount}</p> */}
              {hasMounted && (<p className='header-cart-products-count'>{cartTotalProducts}</p>)}
            </button>
          </div>
        </div>

        <div className='mobile-view-search-section'>
          <div className='mobile-view-search'>
            <Image src={searchIcon} width={32} height={32} alt='search-icon' />
            <input
              type='text'
              readOnly
              placeholder='Search Furniture Mecca'
              // value={mobileProductSearch}
              onFocus={handleMobileSearchModal}
            // onChange={handleMobileSearchValue}
            />
          </div>
          <div onClick={moveToLoginDash}>
            <CiUser strokeWidth={0.8} className='mobile-user-icon' />
          </div>
        </div>

        {stores && stores.length > 0 && showLocationSetStarter && (
          <div className='mobile-view-set-location-modal'>
            <ZipCodeModal
              handleINitialLocationSetModal={handleINitialLocationSetModal}
            />

            
          </div>
        )}



      </div>

      <div className={`mobile-view-search-products-modal ${searchedProducts.length > 0 || isMobileSearched ? 'mobile-view-search-products-modal-visible' : ''}`}>

        <div className={`mobile-view-search-products-modal-header ${isMobileSearched ? 'add-border-bottom' : ''}`}>

          <button className='mobile-view-search-products-modal-back-btn'>
            <FaArrowLeftLong size={15} onClick={handleCloseMobileSearchProductModal} />
          </button>

          <input
            type='text'
            placeholder='Search Furniture Mecca'
            value={mobileProductSearch}
            onChange={handleMobileSearchValue}
          />

          {isLoading ? <div className='input-loader'></div> : <></>}

          {mobileProductSearch.length > 0 && (
            <button className='mobile-view-search-products-modal-close-btn'>
              <Image src={'/Assets/icons/close-btn.png'} width={20} height={20} alt='close' onClick={handleClearSearch} />
            </button>
          )}

        </div>

        <div className={`mobile-view-search-products-modal-body `}>
          {
            searchedProducts && searchedProducts.map((item, index) => {
              return <div key={index} className='mobile-view-searched-product-result' onClick={() => handleNavigateToSingleProduct(item)}>
                <img
                  src={`${url}${item?.image?.image_url}`}
                  alt='product'
                  className='mobile-searched-product-image'
                />
                <div className='mobile-searched-product-content'>
                  <div className='mobile-searched-product-name-and-sku'>
                    <p>{truncateTitle(item.name, 17)}</p>
                    <p>SKU: {item.sku}</p>
                  </div>
                  <span className='searched-product-prices'>
                    {item.sale_price !== "" ? (
                      <div>
                        <del>{formatePrice(item.regular_price)}</del>
                        <p>{formatePrice(item.sale_price)}</p>
                      </div>
                    ) : (
                      <p>{formatePrice(item.regular_price)}</p>
                    )}
                  </span>
                </div>
              </div>
            })
          }
        </div>
        <button
          className={`mobile-view-see-all-products ${searchedProducts.length === 0 ? 'hide-see-all-product-button' : ''}`}
          onClick={handleNavigateToMobileViewSearchedProducts}
        >
          See All Products ({searchedProducts.length})
        </button>
      </div>

      {
        isTabMenuOpen ?
          <TabMenu isNavbarVisible={isTabMenuOpen} setIsNavbarVisible={setIsTabMenuOpen} navLinks={navLinks} /> :
          <Nav navLinks={headerData && headerData} headerOffer={headerOffer} sale_data={headerSale && headerSale} />
      }

      {/* Language Modal */}
      <LanguagePopUp
        changeLanguage={changeLanguage}
        setChangeLanguage={setChangeLanguage}
        handleCLoseLanguageModal={handleCLoseLanguageModal}
        currentSelectedCountry={currentSelectedCountry}
        setCurrentSelectedCountry={setCurrentSelectedCountry}
        currentSelectedCountryFlag={currentSelectedCountryFlag}
        setCurrentSelectedCountryFlag={setCurrentSelectedCountryFlag}
      />

      {/* Location Modal */}
      <LocationPopUp
        searchLocation={searchLocation}
        handleCloseSearch={handleCloseSearch}
        setLocationDetails={setLocationDetails}
        locationDetails={locationDetails}
      />

      {/* <CartSidePannel
        cartData={cartProducts}
        addToCartClicked={showCart}
        setAddToCartClick={setShowCart}
        handleCartSectionClose={handleCartSectionClose}
        increamentQuantity={increamentQuantity}
        decreamentQuantity={decreamentQuantity}
        removeFromCart={removeFromCart}
      /> */}

      <SideCart
        isCartOpen={showCart}
        handleCloseSideCart={handleCartSectionClose}
      />

      <MobileNavbar
        showMobileNav={mobileNavVisible}
        headerData={headerData}
        setMobileNavVisible={setMobileNavVisible}
        headerOffer={headerOffer}
        sale_data={headerSale && headerSale}
      />

      <ZipModal
        showMessage={wrongZip}
        errorDetail={wrongZipMessage}
        footerMessage={'Wrong Zip Code'}
        closeModal={handleZipWarningClose}
      />

    </div>
  )
}

export default Header