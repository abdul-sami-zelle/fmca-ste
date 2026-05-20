import React from "react";
import "./style.css";
import { FcCheckmark } from "react-icons/fc";
import { HiCheck } from "react-icons/hi";

const SubProductCard = ({ product, room, isSelected = false, onClick }) => {
  return (
    <div
      className={`subproduct-card-wrapper ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="subcardcontainer">
        <div
          className="subproduct-card"
        >
          <img src={product.image} alt={product.title} />
          <p className="subproduct-titlessss">{product.name}</p>
          <p className="subproduct-price">
            <span className="subsale-price">{product.nowPrice}</span>
            <span className="suboriginal-price">{product.wasPrice}</span>
          </p>
        </div>
      </div>

                {isSelected && (
            <div className="selected-check-icon">
           <HiCheck />
            </div>
          )}
    </div>
  );
};

export default SubProductCard;
