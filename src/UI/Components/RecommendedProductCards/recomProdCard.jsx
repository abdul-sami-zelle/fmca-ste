import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { GrPowerCycle } from "react-icons/gr";
import Image from "next/image";
import { url } from "@/utils/api";
import { useCart } from "@/context/cartContext/cartContext";
import { useProductPage } from "@/context/ProductPageContext/productPageContext";

import "./style.css";

export default function RecomProductCard({ handleQuickView, slug, singleProductData, mainImage, handleRemoveProduct, handleSingleShuffle, parentProduct, mainProduct }) {
    const [mainLoaded, setMainLoaded] = useState(false);
    const [hoverLoaded, setHoverLoaded] = useState(false);

    const {
        addToCart,
        decreamentQuantity,
        increamentQuantity,
        removeFromCart,
        addToCart0,
        cartProducts,
        cartSection,
        setCartSection,
        isCartLoading
    } = useCart();
    const {
        setSingleProductData,
        setSelectedVariationUid,
        findObjectByUID,
        setSelectedVariationData,
        selectedVariationData
    } = useProductPage();

    const [cardHovered, setCardHovered] = useState(false);
    const onMouseHover = () => {
        setCardHovered(true);
    }
    const onMouseLeave = () => {
        setCardHovered(false);
    }

    const stockCheck = singleProductData?.type === 'variable' ?  '' : singleProductData?.manage_stock?.stock_status === 'inStock' && singleProductData?.manage_stock?.quantity === 0 || singleProductData?.manage_stock?.stock_status === 'outStock';

    return (
        <div className="recommendedProductCard">
            {parentProduct && (<div className="rpc_header_top_space"><p>Current Product</p></div>)}
            <div className={`rpc_header_container ${parentProduct ? 'hide-shuffle-buttons' : ''}`}>
                <button onClick={handleRemoveProduct} className="remove-icon-header"><IoClose size={20} /></button>

                <button onClick={handleSingleShuffle} className="remove-icon-header"><GrPowerCycle size={20} /></button>
            </div>
            <div className="rpc_body">
                <div className="image_wrapper_rpc">
                    <div className="rpc_image_hover_container">
                        {!mainLoaded && <div className="shimmer" />}
                        <div className="rpc_image_container" onMouseEnter={() => setCardHovered(true)} onMouseLeave={() => setCardHovered(false)}>
                            <Image
                                src={
                                    cardHovered && singleProductData?.images[1]?.image_url
                                        ? url + singleProductData.images[1].image_url
                                        : url + mainImage
                                }
                                alt={singleProductData?.name || "Product Image"}
                                width={300}
                                height={200}
                                onLoad={() => {
                                    if (cardHovered && singleProductData?.images[1]?.image_url) {
                                        setHoverLoaded(true);
                                    } else {
                                        setMainLoaded(true);
                                    }
                                }}
                            />

                            
                        </div>
                        {/* {singleProductData.images[1]?.image_url && (
                            <>
                                {!hoverLoaded && <div className="shimmer" />}
                                <Image
                                    src={url + singleProductData.images[1].image_url}
                                    alt="Hover Product Image"
                                    width={300}
                                    height={200}
                                    className="rpc_image second"
                                    onLoad={() => setHoverLoaded(true)}
                                />
                            </>
                        )} */}
                    </div>
                </div>

                <div className="info_container_rpc">
                    <span className="rpc_product_name">
                        {singleProductData?.name}
                    </span>
                    <div className="rpc_pricing_section">
                        <h2 className={singleProductData?.sale_price === "" ? "rpc_price" : "rpc_price sale"}>
                            ${singleProductData?.sale_price === "" ? singleProductData?.regular_price : singleProductData?.sale_price}
                        </h2>
                        <button disabled={stockCheck} className={`rpc_recomanded_quick_view_button ${stockCheck ? 'disable-recomandation-add-to-cart' : ''} ${parentProduct ? 'hide_recomanded_quick_view_button' : ''}`} onClick={() => {

                            const isSimple = mainProduct.type === "simple";
                            const productUid = isSimple ? mainProduct.uid : mainProduct?.uid;
                            const existingProduct = cartProducts?.products?.find((item) =>
                                isSimple ? item.product_uid === productUid : item.variation_uid === productUid
                            );
                            if (existingProduct) {
                                addToCart0(singleProductData, null, 0, 1)
                            } else {
                                addToCart0(mainProduct, selectedVariationData, 0, 1);
                                addToCart0(singleProductData, null, 0, 1)
                            }
                        }
                        }>Add To Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
