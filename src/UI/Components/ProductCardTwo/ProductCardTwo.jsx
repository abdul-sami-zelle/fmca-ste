'use client'

import React, { useState, useEffect } from 'react'
import './ProductCardTwo.css';

// Assets and Icons
import { VscHeartFilled } from "react-icons/vsc";
import { VscHeart } from "react-icons/vsc";
import { GoInfo } from "react-icons/go";
import { FaEye } from "react-icons/fa";

// Components
import RatingReview from '../starRating/starRating';
import ProductCardImageShimmer from '../Loaders/CardImageShimmer/cardImageShimmer';

// Default and Hooks
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; // important!
import Link from 'next/link';

// Api's And Context
import { formatedPrice, getAdjustedPrice, url } from '../../../utils/api';
import { useList } from '../../../context/wishListContext/wishListContext';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';


const ProductCardTwo = ({
    productCardContainerClass,
    ProductTitle,
    reviewCount,
    priceTag,
    sale_price,
    tags,
    singleProductData,
    handleQuickView,
    maxWidthAccordingToComp,
    borderLeft,
    justWidth,
    handleWishListclick,
    attributes,
    colTwo,
    showOnPage,
    handleInfoModal,
    showExtraLines,
    titleHeight,
    btnText = 'Quick View',
    isQuickView = false,
    productTag
}) => {



    const [isImageLoaded, setImageLoaded] = useState(false);
    const { isDeliveryAllowed } = useGlobalContext();

    // Product Main Image Show And Hover Image Show states
    const [hoveredImage, setHoveredImage] = useState()
    const [isHovered, setIsHovered] = useState(false);

    // Get Prioraty Attributes
    const getPriorityAttribute = (attributes) => {
        return attributes && attributes?.find(attr => attr.type === "image") ||
            attributes && attributes?.find(attr => attr.type === "color") ||
            attributes && attributes?.find(attr => attr.type === "select");
    };
    const priorityAttribute = getPriorityAttribute(attributes);


    // Get Data According To Variations
    const [selectedColor, setSelectedColor] = useState();
    const [selectedColorImage, setSelectedColorImage] = useState({});
    const [productVariationData, setProductVariationData] = useState();

    // Select Data According to color variation
    const handleColorSelect = (color) => {
        setSelectedColor(color)
        if (singleProductData?.type === "variable") {
            const matchingAttribute = singleProductData?.variations?.find(variation =>
                variation?.attributes?.some(attribute =>
                    attribute?.type === "color" &&
                    attribute?.options?.some(option => option?.value === color)
                )
            );
            setProductVariationData(matchingAttribute)
            setSelectedColorImage(matchingAttribute?.image?.image_url)
            setHoveredImage(matchingAttribute?.images[1]?.image_url)
            return matchingAttribute;

        } else if (singleProductData?.type === "simple") {
            // Handle simple product logic
            const simpleAttribute = singleProductData?.attributes?.find(attribute =>
                attribute?.type === "color"
            );


            if (simpleAttribute) {
                setSelectedColorImage(singleProductData?.image?.image_url);
                setHoveredImage(singleProductData?.images[1]?.image_url);
            }
            return simpleAttribute;
        }

    }

    // Select Data According to image Variation
    const handleImageSelect = (image) => {
        if (singleProductData?.type === "variable") {
            const matchingAttribute = singleProductData?.variations?.find(variation =>
                variation?.attributes?.some(attribute =>
                    attribute?.type === "image" &&
                    attribute?.options?.some(option => option?.value === image)
                )
            );
            setSelectedColorImage(matchingAttribute?.image?.image_url)
            setHoveredImage(matchingAttribute?.images[1]?.image_url)
            return matchingAttribute;
        } else if (singleProductData?.type === "simple") {
            const simpleAttribute = singleProductData?.attributes?.find(attribute =>
                attribute?.type === "image"
            );
            setSelectedColorImage(singleProductData?.image?.image_url);
            setHoveredImage(singleProductData?.images[1]?.image_url);
            return simpleAttribute;
        }
    }



    const moveToFirst = (array, defValue) => {
        const index = array?.findIndex(item => item === defValue);
        if (index > 0) {
            const [priorityItem] = array?.splice(index, 1);
            array.unshift(priorityItem)
        }
        return array;
    }

    // Run Update Data According to Attribute Select Every Time
    useEffect(() => {
        if (singleProductData?.type === "variable") {
            // Find the default variation
            const defAttImage = singleProductData?.variations?.find(attr =>
                attr?.uid === singleProductData?.default_variation
            );

            // Get the default color
            const defAttrColor = defAttImage?.attributes?.find(attribute =>
                attribute?.type === "color" &&
                attribute?.options?.some(option => option?.value)
            );

            const defaultColor = defAttrColor?.options?.[0]?.value;

            // Automatically select the default color
            if (defaultColor) {
                handleColorSelect(defaultColor);
            }

            // Handle prioritized attributes for variable products
            const attributes = defAttImage?.attributes;
            if (attributes) {
                const defaultAttribute = getPriorityAttribute(attributes);
                if (defaultAttribute) {
                    const updatedAttributes = moveToFirst(attributes, defaultAttribute);
                }
            }

        } else if (singleProductData?.type === "simple") {
            // For simple products, select the only color available
            const simpleColorAttribute = singleProductData?.attributes?.find(attribute =>
                attribute?.type === "color"
            );

            const defaultColor = simpleColorAttribute?.options?.[0]?.value;

            if (defaultColor) {
                handleColorSelect(defaultColor);
            }
        }

    }, [singleProductData]);

    // Check Wishlist and Add
    const { isInWishList } = useList();

    // Formate Delivery Date
    const getDeliveryDate = () => {
        const options = { weekday: "long", month: "short", day: "numeric" };
        const today = new Date();

        const optionWithTimeZone = { ...options, timeZone: "America/New_York" };

        today.setDate(today.getDate() + 3);
        return today.toLocaleDateString("en-us", optionWithTimeZone);
    }

    // Check for out of stock
    const [isOutOfStock, setIsOutOfStock] = useState(false);
    useEffect(() => {
        if (!singleProductData) return;

        const outOfStockCheck =
            singleProductData?.type === "variable"
                ? (
                    (productVariationData?.manage_stock?.stock_status === "inStock" &&
                        productVariationData?.manage_stock?.quantity === 0) ||
                    productVariationData?.manage_stock?.stock_status === "outStock" ||
                    productVariationData?.manage_stock?.stock_status === "outOfStock"
                )
                : (
                    (singleProductData?.manage_stock?.stock_status === "inStock" &&
                        singleProductData?.manage_stock?.quantity === 0) ||
                    singleProductData?.manage_stock?.stock_status === "outStock" ||
                    singleProductData?.manage_stock?.stock_status === "outOfStock"
                );

        setIsOutOfStock(outOfStockCheck);
    }, [singleProductData, productVariationData]);


    return (
        <>
            <Link href={`/product/${singleProductData?.slug}`}
                className={`${productCardContainerClass} ${borderLeft ? 'hide-after' : ''} `}
                style={{ maxWidth: maxWidthAccordingToComp, width: justWidth }}

            >
                <div className='product-card-data'>

                    {/* product card top tags and wishlist container */}
                    <div className={`product-cart-top-tags-container ${showOnPage ? 'show-product-cart-top-tags' : ''}`} >

                        {/* Show Tags According To Product */}
                        {
                            // Out of stock Tag
                            isOutOfStock ? (
                                <span
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content="Available in 5 to 6 weeks"
                                    className={`product-archive-out-of-stock-tag ${colTwo ? 'apply-col-two-styling' : ''}`}>Back Order</span>

                            ) : (
                                // Other Tags
                                <div className={`product-tagging`}>
                                    {/* {tags.text === 'FREE DELIVERY' ? (
                                        <div className='text-tag-free-delivery' style={{ backgroundColor: tags?.bg_color, color: tags?.text_color }} >
                                        {tags?.text}
                                    </div>
                                    ) : (
                                       <div className='text-tag' style={{ backgroundColor: tags?.bg_color, color: tags?.text_color }} >
                                        {tags?.text}
                                    </div> 
                                    )} */}
                                    <div className='text-tag' style={{ backgroundColor: tags?.bg_color, color: tags?.text_color }} >
                                        {tags?.text}
                                    </div>

                                    {(!colTwo && showExtraLines) && <div className='text-tag extra_tag'
                                        style={{
                                            backgroundColor: productTag?.bg_color,
                                            color: productTag?.text_color,
                                            borderRadius: "3px",
                                            fontWeight:"600"
                                        }}
                                    // style={{
                                    //     "--bg": productTag?.bg_color,
                                    //     "--text": productTag?.text_color,
                                    //     borderRadius: "3px"
                                    // }}
                                    >
                                        {productTag?.text}
                                    </div>}
                                </div>

                            )
                        }

                        {/* Wishlist add and remove */}
                        <div className={`product-wishlist-icon-container`}>

                            {
                                isInWishList(singleProductData?._id) ?
                                    <VscHeartFilled
                                        // size={25}
                                        className={`wishlist-heart ${colTwo ? 'small-heart' : ''}`}
                                        style={{ color: 'var(--orange-fill)' }}
                                        stroke='var(--orange-outline)'
                                        onClick={(e) => {
                                            e.stopPropagation();      // stop event bubbling to <Link>
                                            e.preventDefault();
                                            handleWishListclick(singleProductData)
                                        }}
                                    />
                                    :
                                    <VscHeart
                                        // size={25}
                                        className={`wishlist-heart ${colTwo ? 'small-heart' : ''}`}
                                        style={{ float: 'right', color: 'var(--orange-fill)' }}
                                        onClick={(e) => {
                                            e.stopPropagation();      // stop event bubbling to <Link>
                                            e.preventDefault();
                                            handleWishListclick(singleProductData)
                                        }}
                                    />
                            }
                        </div>

                    </div>

                    {/* Product Main Image Container */}
                    <div className='product-main-image-container'>

                        <div
                            className='product-card-product-image-inner-container'
                            onMouseEnter={() => { setIsHovered(true) }}
                            onMouseLeave={() => { setIsHovered(false) }}
                        >



                            {/* Product Main Image */}
                            {selectedColorImage && (
                                <img
                                    src={singleProductData.outSource === true ? singleProductData.image.image_url : `${url}${selectedColorImage}`}
                                    alt='product img'
                                    className={`product-main-img ${colTwo ? 'set-static-height' : ''}`}
                                    effect='blur'
                                    onLoad={() => setImageLoaded(true)}
                                />
                            )}

                            {/* Product Hoverd Image */}
                            {hoveredImage && (
                                <img
                                    src={singleProductData.outSource === true ? hoveredImage : `${url}${hoveredImage}`}
                                    alt='product img'
                                    className={`hovered-product-main-img ${isHovered ? 'visible-hovered' : ''}`}
                                    effect='blur'
                                    onLoad={() => { setImageLoaded(true) }}
                                />
                            )}

                            {/* Product Image Shimmer till image Load */}
                            {
                                !isImageLoaded && <div className={`image_shimmer_loader ${colTwo ? 'image-shimmer-loader-dual-col' : ''}`}>
                                    <ProductCardImageShimmer />
                                </div>
                            }


                        </div>

                        {/* Product Name and Attributes */}
                        <div className='product-card-inner-content-container'>

                            {/* Product Name */}
                            <div className='product-card-main-heading-container'>
                                <h3 className={`product-title ${colTwo ? 'apply-col-two-styling' : ''} ${titleHeight ? "heighted" : ""}`}> {ProductTitle} </h3>
                            </div>

                            {/* Desktop Attributes like image color  */}
                            {priorityAttribute && (
                                <div className={`product-card-attr ${colTwo ? 'hide-squire-attribute' : ''}`} >

                                    {/* Image Attribute if available */}
                                    {priorityAttribute?.type === "image" && (
                                        <div className="image-variation">
                                            {priorityAttribute?.options?.map((item, index) => (
                                                <img
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.stopPropagation();      // stop event bubbling to <Link>
                                                        e.preventDefault();
                                                        handleImageSelect(item.value)
                                                    }}
                                                    src={singleProductData.outSource === true ? item.value : url + item.value}
                                                    alt=""
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Color Attribute */}
                                    {priorityAttribute?.type === "color" && (
                                        <div className="color-variation-div">
                                            {priorityAttribute?.options?.map((item, index) => (
                                                <span
                                                    key={index}
                                                    className={`color-variation ${selectedColor === item.value ? 'show-tick-mark' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();      // stop event bubbling to <Link>
                                                        e.preventDefault();
                                                        handleColorSelect(item.value)
                                                    }}
                                                    style={{
                                                        backgroundColor: item.value,
                                                        border: selectedColor === item.value ? `1px solid ${item.value}` : 'none',
                                                        boxShadow: selectedColor === item.value ? `inset 0 0 0 2px #FFFF` : '',
                                                        "--tick-color": item.value

                                                    }}
                                                ></span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Variation Select Attribute */}
                                    {priorityAttribute?.type === "select" && (
                                        <div className="text-variation">
                                            {priorityAttribute?.options?.map((item, index) => (
                                                <p key={index} className="attr-var">{item.value}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Attributes For Mobile View */}
                            {priorityAttribute && (
                                <div className={`mobile-product-card-attr ${colTwo ? 'show-rounded-attributes' : ''}`} >

                                    {/* Mobile Image Attribute if available */}
                                    {priorityAttribute?.type === "image" && (
                                        <div className="mobile-image-variation">
                                            {priorityAttribute?.options?.map((item, index) => (
                                                <img
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.stopPropagation();      // stop event bubbling to <Link>
                                                        e.preventDefault();
                                                        handleImageSelect(item.value)
                                                    }}
                                                    src={url + item.value}
                                                    alt=""
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Mobile Color Attribute if available */}
                                    {priorityAttribute?.type === "color" && (
                                        <div className="mobile-color-variation-div">
                                            {priorityAttribute?.options?.map((item, index) => (
                                                <span
                                                    key={index}
                                                    className={`mobile-color-variation ${selectedColor === item.value ? 'show-tick-mark' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();      // stop event bubbling to <Link>
                                                        e.preventDefault();
                                                        handleColorSelect(item.value)
                                                    }}
                                                    style={{
                                                        backgroundColor: item.value,
                                                        border: selectedColor === item.value ? `1px solid ${item.value}` : 'none',
                                                        boxShadow: selectedColor === item.value ? `inset 0 0 0 2px #FFFF` : ''
                                                    }}
                                                ></span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Mobile Select Attribute if available */}
                                    {priorityAttribute.type === "select" && (
                                        <div className="mobile-text-variation">
                                            {priorityAttribute?.options?.map((item, index) => (
                                                <p key={index} className="mobile-attr-var">{item.value}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                    </div>

                    <div className='product-card-content-bottom-section'>

                        {/* Monbile View Tag */}
                        {(colTwo || !showExtraLines) && <div className='text-tag-free-delivery'
                            //    style={{
                            //                     "--bg": productTag?.bg_color,
                            //                     "--text": productTag?.text_color,
                            //                     borderRadius: "3px",
                            //                      marginTop: showExtraLines ? "5px" : "10px" 
                            //                 }}
                            style={{
                                backgroundColor: productTag?.bg_color,
                                color: productTag?.text_color,
                                borderRadius: "3px",
                                marginTop: showExtraLines ? "5px" : "10px" ,
                                fontWeight:"600"
                            }}
                        >
                            {productTag?.text}
                        </div>}

                        {/* Product Price and Get it by time contianer */}
                        <div className={`product-card-get-it-by-container ${colTwo ? 'apply-col-two-styling' : ''}`} style={{
                            alignItems: !showExtraLines ? "start" : "start"
                        }}>

                            <div className={`product-get-it-by-left-side ${colTwo ? 'apply-col-two-styling' : ''}`}>

                                <div className='product-card-rating-and-price'>


                                    {/* Product Price Set */}
                                    {
                                        // If No Sale Price
                                        sale_price === "" ?
                                            <h3 className={`product-regular-price  ${colTwo ? 'apply-col-two-styling' : ''}`}>
                                                <p className='regular-price-starting-at'>Starting at</p>
                                                {formatedPrice(priceTag)}
                                            </h3> :
                                            <div className={colTwo ? 'price-and-rating-column-direction' : 'price-and-rating-container'}>
                                                <h3 className={`product-price-tag ${colTwo ? 'apply-col-two-styling' : ''}`}>
                                                    <p className={`product-price-starting-at ${colTwo ? 'apply-two-col-styling' : ''}`}>Starting at</p>
                                                    {formatedPrice(sale_price)}
                                                    <del className={`product-del-price-with-sale-price  ${colTwo ? 'apply-col-two-styling' : ''}`}>{formatedPrice(priceTag)}</del>

                                                </h3>
                                                <div className={`mobile-view-rating-stars ${colTwo ? 'apply-two-col-styling' : ''}`}>
                                                    <RatingReview rating={reviewCount} size={"12px"} disabled={true} />
                                                </div>
                                            </div>
                                    }

                                    {/* Get it by according to sale and regular price */}
                                    <span className={`product-card-installment-plan ${showExtraLines ? 'show-installment-plan' : ''}`}>
                                        <p className={`installment-plan-detail ${colTwo ? 'apply-col-two-styling' : ''}`}>or ${sale_price === "" ? getAdjustedPrice(priceTag) : getAdjustedPrice(sale_price)}/week for 12 months</p>
                                        <GoInfo
                                            color='#595959'
                                            onClick={(e) => {
                                                e.stopPropagation();      // stop event bubbling to <Link>
                                                e.preventDefault();
                                                handleInfoModal()
                                            }}
                                        />
                                    </span>

                                    <span className={`product-card-get-it-by ${showExtraLines ? 'show-set-it-by' : 'hide-get-it-by'}`}>
                                        <p>Get it by</p>
                                        <h3>{getDeliveryDate()}</h3>
                                    </span>

                                </div>
                            </div>

                            {/* Quick View and rating container */}
                            <div className={`product-card-quick-view-container ${colTwo ? 'apply-col-two-styling' : ''}`}>

                                {/* Rating Contianer */}
                                <div className={`product-rating-stars-div ${colTwo ? 'apply-col-two-styling' : ''} ${!showExtraLines ? 'hide-stars-marg' : ''}`}>
                                    <RatingReview rating={reviewCount} size={"12px"} disabled={true} />
                                </div>

                                {/* Get it by on other view */}
                                <span className={`product-card-get-it-by-title ${showExtraLines ? 'show-product-card-get-it-by-title' : ''}`}>
                                    <p className={`get-it-by ${colTwo ? 'apply-col-two-styling' : ''}`}>Get it By</p>
                                    <h3 className={`get-by-delivery ${colTwo ? 'apply-col-two-styling' : ''}`}>{getDeliveryDate()}</h3>
                                </span>

                                <button disabled={isQuickView} style={{ opacity: isQuickView ? 0.4 : 1, cursor: isQuickView ? 'not-allowed' : 'pointer' }} className={`card-two-quick-view-button ${colTwo ? 'apply-col-two-styling' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();      // stop event bubbling to <Link>
                                        e.preventDefault();
                                        handleQuickView()
                                    }}
                                >
                                    {btnText}
                                </button>

                                <FaEye
                                    size={20}
                                    className='quick-view-eye-icon'
                                    onClick={(e) => {
                                        e.stopPropagation();      // stop event bubbling to <Link>
                                        e.preventDefault();
                                        handleQuickView()
                                    }}
                                />

                            </div>

                        </div>
                    </div>
                </div>
            </Link>

            <Tooltip id="my-tooltip" className="custom-tooltip" />
        </>
    )
}

export default ProductCardTwo