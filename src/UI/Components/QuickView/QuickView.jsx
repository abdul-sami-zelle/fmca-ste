'use client'

import React, { useEffect, useState } from 'react'
import './QuickView.css';
import CartSidePannel from '../Cart-side-section/CartSidePannel';
import { useCart } from '../../../context/cartContext/cartContext';
import { formatedPrice, url } from '../../../utils/api';
import QuickViewVariations from '../SizeVariant/QuickViewVariations';
import { VscHeartFilled } from "react-icons/vsc";
import { VscHeart } from "react-icons/vsc";
import { useList } from '../../../context/wishListContext/wishListContext';
import RatingReview from '../starRating/starRating';
import { FaPlus, FaMinus } from 'react-icons/fa';
// Assets
import {
    IoIosArrowDown,
    IoIosClose,
} from "react-icons/io";
import SnakBar from '@/Global-Components/SnakeBar/SnakBar';

import SwiperSlider from '@/UI/Sliders/SwiperSlider/SwiperSlider';
import { useProductPage } from '@/context/ProductPageContext/productPageContext';
import Image from 'next/image';
import SideCart from '../Cart-side-section/SideCart';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';

const QuickView = ({ setQuickViewProduct, quickViewClose, quickViewShow, }) => {
    const {
        addToCart0,
        isCartLoading,
        cartSection,
    } = useCart();

    const {isDeliveryAllowed } = useGlobalContext()

    const [viewDetails, setViewDetails] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [variableProductData, setVariableData] = useState();
    const { selectedVariationData } = useProductPage()

    const handleViewDetails = (index) => {
        setViewDetails(prevIndex => (prevIndex === index ? null : index));
    }

    const [productDetails, setProductDetails] = useState({})
    useEffect(() => {
        setProductDetails({
            collection: setQuickViewProduct?.collectionName ? setQuickViewProduct?.collectionName : '-',
            color: setQuickViewProduct?.default_attributes?.find(item => item.type === 'color')?.options[0]?.name,
            brand: setQuickViewProduct?.brand !== '' ? setQuickViewProduct?.brand : 'Furniture Mecca',
            category: setQuickViewProduct?.categories?.find(item => item.is_main === 1)?.name,
            stock: setQuickViewProduct?.manage_stock?.stock_status?.toLowerCase() === 'instock' ? 'In Stock' : setQuickViewProduct?.manage_stock?.stock_status?.toLowerCase() === 'backorder' ? 'Back Order' : 'Back Order',
            mpn: setQuickViewProduct?.mpn,
            gtin: setQuickViewProduct?.gtin,
            protection: 'Available'
        })
    }, [setQuickViewProduct])

    const quickViewData = [
        {
            name: "Dimensions",
        },
        {
            name: 'Description',
            para: setQuickViewProduct.description,
        },
        {
            name: 'Details',
            para: [
                { id: 1, name: 'Collection', val: productDetails?.collection },
                { id: 2, name: 'Color', val: productDetails?.color },
                { id: 3, name: 'Brand', val: productDetails?.brand },
                { id: 4, name: 'Category', val: productDetails?.category },
                { id: 4, name: 'Stock', val: productDetails?.stock },
                { id: 4, name: 'MPN', val: productDetails?.mpn },
                { id: 4, name: 'GTIN', val: productDetails?.gtin },
                { id: 4, name: 'Protection Plan', val: productDetails?.protection },
            ]
        },
    ]

    const handleAddToCartProduct = (product) => {
        addToCart0(product, variableProductData, 0, quantity)
    }

    const [quantity, setQuantity] = useState(1)
    useEffect(() => {
        quickViewClose();
        setQuantity(1)
    }, [cartSection])


    const increaseLocalQuantity = () => {
        if(quantity < 10) {
            setQuantity(quantity + 1);
        }
    }
    const decreaseLocalQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    const [selectedVariationUid, setSelectedVariationUid] = useState(null);
    const handleVariationSelected = (uid) => {
        setSelectedVariationUid(uid);
    };

    useEffect(() => {
        const searchProductInVariation = setQuickViewProduct?.variations?.find((item) => item.uid === selectedVariationUid)
        setVariableData(searchProductInVariation);
    }, [selectedVariationUid])

    // wish list 
    const { addToList, removeFromList, isInWishList } = useList()
    const [snakeBarMessage, setSnakBarMessage] = useState();
    const [showSnakeBar, setShowSnakeBar] = useState(false)

    const handleWishList = (item) => {
        if (isInWishList(item.uid)) {
            removeFromList(item.uid);
            setShowSnakeBar(true);
            setSnakBarMessage("Product Removed From Wishlist");


        } else {
            addToList(item)
            setShowSnakeBar(true);
            setSnakBarMessage("Product Added To Wishlist");

        }
    }

    const handleCloseSnakeBar = () => {
        setShowSnakeBar(false)
    }

    const stockCheck = setQuickViewProduct?.type === 'variable' ?
        selectedVariationData?.manage_stock?.stock_status === 'inStock'
        && selectedVariationData?.manage_stock?.quantity === 0
        || selectedVariationData?.manage_stock?.stock_status === 'outStock'
        || selectedVariationData?.manage_stock?.stock_status === 'outOfStock'
        : setQuickViewProduct?.manage_stock?.stock_status === 'inStock'
        && setQuickViewProduct?.manage_stock?.quantity === 0
        || setQuickViewProduct?.manage_stock?.stock_status === 'outStock'
        || setQuickViewProduct?.manage_stock?.stock_status === 'outOfStock';

    return (
        <div className={`quick-view-main-container ${quickViewShow ? 'show-quick-view-modal' : ''}`} onClick={quickViewClose}>
            <div
                className={`quick-view-main ${quickViewShow ? 'slide-quick-view-inner-modal' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button className='quick-view-close-modal-button' onClick={quickViewClose}>
                    <Image src={'/icons/close-charcoal.svg'} width={15} height={15} alt='close' />
                </button>

                <div className='quick-view-heading-and-rating'>
                    <h3>{setQuickViewProduct.name}</h3>
                    <div className='quick-view-rating'>
                        <div className='quick-view-start'>
                            <RatingReview rating={parseFloat(setQuickViewProduct?.average_rating)} size={"12px"} disabled={true} />

                        </div>

                    </div>
                </div>

                <div className='quick-view-image-and-variations'>


                    <div className="quick-view-slider">


                        <div className="quick-view-slider-container">
                            {setQuickViewProduct?.type === "simple" ?
                                <div
                                    className="quick-view-slider-wrapper"
                                >

                                    <SwiperSlider
                                        slidesData={setQuickViewProduct.images && setQuickViewProduct.images}
                                        renderSlide={(image, index) => (
                                            <img key={index} src={setQuickViewProduct.outSource === true ? image.image_url : `${url}${image.image_url}`} alt={`Slide ${index + 1}`} />
                                        )}
                                        showDots={true}
                                        showArrows={false}
                                        spaceBetween={20}
                                        slidesPerView={1}
                                    />
                                </div>
                                :


                                <div className="quick-view-slider-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>

                                    <SwiperSlider
                                        slidesData={setQuickViewProduct.images && setQuickViewProduct.images}
                                        renderSlide={(image, index) => (

                                            <img key={index} src={setQuickViewProduct.outSource === true ? image.image_url : `${url}${image.image_url}`} alt={`Slide ${index + 1}`} />
                                        )}
                                        showDots={true}
                                        showArrows={false}
                                        spaceBetween={20}
                                        slidesPerView={1}
                                    />
                                </div>
                            }
                        </div>
                    </div>


                    <div className='quick-view-variations'>
                        <QuickViewVariations default_uid={setQuickViewProduct.default_uid} attributes={setQuickViewProduct.attributes} productData={setQuickViewProduct} variations={setQuickViewProduct.variations} onChangeVar={handleVariationSelected} />
                    </div>
                </div>
                {setQuickViewProduct.type === "simple" ? <>
                    {
                        setQuickViewProduct.sale_price === "" ?
                            <h3 className='quick-view-product-price-tag'>{formatedPrice(setQuickViewProduct.regular_price)}</h3> :
                            <h3 className='quick-view-product-price-tag'>  {formatedPrice(setQuickViewProduct.sale_price)} <del>{formatedPrice(setQuickViewProduct.regular_price)}</del>  </h3>
                    }
                </> :
                    <>
                        {
                            variableProductData?.sale_price === "0" ?
                                <h3 className='-quick-view-product-price-tag'>{formatedPrice(variableProductData?.regular_price)}</h3> :
                                <h3 className='quick-view-product-price-tag'>  {formatedPrice(variableProductData?.sale_price)} <del>{formatedPrice(variableProductData?.regular_price)}</del> </h3>
                        }
                    </>}
                <div className='quick-view-add-item-or-cart-btn'>
                    <div className='quick-view-add-or-minus-item'>
                        <button disabled={stockCheck || isDeliveryAllowed} className={stockCheck || isDeliveryAllowed ? 'disable-quick-view-quantity' : ''} onClick={decreaseLocalQuantity}>
                            <FaMinus className='quick0view-minus' size={12} color='#595959' />
                        </button>
                        <input
                            type='number'
                            value={quantity}
                            className={stockCheck || isDeliveryAllowed ? 'disable-quick-view-quantity' : ''}
                            readOnly
                            // onChange={(e) => setQuantity(e.target.value)} 
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value >= 1) {
                                    setQuantity(value);
                                }
                            }}

                        />
                        <button disabled={stockCheck || isDeliveryAllowed} className={stockCheck || isDeliveryAllowed ? 'disable-quick-view-quantity' : ''} onClick={increaseLocalQuantity}>
                            <FaPlus className='quick-view-plus' size={12} color='#595959' />
                        </button>
                    </div>
                    <div className='quick-view-wish-list-container'>
                        {
                            isInWishList(setQuickViewProduct.uid) ?
                                <VscHeartFilled
                                    size={20}
                                    style={{ color: 'var(--orange-fill)', stroke: 'var(--orange-outline)' }}
                                    stroke='var(--orange-outline)'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWishList(setQuickViewProduct)
                                    }}
                                />
                                :
                                <VscHeart
                                    size={20}
                                    style={{ color: 'var(--orange-outline)' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleWishList(setQuickViewProduct)
                                    }}
                                />
                        }
                    </div>
                    <button disabled={stockCheck || isDeliveryAllowed} className={`quick-view-add-to-cart ${stockCheck || isDeliveryAllowed ? 'disable-quick-view-add-to-cart' : ''}`} onClick={() => handleAddToCartProduct(setQuickViewProduct)}>
                        {isCartLoading && <div className="loader_2"></div>}
                        {isCartLoading ? ' Almost there...' : 'Add To Cart'}
                    </button>
                </div>
                <div className="quick-view-details-section">
                    {quickViewData?.map((items, index) => {
                        const isDimensionSection = items.name === "Dimensions";
                        const hasDimensionImage = setQuickViewProduct?.dimension_image;
                        const hasWeightDimension = setQuickViewProduct?.weight_dimension;
                        const shouldSetHeight = isDimensionSection && !hasDimensionImage && !hasWeightDimension;

                        return (
                            <div key={index} className="quick-view-detail-single-section">
                                <div className="quick-view-details-heading" onClick={() => handleViewDetails(index)}>
                                    <p>{items.name}</p>
                                    <button>
                                        <IoIosArrowDown
                                            className={viewDetails === index ? "quick-view-rotate-up" : "quick-view-rotate-down"}
                                            size={20}
                                            color="var(--secondary-color)"
                                        />
                                    </button>
                                </div>
                                <div
                                    className={`quick-view-details ${viewDetails === index ? "show-details" : ""}`}
                                    style={shouldSetHeight ? { height: "120px !important" } : {}}
                                >
                                    {items?.name === "Description" ? (
                                        <p dangerouslySetInnerHTML={{ __html: items.para }} />
                                    ) : isDimensionSection ? (
                                        <div className='dimension-views'>
                                            {hasDimensionImage ? (
                                                <img
                                                    src={url + setQuickViewProduct.dimension_image.image_url}
                                                    className="quick-view-dimension-image"
                                                    alt="dimension"
                                                />
                                            ) : null}
                                            {hasWeightDimension ? (
                                                <p dangerouslySetInnerHTML={{ __html: setQuickViewProduct.weight_dimension }} />
                                            ) : null}
                                            {!hasDimensionImage && !hasWeightDimension ? <p>No dimensions available</p> : null}
                                        </div>
                                    ) : (
                                        <div className="quick-view-drop-down-dimension-data">
                                            {items.para.map((item, index) => (
                                                <span key={index}>
                                                    <h3>{item.name}</h3>
                                                    <p>{item.val}</p>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            <SnakBar
                message={snakeBarMessage}
                openSnakeBarProp={showSnakeBar}
                setOpenSnakeBar={setShowSnakeBar}
                onClick={handleCloseSnakeBar}
            />
        </div>


    )
}

export default QuickView
