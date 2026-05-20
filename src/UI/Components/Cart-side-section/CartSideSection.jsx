import React, { useEffect } from 'react'
import './CartSideSection.css';
import { formatedPrice, url } from '../../../utils/api';
import { useCart } from '../../../context/cartContext/cartContext';
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { IoIosClose } from 'react-icons/io';
import Image from 'next/image';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';

const CartSideSection = (
    {
        attributes,
        productData,
        handleItemRemove,
        closeBtn,
        productTitle,
        mainImage,
        sale_price,
        regular_price,
        decreamentQuantity,
        minusBtn,
        quantity,
        increamentQuantity,
        plusBtn,
        sku,
        isProtected
    }) => {
    const { eachProtectionValue, isCartProtected } = useCart();
    const {isDeliveryAllowed} = useGlobalContext()

    const productTotalPrice = sale_price !== "" ? (sale_price * quantity) + (isCartProtected ? 0 : (isProtected === 1 ? eachProtectionValue : 0)) : (regular_price * quantity) + (isCartProtected ? 0 : (isProtected === 1 ? eachProtectionValue : 0));


    return (
        <div className='cart-side-section-product'>
            <button className='cart-side-section-remove-btn' onClick={handleItemRemove}>
                <Image src={'/icons/close-charcoal.svg'} width={10} height={10} alt='close btn' />
            </button>
            {/* <IoIosClose size={25} color='#595959' className='cart-side-section-remove-btn' onClick={handleItemRemove} /> */}
            <div className='cart-side-section-product-item-name'>
                <h3>{productTitle}</h3>
            </div>
            <div className='cart-side-section-product-containt'>
                <div className='cart-side-section-item-image'>
                    <img src={productData.outSource === true ? mainImage?.image_url : `${url}${mainImage?.image_url}`} alt='product image' />
                </div>
                <div className='cart-side-section-product-details'>
                    <div className="attributes_list">
                        <p>SKU: {sku}</p>
                        {attributes && attributes.map((item, index) => {
                            return (
                                <p key={index} >{item?.options[0].name}</p>
                            )
                        })}
                        {sale_price === '' ? (
                            <div className='cart-side-panel-section-price-and-count'>

                                <p> {formatedPrice(regular_price)} </p>
                            </div>
                        ) : (
                            <div className='cart-side-panel-section-price-and-count'>

                                <p> {formatedPrice(sale_price)} </p>
                                <p><del style={{
                                    color: "#989898"
                                }} >{formatedPrice(regular_price)}</del></p>
                            </div>
                        )}

                        {
                            isCartProtected ?
                                <></>
                                :
                                isProtected === 1 ?
                                    <p style={{ fontStyle: "italic" }} > (+${eachProtectionValue}) Protection Plan </p> : <></>
                        }
                    </div>

                    <div className='cart-side-section--item-actual-price'>
                        <div className='cart-side-section-product-count'>
                            <button disabled={isDeliveryAllowed} style={{opacity: isDeliveryAllowed ? 0.4 : 1, cursor: isDeliveryAllowed ? 'not-allowed': 'pointer'}} onClick={quantity === 1 ? handleItemRemove : decreamentQuantity}>
                                {/* <img src={minusBtn} alt='minus' /> */}
                                <FaMinus size={15} />
                            </button>
                            {/* <input type='number' value={quantity} /> */}
                            <p>{quantity}</p>
                            <button disabled={isDeliveryAllowed} style={{opacity: isDeliveryAllowed ? 0.4 : 1, cursor: isDeliveryAllowed ? 'not-allowed': 'pointer'}}  onClick={increamentQuantity}>
                                {/* <img src={plusBtn} alt='plus' /> */}
                                <FaPlus size={15} />
                            </button>
                        </div>
                        <p className='cart-side-section-product-total'>{formatedPrice(productTotalPrice)} </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CartSideSection