import React from "react";
import DesignRoom from "./Pages/DesignRoom/DesignRoom";
import "./style.css"
import { AiFillCloseSquare } from "react-icons/ai";
import { url } from "@/utils/api";
import { useProductPage } from "@/context/ProductPageContext/productPageContext";
import { useCart } from "@/context/cartContext/cartContext";
import CanvasApp from "../Canvas/canvas";

function DesignRoomMain({closeFn,product, data, }) {
          const {
            addToCart0,
          } = useCart();
            const {
              selectedVariationData
            } = useProductPage();
    const setAddToCart = () => {
        closeFn()
        addToCart0(product,selectedVariationData,0,1);
    }

    
  return(
    <div className="design_room_popup">
        {/* <DesignRoom name={product?.name} wasPrice={"$"+product?.regular_price} nowPrice={"$"+product?.sale_price} image={url+product?.image?.image_url} setAddToCart={setAddToCart} /> */}
        <CanvasApp 
          data={data} closeFn={closeFn}
        />
        <div onClick={()=>{closeFn()}} className="close_btn_design_room_popup">
            <AiFillCloseSquare size={30} />
        </div>
    </div>
  )
  
}

export default DesignRoomMain;
