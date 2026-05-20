import React, { useState, useEffect } from 'react'
import './MobileCart.css';
import deleteIcon from '../../../../Assets/icons/delete-red.png';
import plusBtn from '../../../../Assets/icons/plus.png';
import minusBtn from '../../../../Assets/icons/minus.png';
import { formatedPrice, url } from '../../../../utils/api';
import { MdDelete } from "react-icons/md";
import { FaPlus, FaMinus } from 'react-icons/fa';
import { IoIosClose } from "react-icons/io";
import ToggleSwitch from '@/Global-Components/ToggleSwitch/ToggleSwitch';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cartContext/cartContext';
import SlimToggler from '@/Global-Components/ToggleSwitch/SlimTogler';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';

const MobileCart = (
    {
        productColor,
        productAccesories,
        productSinglePrice,
        handleRomoveProduct,
        handleIncreament,
        handleDecreament,
        cartIndex,
        quantity,
        productData,
        isProtected,
        removeProtection,
        addProtection,
    }) => {

    const {
        eachProtectionValue,
        eachProtectionValue2,
        isCartProtected,
        cartProducts,
    } = useCart()

    const {isDeliveryAllowed} = useGlobalContext()

    const [isProtectionClicked, setIsProtectionClicked] = useState(isProtected === 0 ? "no-thanks" : "yes-protect");
    const handleProtectOrNotButtonClicked = (value) => {
        setIsProtectionClicked((prevValue) => prevValue === value ? null : value)
    }

    

    const productTotalPrice = productData?.sale_price !=="" ?  (productData.sale_price * quantity) :  (productData.regular_price * quantity);

    return (
        <div className='mobile-cart'>
            <button className='mobile-delete-product' onClick={() => handleRomoveProduct(cartIndex)}>
                {/* <img src={'/Assets/icons/delete-red.png'} alt='delete icon' /> */}
                <IoIosClose size={20} color='var(--text-gray)' />
            </button>
            <h3 className='mobile-priduct-name'>{productData.name}</h3>
            <div className='mobile-cart-product-image-and-containt'>
                <img src={productData.outSource === true ? productData.image.image_url : `${url}${productData.image.image_url}`} alt='product-image' className='mobile-cart-product-main-image' />
                <div className='mobile-cart-product-containt'>
                    <p>{productColor}</p>
                    <p>{productAccesories}</p>
                    <p>{productData?.sale_price !=="" ? formatedPrice(productData.sale_price) : formatedPrice(productData.regular_price)}</p>
                    <div className='mobile-cart-product-count-and-total-price'>
                        <div className='mobile-cart-product-count'>
                            <button disabled={isDeliveryAllowed} style={{opacity: isDeliveryAllowed ? 0.4 : 1, cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer'}}  onClick={handleDecreament}>
                                {/* <img src={'/Assets/icons/minus.png'} alt='minus' /> */}
                                <FaMinus size={10} color='var(--text-gray)' />
                            </button>
                            <p style={{opacity: isDeliveryAllowed ? 0.4 : 1, cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer'}}>{quantity}</p>
                            <button disabled={isDeliveryAllowed} style={{opacity: isDeliveryAllowed ? 0.4 : 1, cursor: isDeliveryAllowed ? 'not-allowed' : 'pointer'}} onClick={handleIncreament}>
                                {/* <img src={'/Assets/icons/plus.png'} alt='plus-btn' /> */}
                                <FaPlus size={10} color='var(--text-gray)' />
                            </button>
                        </div>
                        <p> {formatedPrice(productTotalPrice)}</p>
                    </div>
                </div>
            </div>

            <div className='mobile-card-protection-div' >
                <div className='guard-and-heading'>
                    {isDeliveryAllowed && <div className='protection-overlay'></div>}
                    <div className='mobile-guard-title-and-details'>
                        <span>
                            <h3 className='protection-guard-title'>Protection Plan</h3>
                            <p>5 Years Protection $149</p>
                        </span>

                        {cartProducts.is_all_protected === 1 ? <div className="protection-all-protected">
                            <Image src={'/Assets/check.png'} width={50} height={50} alt="" srcset="" />
                            <p>Protection Applied</p>
                        </div>
                            : <div className='mobile-protection-btns-accept-and-cancel'>
                                {isDeliveryAllowed && <div className='mobile-protection-overlay'></div>}
                                <SlimToggler
                                    id={`mobile-protection-toggle-${productData.isVariable === 1 ? productData.variation_uid : productData.product_uid}`}
                                    checked={isDeliveryAllowed ? false : isProtectionClicked === 'yes-protect'}
                                    disabled={isDeliveryAllowed}
                                    onChange={(e) => {
                                        if(isDeliveryAllowed) return
                                        if (isProtectionClicked === 'yes-protect') {
                                            e.stopPropagation();
                                            handleProtectOrNotButtonClicked('no-thanks');
                                            removeProtection();
                                        } else {
                                            e.stopPropagation();
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
    )
}

export default MobileCart
