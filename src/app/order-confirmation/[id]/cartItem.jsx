import React from "react";
import "./OrderConfirmationPage.css";
import { formatedPrice, truncateTitle } from "../../../utils/api";
import { url } from "../../../utils/api";

export default function CartItemOC({image,name,quantity, regular_price, options,sku,price,cart_protected,is_protected,protected_price}) {
    
    return(
        <>
            
            <div className="confirmed-order-product-main">
                <div className="confirmed-order-product-image">
                    <p>{quantity}</p>
                    <img src={`${url}${image}`} alt="product" />
                </div>
                <div className="confirmed-order-product-details">
                    <div className="confirmed-order-name-and-price">
                        <h3>{truncateTitle(name, 15)}</h3>
                        <span>
                            <del>{formatedPrice(regular_price)}</del>
                            <p>{formatedPrice(price)}</p>
                        </span>
                    </div>
                    {options && options.map((item, index) => (
                        <p key={index}>{item?.options[0].name}</p>
                    ))}
                    
                </div>
            </div>
        </>  
    )
}