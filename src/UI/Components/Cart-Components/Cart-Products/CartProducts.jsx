import React, { useState, useEffect } from 'react'
import './CartProducts.css';
import CartItems from '../Cart-items/CartItems';
import CartPaymnetMethoud from '../CArtAddPaymentMethoud/CartPaymnetMethoud';
import { useCart } from '@/context/cartContext/cartContext';
import EmptyCart from '../Empty-Cart/EmptyCart';
import MobileCart from '../Mobile-Cart/MobileCart';
import Breadcrumb from '@/Global-Components/BreadCrumb/BreadCrumb';
import { IoLocationOutline } from "react-icons/io5";
import { formatedPrice } from '@/utils/api';
import { useGlobalContext } from '@/context/GlobalContext/globalContext';
import SnakBar from '@/Global-Components/SnakeBar/SnakBar';
import { LiaShippingFastSolid } from "react-icons/lia"
import { BsShop } from "react-icons/bs";
import Image from 'next/image';


const CartProducts = ({ handleLocationModal }) => {

    const {
        cart,
        cartProducts,
        removeFromCart,
        increamentQuantity,
        decreamentQuantity,
        calculateTotalPrice,
        removeProtection,
        addSingleProtection,
        isCartProtected,
        setIsCartProtected,
        isProfessionalAssembly,
        handleCartProtected,
        handleCartAssembly,
        handleCartAssemblyFalse,
        isCartLoading
    } = useCart()


    


    const {
        selectedOption,
        handleChange,
        selectedShippingMethods,
        info,
        isDeliveryAllowed,
    } = useGlobalContext();


    const [productProtectCount, setProductProtectCount] = useState(0);
    useEffect(() => {
        if (cartProducts?.is_all_protected === 0) {
            const protectedProducts = cartProducts?.products.filter(product => product?.is_protected === 1)
            setProductProtectCount(protectedProducts)
        }
    }, [cartProducts])

    calculateTotalPrice(cart)

    const [isOpen, setIsOpen] = useState(false);
    const [checkoutFixed, setCheckoutFixed] = useState(true);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleScroll = () => {
        if (window.scrollY > 250) {
            setCheckoutFixed(false);
        }
        else {
            setCheckoutFixed(true);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const [issingleProtected, setIsSingleProtected] = useState(false);

    const [showSnakeBar, setShowSnakeBar] = useState(false);
    const [snakeBarMessage, setSnakeBarMessage] = useState()
    const handleShowSnakeToust = (name) => {
        setShowSnakeBar(true)
        setSnakeBarMessage(name)
    }

    const handleCloseSnakeBar = () => {
        setShowSnakeBar(false)
    }

    return (
        <>
            <div className='cart-products-main-container'>

                <div className='cart-products-heading'>
                    <h3>Cart ({cartProducts.products?.length} Items)</h3>
                </div>


                <div className='zipcode-and-protection-plan-container'>
                    <span className='update-zip-code-on-cart-page'>
                        <IoLocationOutline size={15} />
                        <p className='update-zip-on-cart-details'>Product Availability And Delivery Options For {info.locationData.zipCode} {info.locationData.stateCode}</p>
                        <p className='update-zip-on-cart-update-location' onClick={handleLocationModal}>Change Location</p>
                    </span>

                    <div className='mobile-view-update-zip-on-cart-page'>
                        <span>
                            <IoLocationOutline size={20} color='var(--secondary-color)' />
                            <p>Product availability and delivery options for </p>
                        </span>
                        <i>
                            {info.locationData.zipCode} {info.locationData.stateCode}
                            <p onClick={handleLocationModal}> Change Location </p>
                        </i>

                    </div>

                    <div className='cart-protection-plan-container'>
                        <h3
                            className='protection-plan-on-cart-container'
                        >
                            Add Furniture Mecca Platinum Protection Plan & Professional Assembly
                        </h3>

                        {cartProducts.products?.length > 0 && (
                            <div className='cart-protect-or-not-container'>

                                <div className='cart-protect-card' onClick={isDeliveryAllowed ? undefined : cartProducts?.products?.length > 1 ? handleCartProtected : undefined}>
                                    {cartProducts?.products?.length === 1 || isDeliveryAllowed && <div className='protect-entire-cart-disable-overlay'></div>}
                                    <img src={'/Assets/icons/guard-icon.png'} alt='guard icon' className='cart-protection-card-icon' />
                                    <div className='cart-protection-plan-details-container'>
                                        <p className='cart-protection-plan-card-header'>Add Premium Protection to Cart</p>
                                        <p className='cart-protection-plan-cart-desc'>{formatedPrice(199)}</p>
                                    </div>
                                    <div className='cart-protection-checkbox-container'>
                                        <input
                                            type="checkbox"
                                            className='order-summary-checkbox'
                                            checked={isCartProtected}
                                            readOnly
                                            disabled={cartProducts?.products?.length === 1}
                                        />
                                    </div>
                                </div>

                                <div className='cart-protect-card' style={{
                                    opacity:"0.2",
                                    cursor:"not-allowed"
                                }} onClick={()=>{}
                                    // isDeliveryAllowed ? undefined : selectedOption?.id !== 'METHOD-3' ? handleCartAssembly : handleCartAssemblyFalse
                                    }>
                                    {selectedOption?.id === 'METHOD-3' || isDeliveryAllowed && <div className='professional-assembly-disable'></div>}
                                    <Image src={'/Assets/icon/professional-assembly.svg'} alt='guard icon' width={80} height={80} className='cart-protection-card-icon' />

                                    <div className='cart-protection-plan-details-container'>
                                        <p className='cart-protection-plan-card-header'>White Glove (Currently Not Available)</p>
                                        <p className='cart-protection-plan-cart-desc'>{formatedPrice(199)}</p>
                                    </div>
                                    <div className='cart-protection-checkbox-container'>
                                        <input
                                            type="checkbox"
                                            className='order-summary-checkbox'
                                            checked={isProfessionalAssembly}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                <div className={`cart-items ${isOpen ? 'low-width' : ''}`} style={{ height: cartProducts?.products?.length === 0 ? '100%' : 'max-content' }}>
                    {cartProducts.products?.length > 0 && (
                        !isDeliveryAllowed && (
                            <div className='cart-container-shipping-details'>
                                <h3 className='protection-plan-on-cart-container'>Choose Delivery Option</h3>
                                <div className='cart-protect-or-not-container'>

                                    {selectedShippingMethods &&
                                        selectedShippingMethods?.map((option, index) => (
                                            <div className='cart-delivary-card' onClick={() => { handleChange(null, option); handleCartAssemblyFalse() }}>
                                                {/* <img src={'/Assets/icons/guard-icon.png'} alt='guard icon' className='cart-protection-card-icon' /> */}
                                                {index === 0 ? <LiaShippingFastSolid color='var(--text-charcol)' className='cart-protection-card-icon' /> : <BsShop color='var(--text-charcol)' className='cart-protection-card-icon' />}

                                                <div className='cart-protection-plan-details-container'>
                                                    <p className='cart-protection-plan-card-header'>{option.name}</p>
                                                </div>
                                                <div className='cart-protection-radio-container'>
                                                    <label
                                                        key={option.id}
                                                        className="custom-radio"
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "flex-start",
                                                            flexDirection: "row",
                                                            justifyContent: "flex-start",
                                                            // margin: "5px 0",
                                                            gap: "10px",
                                                        }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="options"
                                                            value={option.id}
                                                            checked={selectedOption?.id === option.id}
                                                            readOnly
                                                            onChange={(e) => handleChange(e, option, index)} // Pass the `option` object

                                                        />
                                                        <span className="radio-mark" />
                                                    </label>

                                                </div>
                                            </div>
                                        ))}
                                </div>
                                {isProfessionalAssembly ? <p className='delivery-promotion'></p> : selectedOption?.cost > 0 && <p className='delivery-promotion'>Delivery right inside the front door of your home. You do the unpacking and assembly.</p>}
                            </div>
                        )
                    )}

                    {cartProducts.products?.length <= 0 && <EmptyCart />}
                    {cartProducts && cartProducts?.products?.map((items, index) => {
                        return <CartItems
                            key={items.product_uid}
                            totalProducts={cartProducts?.products?.length}
                            attributes={items.attributes}
                            onlyMobile={false}
                            productData={items}
                            sku={items.sku}
                            issingleProtected={issingleProtected}
                            handleSingleProtected={() => { }}
                            cartIndex={items.product_uid}
                            productsLength={cartProducts.products?.length}
                            handleRomoveProduct={() => {
                                handleShowSnakeToust(items.name);
                                removeFromCart(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)

                            }}
                            cartProductName={items.name}
                            cartPRoductImage={items.image?.image_url}
                            cartProductTitle={items.name}
                            isCartOpen={isOpen}
                            quantity={items.quantity}
                            productTotalPrice={items.total_price}
                            sale_price={items.sale_price}
                            regular_price={items.regular_price}
                            isProtected={items.is_protected}
                            productSubTotal={items.sub_total}
                            handleIncreament={() => increamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            handleDecreament={() => decreamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            removeProtection={() => removeProtection(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            addProtection={() => addSingleProtection(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                        />
                    })}

                    {cartProducts && cartProducts?.products?.map((items, index) => (
                        <MobileCart
                            key={items.product_uid}
                            attributes={items.attributes}
                            // onlyMobile={false}
                            productData={items}
                            issingleProtected={issingleProtected}
                            handleSingleProtected={() => { }}
                            cartIndex={items.product_uid}
                            productsLength={cartProducts.products?.length}
                            handleRomoveProduct={() => removeFromCart(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            cartProductName={items.name}
                            cartPRoductImage={items.image?.image_url}
                            cartProductTitle={items.name}
                            isCartOpen={isOpen}
                            quantity={items.quantity}
                            productTotalPrice={items.total_price}
                            sale_price={items.sale_price}
                            regular_price={items.regular_price}
                            isProtected={items.is_protected}
                            productSubTotal={items.sub_total}
                            handleIncreament={() => increamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            handleDecreament={() => decreamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            removeProtection={() => removeProtection(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            addProtection={() => addSingleProtection(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}

                        />
                    ))}

                    {isCartLoading && <div className="cart_products_overlay">
                        <div className="loader"></div>
                    </div>}
                </div>
                {/* <div className='mobile-cart-items'>

                    <div className='cart-container-shipping-details'>
                        <h3 className='protection-plan-on-cart-container'>Choose Delivery Options</h3>
                        <div className='cart-protect-or-not-container'>
                            {selectedShippingMethods &&
                                selectedShippingMethods?.map((option, index) => (
                                    <div className='cart-delivary-card' onClick={() => handleChange(null, option)}>
                                        {index === 0 ? <LiaShippingFastSolid color='var(--text-charcol)' className='cart-protection-card-icon' /> : <BsShop color='var(--text-charcol)' className='cart-protection-card-icon' />}

                                        <div className='cart-protection-plan-details-container'>
                                            <p className='cart-protection-plan-card-header'>{option.name}</p>
                                        </div>
                                        <div className='cart-protection-radio-container'>
                                            <label
                                                key={option.id}
                                                className="custom-radio"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    flexDirection: "row",
                                                    justifyContent: "flex-start",
                                                    // margin: "5px 0",
                                                    gap: "10px",
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="options"
                                                    value={option.id}
                                                    checked={selectedOption?.id === option.id}
                                                    readOnly
                                                    onChange={(e) => handleChange(e, option, index)} // Pass the `option` object

                                                />
                                                <span className="radio-mark" />
                                            </label>

                                        </div>
                                    </div>
                                ))}

                        </div>
                        {selectedOption?.cost > 0 && <p className='delivery-promotion'>Delivery right inside the front door of your home. You do the unpacking and assembly.</p>}
                    </div>

                    {cartProducts.products?.length <= 0 && <EmptyCart />}
                    {cartProducts && cartProducts?.products?.map((items, index) => (
                        <MobileCart
                            key={items.product_uid}
                            attributes={items.attributes}
                            // onlyMobile={false}
                            productData={items}
                            issingleProtected={issingleProtected}
                            handleSingleProtected={() => { }}
                            cartIndex={items.product_uid}
                            productsLength={cartProducts.products?.length}
                            handleRomoveProduct={() => removeFromCart(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            cartProductName={items.name}
                            cartPRoductImage={items.image?.image_url}
                            cartProductTitle={items.name}
                            isCartOpen={isOpen}
                            quantity={items.quantity}
                            productTotalPrice={items.total_price}
                            sale_price={items.sale_price}
                            regular_price={items.regular_price}
                            isProtected={items.is_protected}
                            productSubTotal={items.sub_total}
                            handleIncreament={() => increamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            handleDecreament={() => decreamentQuantity(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            removeProtection={() => removeProtection(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}
                            addProtection={() => addSingleProtection(items.isVariable === 1 ? items.variation_uid : items.product_uid, items.isVariable === 1)}

                        />
                    ))}
                    {isCartLoading && <div className="cart_products_overlay">
                        <div className="loader"></div>
                    </div>}
                </div> */}


                <CartPaymnetMethoud
                    isOpen={isOpen}
                    handleToggle={handleToggle}
                />

                {/* <LocationPopUp
                    searchLocation={searchLocation}
                    handleCloseSearch={handleCloseSearch}
                    setLocationDetails={setLocationDetails}
                    locationDetails={locationDetails}
                /> */}
                <SnakBar
                    message={snakeBarMessage}
                    openSnakeBarProp={showSnakeBar}
                    setOpenSnakeBar={setShowSnakeBar}
                    onClick={handleCloseSnakeBar}
                />
            </div>
        </>
    )
}

export default CartProducts