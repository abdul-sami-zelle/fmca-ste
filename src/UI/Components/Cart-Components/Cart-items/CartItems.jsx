import React, { useState } from 'react'
import './CartItems.css';
import { formatedPrice, url } from '../../../../utils/api';
import Link from 'next/link';
import { useCart } from '@/context/cartContext/cartContext';

// Assets
import { useList } from '@/context/wishListContext/wishListContext';
import { FaArrowsRotate } from "react-icons/fa6";
import ToggleSwitch from '../../../../Global-Components/ToggleSwitch/ToggleSwitch';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { IoIosClose } from "react-icons/io";
import Image from 'next/image';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';

const CartItems = ({
    cartProductName,
    cartPRoductImage,
    cartProductColor,
    cartProductTitle,
    isCartOpen,
    productData,
    quantity,
    handleRomoveProduct,
    cartIndex,
    sku,
    handleIncreament,
    handleDecreament,
    attributes,
    sale_price,
    regular_price,
    isProtected,
    removeProtection,
    addProtection,
    totalProducts
}) => {

    // States and variables
    const {
        eachProtectionValue,
        eachProtectionValue2,
        isCartProtected,
        cartProducts,
    } = useCart()

    const {isDeliveryAllowed} = useGlobalContext()

    const [saveForLeter, setSaveForLeter] = useState(false)

    const formatedSalePrice = Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'USD'
    }).format(sale_price)

    const formatedRegularPrice = Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'USD'
    }).format(regular_price)

    const productTotalPrice = sale_price !== "" ? (sale_price * quantity) + (isCartProtected ? 0 : (isProtected === 1 ? (quantity > 1 ? eachProtectionValue2 : eachProtectionValue) : 0)) : (regular_price * quantity) + (isCartProtected ? 0 : (isProtected === 1 ? (quantity > 1 ? eachProtectionValue2 : eachProtectionValue) : 0));

    const formatedTotalPrice = Intl.NumberFormat('en-us', {
        style: 'currency',
        currency: 'USD'
    }).format(productTotalPrice)


    

    const [isProtectionClicked, setIsProtectionClicked] = useState(isProtected === 0 ? "no-thanks" : "yes-protect");
    const handleProtectOrNotButtonClicked = (value) => {
        setIsProtectionClicked((prevValue) => prevValue === value ? null : value)
    }

    const [isOpen, setIsOpen] = React.useState(false);

    const { addToList, removeFromList, isInWishList } = useList()
    const handleWishList = (item) => {

        if (isInWishList(item?.product_uid)) {
            removeFromList(item?.product_uid)
        } else {
            addToList(item)
            handleRomoveProduct();
        }
    }

    return (
        <>

            

            {/* Desktop view Card */}
            <div className={`desktop-cart-product`} style={{ borderBottom: totalProducts > 1 ? '1px solid #d7d7d7' : 'none' }} >

                <div className='desktop-cart-product-image'>
                    <Image src={productData.outSource === true ? cartPRoductImage : `${url}${cartPRoductImage}`} width={200} height={125} alt='product image' />
                </div>

                <div className='desktop-cart-containt-section'>
                    <div className='desktop-cart-content-section-one'>
                        <button className={`cross-btn ${isCartOpen ? 'hide-cross-btn' : ''}`} onClick={handleRomoveProduct}>
                            {/* <IoIosClose color='var(--text-gray)' size={30} /> */}
                            <Image src={'/icons/close-charcoal.svg'} width={15} height={15} alt='close' />
                        </button>
                        <button className='save-for-leter' onClick={(e) => { e.stopPropagation(); handleWishList(productData) }}>
                            <FaArrowsRotate color='var(--secondary-color)' size={15} />
                            Save For Later
                        </button>
                        <div className='desktop-name-and-single-price'>
                            <h3>{cartProductName}</h3>
                            <p className='cart-item-sku-tag'>SKU: {productData?.sku}</p>
                            {attributes && attributes.map((item, index) => {
                                return (
                                    <p key={index} className='desktop-product-extra-info'>{item?.options[0].name}</p>
                                )
                            })}
                            <div className='cart-side-section-price-and-count'>
                                {sale_price !== "" ? (
                                    <span>
                                        <p>{formatedSalePrice}</p>
                                        <p><del style={{
                                            color: "var(--secondary-color)", opacity: 0.8
                                        }} >{formatedRegularPrice}</del></p>
                                    </span>
                                ) : (
                                    <p>{formatedRegularPrice}</p>
                                )}


                            </div>



                        </div>


                        <div className={`desktop-total-price-and-remove-item ${isCartOpen ? 'hide-total-and-remove-item' : ''}`}>

                            <div className='desktop-quantity'>
                                <button disabled={isDeliveryAllowed} style={{opacity: isDeliveryAllowed ? 0.4 : 1 , cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer'}} className='cart-minus-button' onClick={handleDecreament}>
                                    <FaMinus className='cart-minus-icon' size={15} color='#595959' />
                                </button>
                                <p className='cart-product-quantity'>{quantity}</p>
                                <button disabled={isDeliveryAllowed} style={{opacity: isDeliveryAllowed ? 0.4 : 1 , cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer'}} className='cart-plus-button' onClick={handleIncreament}>
                                    <FaPlus className='cart-plus-icon' size={15} color='#595959' />
                                </button>
                            </div>

                            <p className='cart-product-card-total-price'>{formatedTotalPrice}</p>
                            {(cartProducts.is_all_protected === 1 || isProtected === 1) && (
                                <span className='single-product-protection-plan-details'>
                                    <p>5 Year Protection</p>
                                    <p>Plan Added</p>
                                    <p>{formatedPrice(eachProtectionValue)}</p>
                                </span>
                            )}

                        </div>

                        <div className={isCartOpen ? 'cart-open-quantity-and-total-price' : 'cart-close-quantity-and-total-price'}>
                            <div className='desktop-quantity'>
                                <button disabled={isDeliveryAllowed} style={{opacity: isDeliveryAllowed ? 0.4 : 1 , cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer'}} className='cart-minus-button' onClick={handleDecreament}>
                                    <FaMinus className='cart-minus-icon' size={15} color='#595959' />
                                </button>
                                <p>{quantity}</p>
                                <button disabled={isDeliveryAllowed} style={{opacity: isDeliveryAllowed ? 0.4 : 1 , cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer'}} className='cart-plus-button' onClick={handleIncreament}>
                                    <FaPlus className='cart-plus-icon' size={15} color='#595959' />
                                </button>
                            </div>
                            <p className='cart-open-total-price'>{formatedTotalPrice}</p>
                        </div>
                    </div>
                    <div className='desktop-cart-product-content-section-two'>
                        <div className='desktop-card-protection-div'>
                            {isDeliveryAllowed && <div className='protect-single-product-overlay'></div>}
                            <div className='guard-and-heading'>
                                <Image effect='blur' src={'/Assets/icons/guard-icon.png'} width={50} height={50} alt='guard' className='protection-guard-icon' />
                                <div className='guard-title-and-details'>
                                    <div className='guard-title-and-details-head'>
                                        <h3 className='protection-guard-title'>Furniture Premium</h3>
                                    </div>
                                    <span className='protection-details-and-message'>
                                        <p className='protection-price-message'>
                                            Protection Plan
                                            {/* {(cartProducts.is_all_protected === 1 || isProtected === 1) ? "Price shown in summary" : "$149"} */}
                                        </p>
                                        <div className={`detail-container ${isOpen ? 'open' : ''}`}>
                                            <p className='protection-price-message detail'>
                                                Our Premium Furniture Protection Plan covers accidental stains and damage to your new fabric, leather, and wood (and other hard surfaces) furniture.
                                            </p>
                                            <Link href={'#'}>Details</Link>
                                        </div>
                                    </span>
                                </div>
                            </div>

                            {cartProducts.is_all_protected === 1 ? <div className="protection-all-protected">
                                <Image src={'/Assets/check.png'} width={50} height={50} alt="" srcset="" />
                                <p>Protection Applied</p>
                            </div>
                                : <div className='protection-btns-accept-and-cancel'>

                                    

                                    <ToggleSwitch
                                        id={`protection-toggle-${productData.isVariable === 1 ? productData.variation_uid : productData.product_uid}`}
                                        checked={isProtectionClicked === 'yes-protect'}
                                        disabled={isDeliveryAllowed}
                                        onChange={() => {
                                            if(isDeliveryAllowed) return;
                                            if (isProtectionClicked === 'yes-protect') {
                                                handleProtectOrNotButtonClicked('no-thanks');
                                                removeProtection();
                                            } else {
                                                handleProtectOrNotButtonClicked('yes-protect');
                                                addProtection();
                                            }
                                        }}
                                    />
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartItems