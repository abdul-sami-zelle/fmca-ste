// import React from 'react'
// import './SideCart.css'
// import CartSideSection from './CartSideSection';
// // import { useNavigate } from 'react-router-dom';
// import { useCart } from '../../../context/cartContext/cartContext';
// import { formatedPrice } from '@/utils/api';
// import EmptyCart from '../Cart-Components/Empty-Cart/EmptyCart';
// import { useRouter } from 'next/navigation';
// import { IoIosClose } from 'react-icons/io';
// import Image from 'next/image';
// import { useGlobalContext } from '@/context/GlobalContext/globalContext';


// const SideCart = ({ isCartOpen, handleCloseSideCart }) => {

//     const {
//         subTotal,
//         isCartProtected,
//         isProfessionalAssembly,
//         handleCartProtected,
//         handleCartAssembly,
//         cartProducts,
//         isCartLoading,
//         totalProtectionValue,
//         professionalAssemblyValue,
//         decreamentQuantity,
//         increamentQuantity,
//         removeFromCart,
//         addToCart0,
//         cartSection,
//         setCartSection,
//     } = useCart()

//     const router = useRouter()

//     const {isDeliveryAllowed} = useGlobalContext()

//     const handleCLoseCartPanel = () => {
//         // setCartSection(false)
//         handleCloseSideCart()
//         router.push(`/cart`)

//     }

//     const navigateToCheckout = () => {
//         // setCartSection(false)
//         handleCloseSideCart()
//         router.push("/check-out");
//     }


//     return (
//         <div className={`side-cart-main-contianer ${isCartOpen ? 'open-side-cart-overlay' : ''}`} onClick={handleCloseSideCart}>
//             <div className={`side-cart-inner-container ${isCartOpen ? 'show-cart-inner-contianer' : ''}`} onClick={(e) => e.stopPropagation()}>


//                 <div className='side-cart-head'>
//                     <span className='side-cart-bag-contianer'>
//                         <div className='side-cart-bag-and-counter'>
//                             <Image src={'/Assets/icons/cart-bag-new.png'} width={45} height={45} alt='cart-bag' />
//                             {cartProducts?.products?.length > 9 ? (
//                                 <p className='cart-bag-couter'>{cartProducts?.products?.length}</p>
//                             ) : (
//                                 <p className='cart-bag-couter'>0{cartProducts?.products?.length}</p>
//                             )}
//                         </div>
//                         <h3 className='side-cart-your-cart-heading'>Your Cart</h3>
//                     </span>
//                     <button className='side-cart-close-btn' onClick={handleCloseSideCart}>
//                         <IoIosClose size={30} color='#595959' />
//                     </button>
//                 </div>


//                 <div className='side-cart-products-container'>
//                     <div className='side-cart-products-inner-contianer'>
//                         {cartProducts?.products?.length === 0 ? (
//                             <EmptyCart />
//                         ) : (
//                             cartProducts?.products?.map((items, index) => {
//                                 return <CartSideSection
//                                     key={index}
//                                     productData={items}
//                                     attributes={items.attributes}
//                                     handleItemRemove={() => removeFromCart(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
//                                     closeBtn={'/Assets/icons/close-btn.png'}
//                                     sku={items.sku}
//                                     productTitle={items.name}
//                                     mainImage={items.image}
//                                     priceTag={items.regular_price}
//                                     decreamentQuantity={() => decreamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
//                                     minusBtn={'/Assets/icons/minus-white.png'}
//                                     quantity={items.quantity}
//                                     increamentQuantity={() => increamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}

//                                     plusBtn={'/Assets/icons/plus-white.png'}
//                                     sale_price={items.sale_price}
//                                     regular_price={items.regular_price}
//                                     type={items.type}
//                                     isProtected={items.is_protected}
//                                 />
//                             })
//                         )}

//                     </div>
//                 </div>


//                 <div className='side-cart-bottom-container'>


//                     <div className='side-cart-mobile-professional-assembly-contianer'>
//                         {/* {cartProducts?.products?.length > 0 && (
//                             <div className='proffesional-assembly-check-sec'>
//                                 {isDeliveryAllowed && <div className='proffesional-assembly-disable-overlay'></div>}
//                                 <label className='order-summary-proffesional-check-item-label-one'>
//                                     <input
//                                         type="checkbox"
//                                         className='order-summary-checkbox'
//                                         checked={isProfessionalAssembly}
//                                         disabled={isDeliveryAllowed}
//                                         onChange={() => handleCartAssembly()}
//                                     />
//                                     White Glove (+ ${totalProtectionValue})
//                                 </label>
//                                 <p className='order-summary-proffesional-check-item-detail'>Full-service delivery to your room of choice, unpacking, assembly and trash removal. Our most popular option!</p>
//                             </div>
//                         )} */}

//                         {cartProducts?.products?.length > 1 && (
//                             <div className='proffesional-assembly-check-sec'>
//                                 {isDeliveryAllowed && <div className='proffesional-assembly-disable-overlay'></div>}
//                                 <label className='order-summary-proffesional-check-item-label'>
//                                     <input
//                                         type="checkbox"
//                                         className='order-summary-checkbox'
//                                         checked={isCartProtected}
//                                         disabled={isDeliveryAllowed}
//                                         onChange={() => handleCartProtected()}
//                                     />
//                                     Premium Platinum Furniture Protection(+ ${professionalAssemblyValue})
//                                 </label>
//                                 <p className='order-summary-proffesional-check-item-detail'>Our Premium Furniture Protection Plan covers accidental stains and damage to your new fabric, leather, and wood (and other hard surfaces) furniture.</p>
//                             </div>
//                         )}
//                     </div>

//                     <div className='side-cart-desktop-professional-assembly'>
//                         {/* {cartProducts?.products?.length > 0 && (
//                             <div className='proffesional-assembly-check-sec'>
//                                 {isDeliveryAllowed && <div className='proffesional-assembly-disable-overlay'></div>}
//                                 <label className='order-summary-proffesional-check-item-label-one'>
//                                     <input
//                                         type="checkbox"
//                                         className='order-summary-checkbox'
//                                         checked={isProfessionalAssembly}
//                                         disabled={isDeliveryAllowed}
//                                         onChange={() => handleCartAssembly()}
//                                     />
//                                     White Glove (+ ${totalProtectionValue})
//                                 </label>
//                                 <p className='order-summary-proffesional-check-item-detail'>Full-service delivery to your room of choice, unpacking, assembly and trash removal. Our most popular option!</p>
//                             </div>
//                         )} */}

//                         {cartProducts?.products?.length > 1 && (
//                             <div className='proffesional-assembly-check-sec'>
//                                 {isDeliveryAllowed && <div className='proffesional-assembly-disable-overlay'></div>}
//                                 <label className='order-summary-proffesional-check-item-label'>
//                                     <input
//                                         type="checkbox"
//                                         className='order-summary-checkbox'
//                                         checked={isCartProtected}
//                                         disabled={isDeliveryAllowed}
//                                         onChange={() => handleCartProtected()}
//                                     />
//                                     Premium Platinum Furniture Protection(+ ${professionalAssemblyValue})
//                                 </label>
//                                 <p className='order-summary-proffesional-check-item-detail'>Our Premium Furniture Protection Plan covers accidental stains and damage to your new fabric, leather, and wood (and other hard surfaces) furniture.</p>
//                             </div>
//                         )}
//                     </div>

//                     <div className='side-cart-sub-total-contianer'>
//                         <p>Sub Total</p>
//                         <h3>{formatedPrice(subTotal)}</h3>
//                     </div>

//                     <div className='side-cart-navigation-buttons-contianer'>
//                         <button  disabled={isDeliveryAllowed} className={`side-cart-navigate-to-cart`} onClick={handleCloseSideCart}>
//                             Keep Shopping
//                         </button>
//                         <button disabled={isDeliveryAllowed} className={`side-cart-navigate-to-checkout ${isDeliveryAllowed ? 'disable-cart-button' : ''}`} onClick={handleCLoseCartPanel}>
//                             View Cart
//                         </button>
//                     </div>

//                 </div>

//                 {isCartLoading && <div className="side-cart-loader_overlay">
//                     <div className="loader">

//                     </div>
//                 </div>}
//             </div>
//         </div>
//     )
// }

// export default SideCart



import React, { useState, useEffect } from 'react'
import './SideCart.css'
import CartSideSection from './CartSideSection';
import { useCart } from '../../../context/cartContext/cartContext';
import { formatedPrice } from '@/utils/api';
import EmptyCart from '../Cart-Components/Empty-Cart/EmptyCart';
import { useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import Image from 'next/image';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';

const SideCart = ({ isCartOpen, handleCloseSideCart }) => {
    // 1. Introduce an isolation state to track when the client is ready
    const [isMounted, setIsMounted] = useState(false);

    const {
        subTotal,
        isCartProtected,
        isProfessionalAssembly,
        handleCartProtected,
        handleCartAssembly,
        cartProducts,
        isCartLoading,
        totalProtectionValue,
        professionalAssemblyValue,
        decreamentQuantity,
        increamentQuantity,
        removeFromCart,
        addToCart0,
        cartSection,
        setCartSection,
    } = useCart()

    const router = useRouter()
    const { isDeliveryAllowed } = useGlobalContext()

    // 2. Set isMounted to true immediately upon browser execution
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleCLoseCartPanel = () => {
        handleCloseSideCart()
        router.push(`/cart`)
    }

    const navigateToCheckout = () => {
        handleCloseSideCart()
        router.push("/check-out");
    }

    // 3. Helper variable to safely grab the count only when safe to do so
    const productCount = isMounted ? (cartProducts?.products?.length || 0) : 0;

    return (
        <div className={`side-cart-main-contianer ${isCartOpen ? 'open-side-cart-overlay' : ''}`} onClick={handleCloseSideCart}>
            <div className={`side-cart-inner-container ${isCartOpen ? 'show-cart-inner-contianer' : ''}`} onClick={(e) => e.stopPropagation()}>

                <div className='side-cart-head'>
                    <span className='side-cart-bag-contianer'>
                        <div className='side-cart-bag-and-counter'>
                            <Image src={'/Assets/icons/cart-bag-new.png'} width={45} height={45} alt='cart-bag' />
                            
                            {/* 4. Use the mounting guard logic here */}
                            {productCount > 9 ? (
                                <p className='cart-bag-couter'>{productCount}</p>
                            ) : (
                                <p className='cart-bag-couter'>0{productCount}</p>
                            )}
                        </div>
                        <h3 className='side-cart-your-cart-heading'>Your Cart</h3>
                    </span>
                    <button className='side-cart-close-btn' onClick={handleCloseSideCart}>
                        <IoIosClose size={30} color='#595959' />
                    </button>
                </div>

                <div className='side-cart-products-container'>
                    <div className='side-cart-products-inner-contianer'>
                        {/* 5. Protect the inner items from rendering prematurely on server */}
                        {!isMounted || cartProducts?.products?.length === 0 ? (
                            <EmptyCart />
                        ) : (
                            cartProducts?.products?.map((items, index) => {
                                return <CartSideSection
                                    key={index}
                                    productData={items}
                                    attributes={items.attributes}
                                    handleItemRemove={() => removeFromCart(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                                    closeBtn={'/Assets/icons/close-btn.png'}
                                    sku={items.sku}
                                    productTitle={items.name}
                                    mainImage={items.image}
                                    priceTag={items.regular_price}
                                    decreamentQuantity={() => decreamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                                    minusBtn={'/Assets/icons/minus-white.png'}
                                    quantity={items.quantity}
                                    increamentQuantity={() => increamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                                    plusBtn={'/Assets/icons/plus-white.png'}
                                    sale_price={items.sale_price}
                                    regular_price={items.regular_price}
                                    type={items.type}
                                    isProtected={items.is_protected}
                                />
                            })
                        )}
                    </div>
                </div>

                <div className='side-cart-bottom-container'>
                    <div className='side-cart-mobile-professional-assembly-contianer'>
                        {isMounted && cartProducts?.products?.length > 1 && (
                            <div className='proffesional-assembly-check-sec'>
                                {isDeliveryAllowed && <div className='proffesional-assembly-disable-overlay'></div>}
                                <label className='order-summary-proffesional-check-item-label'>
                                    <input
                                        type="checkbox"
                                        className='order-summary-checkbox'
                                        checked={isCartProtected}
                                        disabled={isDeliveryAllowed}
                                        onChange={() => handleCartProtected()}
                                    />
                                    Premium Platinum Furniture Protection(+ ${professionalAssemblyValue})
                                </label>
                                <p className='order-summary-proffesional-check-item-detail'>Our Premium Furniture Protection Plan covers accidental stains and damage to your new fabric, leather, and wood furniture.</p>
                            </div>
                        )}
                    </div>

                    <div className='side-cart-desktop-professional-assembly'>
                        {isMounted && cartProducts?.products?.length > 1 && (
                            <div className='proffesional-assembly-check-sec'>
                                {isDeliveryAllowed && <div className='proffesional-assembly-disable-overlay'></div>}
                                <label className='order-summary-proffesional-check-item-label'>
                                    <input
                                        type="checkbox"
                                        className='order-summary-checkbox'
                                        checked={isCartProtected}
                                        disabled={isDeliveryAllowed}
                                        onChange={() => handleCartProtected()}
                                    />
                                    Premium Platinum Furniture Protection(+ ${professionalAssemblyValue})
                                </label>
                                <p className='order-summary-proffesional-check-item-detail'>Our Premium Furniture Protection Plan covers accidental stains and damage to your new fabric, leather, and wood furniture.</p>
                            </div>
                        )}
                    </div>

                    <div className='side-cart-sub-total-contianer'>
                        <p>Sub Total</p>
                        <h3>{isMounted ? formatedPrice(subTotal) : '$0.00'}</h3>
                    </div>

                    <div className='side-cart-navigation-buttons-contianer'>
                        <button disabled={isDeliveryAllowed} className={`side-cart-navigate-to-cart`} onClick={handleCloseSideCart}>
                            Keep Shopping
                        </button>
                        <button disabled={isDeliveryAllowed} className={`side-cart-navigate-to-checkout ${isDeliveryAllowed ? 'disable-cart-button' : ''}`} onClick={handleCLoseCartPanel}>
                            View Cart
                        </button>
                    </div>
                </div>

                {isCartLoading && (
                    <div className="side-cart-loader_overlay">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SideCart;