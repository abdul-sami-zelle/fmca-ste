'use client'
import React, {useRef } from "react";
import './MultiRange.css'
import { formatedPrice } from "../../utils/api";

const DoubleRangeSlider = (
  {
    min = 0,
    max = 100,
    initialRange,
    setInitialRange,
    onRangeChange,
  }) => {

  const isDragging = useRef(false);

  const handleChange = (e, thumb) => {
    const newValue = Number(e.target.value);
    const updatedRange = [...initialRange];
    updatedRange[thumb] = newValue;

    // Prevent overlap
    if (thumb === 0 && newValue >= initialRange[1]) updatedRange[thumb] = initialRange[1] - 1;
    if (thumb === 1 && newValue <= initialRange[0]) updatedRange[thumb] = initialRange[0] + 1;

    setInitialRange(updatedRange);
  };

  const handlePointerDown = () => {
    isDragging.current = true;
  }

  const handlePointerUp = () => {
    if(isDragging.current) {
      onRangeChange(initialRange);
      isDragging.current = false;
    }
  }


  return (
    <div className="multi-range-slider-container">
      <div className="price-filter-heading-container">
        <h3 className="filters-heading">Price</h3>
      </div>
      <div className="values">
        {initialRange && <span className='filter-inner-text'>{formatedPrice(initialRange[0])}</span>}
        {initialRange && <span className='filter-inner-text'>{formatedPrice(initialRange[1])}</span>}
      </div>
      <div className="range-slider">
        {/* First thumb (Min) */}
        <input
          type="range"
          min={min}
          max={max}
          value={initialRange[0]}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onChange={(e) => handleChange(e, 0)}
          className="range-input"
        />
        {/* Second thumb (Max) */}
        <input
          type="range"
          min={min}
          max={max}
          value={initialRange[1]}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onChange={(e) => handleChange(e, 1)}
          className="range-input"
        />
        {/* Track */}
        <div
          className="range-track"
          style={{
            left: `${(initialRange[0] - min) / (max - min) * 100}%`,
            right: `${100 - (initialRange[1] - min) / (max - min) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;
