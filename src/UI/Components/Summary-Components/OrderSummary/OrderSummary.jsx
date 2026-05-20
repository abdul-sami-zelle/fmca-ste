import React, { useEffect, useState } from 'react'
import './OrderSummary.css'
import { useCart } from '../../../../context/cartContext/cartContext';
import { formatedPrice, truncateTitle, url } from '../../../../utils/api';
import { useGlobalContext } from '../../../../context/GlobalContext/globalContext';


const OrderSummary = () => {

    

    const {
        cartProducts,
        subTotal,
    } = useCart()

    const {
        shippingMethods,
        info,
        totalTax,
        calculateTotalTax,
        getShippingInfo,
        selectedOption,
        handleChange,
        getShippingMethods,
        selectedShippingMethods,
        setSelectedShippingMethods,
        CalculateGrandTotal
    } = useGlobalContext()


    const [isStarted, setIsStarted] = useState(false);


    // useEffect(() => {
    //     // Always fetch lates
    //     // Fetch shipping methods if they are available
    //     if (shippingMethods) {
    //         getShippingMethods(subTotal, shippingMethods['shippingMethods']);
    //     }
    // }, []); // Empty dependency array ensures this runs once when the component mounts

    useEffect(() => {
        // Call getShippingMethods whenever subTotal or shippingMethods changes
        if (shippingMethods) {
            getShippingMethods(subTotal, shippingMethods['shippingMethods']);
            setIsStarted(!isStarted);
        }
    }, [shippingMethods, subTotal]); // Dependency array for changes in subTotal or shippingMethods

    useEffect(() => {
        if (shippingMethods) {
            getShippingMethods(subTotal, shippingMethods['shippingMethods']);
        }

    }, [isStarted])

    useEffect(() => { setSelectedShippingMethods(null) }, [info])

    return (
        <div className='order-summary-main-container'>
            <h3 className='order-summery-main-heading'>Order Summary</h3>
            <div className='mobile-view-main-heading'>
                <h3>Order Summery</h3>
                <p>Edit</p>
            </div>
            <div className='order-summary-details'>
                <div className='order-summary-selected-products-container'>
                    {cartProducts?.products?.map((items, index) => (
                        <div key={items.uid} className='selected-products'>
                            <div className='selected-single-product'>
                                <img src={`${url}${items.image.image_url}`} alt='img' />
                                <div className='selected-product-containt'>
                                    <span className='selected-product-name-and-price'>
                                        <h3>{truncateTitle(items.name, 50)}</h3>
                                        {items.sale_price === '' ? (
                                            <p>{formatedPrice(items.regular_price)}</p>
                                        ) : (
                                            <div className='order-summary-prices-container' style={{ display: 'flex', flexDirection: 'column' }}>
                                                <del>{formatedPrice(items.regular_price)}</del>
                                                <p>{formatedPrice(items.sale_price)}</p>
                                            </div>
                                        )}

                                    </span>

                                    {items?.attributes && items?.attributes.map((item, index) => {
                                        return (
                                            <span className='selected-product-color'><p>{item?.options[0].name}</p></span>

                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='products-tax-and-total'>
                    <span>
                        <p>Sub Total: </p>
                        <p>{formatedPrice(subTotal)}</p>
                    </span>
                    <span>
                        <p>{`Shipping ${selectedOption ? getShippingInfo(selectedOption)?.taxIncluded : ""}`}</p>
                        <p>{selectedOption ? getShippingInfo(selectedOption).result : ""}</p>
                    </span>
                    <span>
                        <p>{`Tax (${totalTax?.tax_name})`}</p>
                        <p>{totalTax ? formatedPrice(calculateTotalTax(subTotal, parseFloat(totalTax?.tax_value))) : 0}</p>
                    </span>
                    <div className="delivery-option-container">
                        <p className='delivery-opt-heading' >Delivery Options :</p>
                        {selectedShippingMethods &&
                            selectedShippingMethods.map((option) => (
                                <label
                                    key={option.id}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start",
                                        margin: "5px 0",
                                        gap: "10px",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="options"
                                        value={option.id}
                                        checked={selectedOption?.id === option.id}
                                        onChange={(e) => handleChange(e, option)} // Pass the option object
                                        style={{
                                            marginTop: "5px",
                                        }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: "100%",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <p className="delivery-option-container-label">{option.name}</p>
                                        {option.cost === 0 ? <></> : <p className="delivery-option-container-description">{formatedPrice(option.cost)}</p>}
                                        
                                    </div>
                                </label>
                            ))}
                    </div>
                </div>
                <div className='selected-product-total'>
                    <span>
                        <h3 className='selected-product-grand-total-price'>Total</h3>
                        <p className='selected-product-grand-total-price'>{formatedPrice(CalculateGrandTotal())}</p>
                    </span>
                </div>
            </div>
            <div className='mobile-view-order-summery-details'>
                {/* <div className='mobile-view-pricing-details'>

                </div> */}
                <div className='mobile-view-single-price'>
                    <p>Total</p>
                    <h3>$4900</h3>
                </div>
                <div className='mobile-view-order-summery-selected-orders'>
                    {/* <h3>{selectedProducts.length} Items</h3> */}
                    {/* <div className='mobile-view-ordered-summery-selected-products'>

                    </div> */}
                </div>
                <div className='mobile-view-order-summery-view-all-products-btn-div'>{/* <button onClick={handleShowMore}>{showMoreProducts > 1 ? 'Show Less' : 'Show More +'}</button> */}
                </div>
            </div>
        </div>
    )
}

export default OrderSummary