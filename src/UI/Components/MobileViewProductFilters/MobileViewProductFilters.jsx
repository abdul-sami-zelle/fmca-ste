"use client";

import React, { useEffect, useState } from "react";
import "./MobileViewProductFilters.css";
import RatingReview from "../starRating/starRating";
import DoubleRangeSlider from "../../../Global-Components/MultiRangeBar/MultiRange";
import { IoIosClose } from "react-icons/io";
import Image from "next/image";
import { FaPlus, FaMinus } from "react-icons/fa6";

const MobileViewProductFilters = ({
  showMobileFilters,
  setMobileFilters,
  filtersData,
  priceRange,
  setPriceRange,
  handleColor,
  handleRating,
  handleCategory,
  colorValue,
  setColorValue,
  handlePriceRange,
  ratingValue,
  clearFilters,
  collectionValue,
  brandValue,
  isFeatured,
  isStock,
  handleCollectionSelect,
  handleBrandSelect,
  handleFeatured,
  handleStock,
}) => {
  const handleFiltersClose = () => {
    setMobileFilters(false);
  };

  const [colorFilter, setColorFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [isFeaturedFilter, setIsFeaturedFilter] = useState("");
  const [isStockFilter, setIStockFilter] = useState("");

  const handleFilterType = (type) => {
    setColorFilter((prevOpen) => (prevOpen === type ? "" : type));
    setRatingFilter((prevOpen) => (prevOpen === type ? "" : type));
    setCategoryFilter((prevOpen) => (prevOpen === type ? "" : type));
    setCollectionFilter((prevOpen) => (prevOpen === type ? "" : type));
    setBrandFilter((prevOpen) => (prevOpen === type ? "" : type));
    setIsFeaturedFilter((prevOpen) => (prevOpen === type ? "" : type));
    setIStockFilter((prevOpen) => (prevOpen === type ? "" : type));
  };

  const handlePriceRangeClick = () => {
    setMobileFilters(false);
  };

  return (
    <div
      className={`mobile-view-flters-popup ${
        showMobileFilters ? "show-mobile-filter-popup" : ""
      }`}
    >
      <button className="close-mobile-filters" onClick={handleFiltersClose}>
        {/* <img src={crossBtn} alt='close btn' /> */}
        <IoIosClose size={25} color="#595959" />
      </button>
      <div className="mobile-view-filters-head">
        <a href="/">
          <Image
            src={"/Assets/Logo/fm-new-logo.png"}
            width={200}
            height={35}
            alt="logo"
          />
        </a>
      </div>

      <div className="mobile-view-filters-body">
        <div className="mobile-view-filters-body-head">
          <h3>Filters</h3>
          <p onClick={clearFilters}>Clear Filters</p>
        </div>
        <div className="mobile-view-filters-div">
          {/* Price Filter */}
          {filtersData?.priceRange?.minPrice !== undefined &&
            filtersData?.priceRange?.maxPrice !== undefined &&
            priceRange && (
              <DoubleRangeSlider
                min={filtersData?.priceRange?.minPrice}
                max={filtersData?.priceRange?.maxPrice}
                initialRange={priceRange}
                setInitialRange={setPriceRange}
                onRangeChange={handlePriceRange}
                minLabel="Min Price:"
                maxLabel="Max Price:"
              />
            )}

          {/* {Color Filters} */}
          <div className="mobile-view-single-filter-dropdown">
            <div
              className="mobile-view-single-type"
              onClick={() => handleFilterType("open-color")}
            >
              <p>{filtersData?.colors?.[0]?.name}</p>

              {colorFilter === "open-color" ? (
                <FaMinus size={20} color="#595959" />
              ) : (
                <FaPlus size={20} color="#595959" />
              )}
            </div>
            <div
              className={`mobile-single-type-filters 
                                ${
                                  colorFilter === "open-color"
                                    ? "show-filter-type"
                                    : ""
                                }`}
            >
              {filtersData?.colors?.[0]?.options.map((item, index) => (
                <label className="single-filter-label" key={index}>
                  <input
                    type="checkbox"
                    placeholder="checkbox"
                    value={item.name}
                    checked={colorValue.includes(item.value)}
                    onChange={(e) => handleColor(item.value)}
                    style={{
                      backgroundColor: item.value,
                      border: `2px solid ${item.value}`,
                    }}
                    className="color-custom-checkbox"
                    id={`filter-${index}`}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          </div>

          {/* {Trending Filters} */}
          <div className="mobile-view-single-filter-dropdown">
            <div
              className="mobile-view-single-type"
              onClick={() => handleFilterType("highlight")}
            >
              <p>Trending</p>

              {isFeaturedFilter === "highlight" ? (
                <FaMinus size={20} color="#595959" />
              ) : (
                <FaPlus size={20} color="#595959" />
              )}
            </div>
            <div
              className={`mobile-single-type-filters 
                                ${
                                  isFeaturedFilter === "highlight"
                                    ? "show-filter-type"
                                    : ""
                                }`}
            >
              {filtersData?.highlights?.map((item, index) => (
                <label className="single-filter-label" key={index}>
                  <input
                    type="checkbox"
                    placeholder="checkbox"
                    value={item.code}
                    checked={isFeatured.includes(item.code)}
                    onChange={(e) => handleFeatured(item)}
                    style={{ border: `1px solid var(--tertiary-color)` }}
                    className="color-custom-checkbox"
                    id={`filter-${index}`}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          </div>

          {/* {Collection Filters} */}
          <div className="mobile-view-single-filter-dropdown">
            <div
              className="mobile-view-single-type"
              onClick={() => handleFilterType("collections")}
            >
              <p>Collection</p>

              {collectionFilter === "collections" ? (
                <FaMinus size={20} color="#595959" />
              ) : (
                <FaPlus size={20} color="#595959" />
              )}
            </div>
            <div
              className={`mobile-single-type-filters 
                                ${
                                  collectionFilter === "collections"
                                    ? "show-filter-type"
                                    : ""
                                }`}
            >
              {filtersData?.collections?.map((item, index) => (
                <label className="single-filter-label" key={index}>
                  <input
                    type="checkbox"
                    placeholder="checkbox"
                    value={item.uid}
                    checked={collectionValue.includes(item.uid)}
                    onChange={(e) => handleCollectionSelect(item)}
                    style={{ border: `1px solid var(--tertiary-color)` }}
                    className="color-custom-checkbox"
                    id={`filter-${index}`}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          </div>

          {/* {Brand Filters} */}
          <div className="mobile-view-single-filter-dropdown">
            <div
              className="mobile-view-single-type"
              onClick={() => handleFilterType("brand")}
            >
              <p>Brand</p>

              {brandFilter === "brand" ? (
                <FaMinus size={20} color="#595959" />
              ) : (
                <FaPlus size={20} color="#595959" />
              )}
            </div>
            <div
              className={`mobile-single-type-filters 
                                ${
                                  brandFilter === "brand"
                                    ? "show-filter-type"
                                    : ""
                                }`}
            >
              {filtersData?.brands?.map((item, index) => (
                <label className="single-filter-label" key={index}>
                  <input
                    type="checkbox"
                    placeholder="checkbox"
                    value={item.name}
                    checked={brandValue.includes(item.name)}
                    onChange={(e) => handleBrandSelect(item)}
                    style={{ border: `1px solid var(--tertiary-color)` }}
                    className="color-custom-checkbox"
                    id={`filter-${index}`}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mobile-view-single-filter-dropdown">
            <div
              className="mobile-view-single-type"
              onClick={() => handleFilterType("open-rating")}
            >
              <p>Ratings</p>
              {colorFilter === "open-rating" ? (
                <FaMinus size={20} color="#595959" />
              ) : (
                <FaPlus size={20} color="#595959" />
              )}
            </div>
            <div
              className={`mobile-single-type-filters 
                                ${
                                  colorFilter === "open-rating"
                                    ? "show-filter-type"
                                    : ""
                                }`}
            >
              {[...Array(5).keys()].reverse().map((item, index) => {
                const rating = item + 1;
                return (
                  <span key={index} className={`color-span`}>
                    <input
                      type="checkbox"
                      placeholder="checkbox"
                      value={rating}
                      checked={ratingValue.includes(rating)}
                      onChange={(e) => handleRating(Number(e.target.value))}
                      className="custom-checkbox"
                      id={`filter-${rating}`}
                    />
                    <label htmlFor={`filter-${5 - item}`}>
                      <RatingReview
                        rating={item + 1}
                        disabled={true}
                        size={"20px"}
                      />
                    </label>
                  </span>
                );
              })}
            </div>
          </div>

          {/* {Stock Filters} */}
          <div className="mobile-view-single-filter-dropdown">
            <div
              className="mobile-view-single-type"
              onClick={() => handleFilterType("stock")}
            >
              <p>Stock Status</p>

              {isStockFilter === "stock" ? (
                <FaMinus size={20} color="#595959" />
              ) : (
                <FaPlus size={20} color="#595959" />
              )}
            </div>
            <div
              className={`mobile-single-type-filters 
                                ${
                                  isStockFilter === "stock"
                                    ? "show-filter-type"
                                    : ""
                                }`}
            >
              {filtersData?.stock?.map((item, index) => (
                <label className="single-filter-label" key={index}>
                  <input
                    type="checkbox"
                    placeholder="checkbox"
                    value={item.code}
                    checked={isStock.includes(item.code)}
                    onChange={(e) => handleStock(item)}
                    style={{ border: `1px solid var(--tertiary-color)` }}
                    className="color-custom-checkbox"
                    id={`filter-${index}`}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mobile-view-filters-togle-button">
          <button
            className="mobile-view-result-button"
            onClick={handlePriceRangeClick}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileViewProductFilters;
