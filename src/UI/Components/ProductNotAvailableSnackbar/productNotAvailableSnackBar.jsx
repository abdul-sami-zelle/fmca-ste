"use client";

import { useEffect, useMemo, useState } from "react";
import "./style.css";
import { url } from "@/utils/api";

const MetaCartSnackbar = ({ products = [] }) => {
    const [visible, setVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const unavailableProducts = useMemo(() => {
        return products.filter(
            (product) =>
                product.out_of_stock === true ||
                product.product_status === "discontinued"
        );
    }, [products]);

    const hasSingleProduct = unavailableProducts.length === 1;

    useEffect(() => {
        if (unavailableProducts.length === 0) {
            setVisible(false);
            return;
        }

        setVisible(true);
    }, [unavailableProducts]);

    useEffect(() => {
        if (!visible || unavailableProducts.length === 0) {
            return;
        }

       const timeout = isHovered ? 60000 : 40000;

        const timer = setTimeout(() => {
            setVisible(false);
        }, timeout);

        return () => clearTimeout(timer);
    }, [
        visible,
        isHovered,
        unavailableProducts
    ]);

    if (!visible || unavailableProducts.length === 0) {
        return null;
    }

    return (
        <div
            className="meta-cart-snackbar"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="meta-cart-snackbar-content">

                {/* Header */}
                <div className="meta-cart-snackbar-header">

                    <div className="meta-cart-snackbar-title-wrapper">

                        <div className="meta-cart-snackbar-icon">
                            !
                        </div>

                        <div>
                            <h4 className="meta-cart-snackbar-title">
                                {hasSingleProduct
                                    ? "This product is currently Back Order"
                                    : "Some products are currently in Back Order"}
                            </h4>

                            <p className="meta-cart-snackbar-description">
                                {hasSingleProduct
                                    ? "This product could not be added to your cart."
                                    : "The following products could not be added to your cart."}
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() => setVisible(false)}
                        className="meta-cart-snackbar-close"
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* Products */}
                <div className="meta-cart-snackbar-products">

                    {unavailableProducts.map((product, index) => {

                        const isDiscontinued =
                            product.product_status === "discontinued";

                        const isOutOfStock =
                            product.out_of_stock === true;

                        return (
                            <div
                                key={`${product.product_uid}-${product.variation_uid || 0}-${index}`}
                                className="meta-cart-snackbar-product"
                            >

                                {/* Product Image */}
                                <div className="meta-cart-snackbar-image-wrapper">

                                    {product.image?.image_url ? (
                                        <img
                                            src={url + product.image?.image_url}
                                            alt={
                                                product.image.alt_text ||
                                                product.name ||
                                                "Product"
                                            }
                                            className="meta-cart-snackbar-image"
                                        />
                                    ) : (
                                        <div className="meta-cart-snackbar-image-placeholder">
                                            No Image
                                        </div>
                                    )}

                                </div>


                                {/* Product Information */}
                                <div className="meta-cart-snackbar-product-info">

                                    <p className="meta-cart-snackbar-product-name">
                                        {product.name}
                                    </p>

                                    {product.attributes?.length > 0 && (
                                        <div className="meta-cart-snackbar-attributes">
                                            <p>SKU : {product?.sku}</p>

                                            {product.attributes.map((item, index) => {
                                                return (
                                                    <p key={index} >{item?.options[0].name}</p>
                                                )
                                            })}
                                        </div>
                                    )}

                                </div>


                                {/* Status */}
                                <span
                                    className={`meta-cart-snackbar-status out-of-stock `}
                                >
                                    {"Back Order"}
                                </span>

                            </div>
                        );
                    })}

                </div>



            </div>
        </div>
    );
};

export default MetaCartSnackbar;