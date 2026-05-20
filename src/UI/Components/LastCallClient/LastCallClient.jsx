'use client'

import React, { useState, useEffect, useRef } from "react";
import "../SaleClient/ActiveCategoryPage.css"
import { url, useDisableBodyScroll } from "../../../utils/api";
import { useActiveSalePage } from "../../../context/ActiveSalePageContext/ActiveSalePageContext";
import Sliderr from "../../../Global-Components/Slider/Slider";
// import { useNavigate } from "react-router-dom";
import { useList } from "../../../context/wishListContext/wishListContext";
import ProductCardShimmer from "../../Components/Loaders/productCardShimmer/productCardShimmer";
import heart from "../../../Assets/icons/heart-vector.png"
import CartSidePannel from "../../Components/Cart-side-section/CartSidePannel";
import { useCart } from "../../../context/cartContext/cartContext";
import QuickView from "../../Components/QuickView/QuickView";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import ProductCardTwo from "../../Components/ProductCardTwo/ProductCardTwo";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useLastCallContext } from "@/context/LastCallContext/LastCallContext";
import SnakBar from "@/Global-Components/SnakeBar/SnakBar";
import ProductInfoModal from "@/Global-Components/ProductInfoModal/ProductInfoModal";
import SideCart from "../Cart-side-section/SideCart";
import { useGlobalContext } from "@/context/GlobalContext/globalContext";
import DisableDelivery from "@/Global-Components/DisableDelivery/DisableDelivery";

export default function LastCallClient({ slug }) {
    const router = useRouter();
    // const { salesData, products } = useActiveSalePage();
    const { lastCallData, products, totalProducts } = useLastCallContext()


    const handleProductClick = (item) => {
        router.push(`/product/${item.slug}`)
    };


    const [quickViewProduct, setQuickViewProduct] = useState({})
    const [quickViewClicked, setQuickView] = useState(false);
    const [addToCartClicked, setAddToCartClicked] = useState(false)
    const [activeGrid, setActiveGrid] = useState('single-col')
    const [salePrice, setSalePrice] = useState("");
    const [regPrice, setRegPrice] = useState("");

    const handleQuickViewOpen = (item) => {
        setQuickView(true);
        setQuickViewProduct(item)

    }
    // wish list 
    const { addToList, removeFromList, isInWishList } = useList()
    const [showSnakeBar, setShowSnakeBar] = useState(false);
    const [snakeBarMessage, setSnakeBarMessage] = useState();


    const handleWishList = async (item) => {

        const userId = localStorage.getItem('uuid');
        const getToken = localStorage.getItem('userToken');

        setShowSnakeBar(true)
        if (isInWishList(item._id)) {
            removeFromList(item._id);
            setSnakeBarMessage('Removed from wishlist')

        } else {
            addToList(item._id)

            setSnakeBarMessage('added to wishlist')
        }

        if (userId && getToken) {
            const api = `${url}/api/v1/web-users/wishlist/${userId}`;

            try {
                const response = await axios.put(api, { productId: item._id }, {
                    headers: {
                        Authorization: getToken,
                        'Content-Type': 'application/json',
                    }
                });
            } catch (error) {
                console.error("UnExpected Server Error", error);
            }
        }
    }

    const handleCloseSnakeBar = () => {
        setShowSnakeBar(false)
    }

    const {
        cartProducts,
        increamentQuantity,
        decreamentQuantity,
        removeFromCart,
        cartSection,
        setCartSection
    } = useCart();


    const handleCartSectionClose = () => {
        setCartSection(false)
    }
    const handleQuickViewClose = () => { setQuickView(false) }

    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const handleOpennfoModal = (salePrice, regPrice) => {
        setIsInfoOpen(true);
        setSalePrice(salePrice)
        setRegPrice(regPrice)
    }

    const handleCloseInfoModal = () => {
        setIsInfoOpen(false);
        setSalePrice('')
        setRegPrice('')
    }


    const pathname = usePathname();
    const splitedPath = pathname.split('/')
    const childSlug = splitedPath[splitedPath.length - 1];
    const handleNavigateToOutlate = () => {
        router.push(`/outlet/${childSlug}`)
    }

    const handleActiveGrid = (grid) => {
        setActiveGrid(grid)
    }

    const { showDeliveryMessage } = useGlobalContext();
    const lastCalRef = useRef()

    useDisableBodyScroll(cartSection, quickViewClicked)


    return (
        <>
            <div ref={lastCalRef} className="activeCategoryPage">
                {lastCallData && <Sliderr images={lastCallData?.data?.mainSlider} />}

                <div className="section_1_ASP">
                    <div className="offer-head-and-grid-select">
                        <h3 className='category-heading'>{lastCallData ? lastCallData?.data?.categoryData?.name : ""}</h3>

                        <div className="offer-grid-main-container">
                            <div className={`offer-single-col-outer-container ${activeGrid === 'single-col' ? 'active-offer-single-col' : ''}`} onClick={() => handleActiveGrid('single-col')}>
                                <div className={`offer-single-col-inner-container ${activeGrid === 'single-col' ? 'active-single-inner-col' : ''}`}></div>
                            </div>
                            <div className={`offer-dual-col-outer-container ${activeGrid === 'dual-col' ? 'active-offer-dual-col-outer' : ''}`}>
                                <div className={`offer-dual-col-grid-container`} onClick={() => handleActiveGrid('dual-col')}>
                                    <div className={`offer-dual-col-inner-container ${activeGrid === 'dual-col' ? 'active-offer-dual-col-inner' : ''}`}></div>
                                    <div className={`offer-dual-col-inner-container ${activeGrid === 'dual-col' ? 'active-offer-dual-col-inner' : ''}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`active-sale-cards increase-columns ${activeGrid === 'single-col' ? 'offer-cards-single-grid' : 'offer-cards-dual-col'}`} >

                        {products && products?.length > 0 ? (
                            products?.map((item, index) => {
                                return <ProductCardTwo
                                    key={index}
                                    slug={item.slug}
                                    singleProductData={item}
                                    maxWidthAccordingToComp={"100%"}
                                    justWidth={'100%'}
                                    colTwo={activeGrid === 'single-col' ? false : true}
                                    tagIcon={item.productTag ? item.productTag : heart}
                                    tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                                    mainImage={`${item.image.image_url}`}
                                    productCardContainerClass="product-card"
                                    ProductSku={item.sku}
                                    tags={item.sale_tag}
                                    ProductTitle={item.name}
                                    reviewCount={item.reviewCount}
                                    lowPriceAddvertisement={item.lowPriceAddvertisement}
                                    priceTag={item.regular_price}
                                    sale_price={item.sale_price}
                                    financingAdd={item.financingAdd}
                                    learnMore={item.learnMore}
                                    mainIndex={index}
                                    deliveryTime={item.deliveryTime}
                                    stock={item.manage_stock}
                                    attributes={item.attributes}
                                    handleCardClick={() => handleProductClick(item)}
                                    handleQuickView={() => handleQuickViewOpen(item)}
                                    handleWishListclick={() => handleWishList(item)}
                                    showOnPage={true}
                                    createdDate={item.createdAt}
                                    showExtraLines={true}
                                    titleHeight={true}
                                    allow_back_order={item?.allow_back_order}
                                    handleInfoModal={() => handleOpennfoModal(item.sale_price, item.regular_price)}
                                    productTag={item.product_tag}
                                />
                            })
                        ) : (
                            Array.from({ length: 12 }).map((_, index) => (
                                <ProductCardShimmer width={'100%'} key={index} />
                            ))
                        )}

                    </div>
                    {totalProducts > 16 && (
                        <div className="active-sale-view-more-button-contianer">
                            <button className="active-sale-view-more-button" onClick={handleNavigateToOutlate}>View More</button>
                        </div>
                    )}

                </div>

                <div className="banner-1-content">
                    <img src={`${url}${lastCallData?.data?.banner1?.desktop?.[0]?.image_url}`} alt="img" />
                </div>

                <div className="content_1_section">
                    <div className="left_side_cont">
                        <div dangerouslySetInnerHTML={{ __html: lastCallData?.data?.content1 || "" }} />
                    </div>
                    <div className="right_side_cont">
                        {lastCallData && (<img src={url + lastCallData?.data?.banner2[0]?.image_url} alt="img" />)}
                    </div>
                </div>

                <Sliderr height={"auto"} images={lastCallData ? lastCallData?.data?.banner3 : []} />
                <div className="section_3_ASP" dangerouslySetInnerHTML={{ __html: lastCallData?.data?.content2 || "" }} />


                {showDeliveryMessage && (
                    <DisableDelivery parentRef={lastCalRef} />
                )}

                <QuickView
                    setQuickViewProduct={quickViewProduct}
                    quickViewShow={quickViewClicked}
                    quickViewClose={handleQuickViewClose}
                />

                <SideCart
                    isCartOpen={cartSection}
                    handleCloseSideCart={handleCartSectionClose}
                />

                <SnakBar
                    message={snakeBarMessage}
                    openSnakeBarProp={showSnakeBar}
                    setOpenSnakeBar={setShowSnakeBar}
                    onClick={handleCloseSnakeBar}
                />

                <ProductInfoModal
                    openModal={isInfoOpen}
                    closeModal={handleCloseInfoModal}
                    salePrice={salePrice}
                    regPrice={regPrice}
                />
            </div>


        </>
    )
}