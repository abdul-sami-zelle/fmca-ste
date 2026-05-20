import React from "react";
import "./productCardShimmer.css"

export default function ProductCardShimmer({width}) {
    return(
        <div className="productCardShimmer" style={{width: width ? width : '310px'}}>
            <div className="card_shimmer_image">

            </div>
            <div className="shimmer_sale_tag">

            </div>
            <div className="shimmer_product_sku">

            </div>
            <div className="shimmer_product_name">
                <div className="shimmer_product_name_line_1">
                
                </div>
                {/* <div className="shimmer_product_name_line_2">
                
                </div> */}
            </div>
            <div className="shimmer_product_price">

            </div>
            <div className="shimmer_product_swatches">

            </div>
        </div>
    )
}