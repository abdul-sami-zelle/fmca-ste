// StarDisplay.jsx
import React from "react";
import { FaStar } from "react-icons/fa";

function StarDisplay({ rating = 0, size = "16px" }) {
  return (
    <div style={{ display: "flex" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillLevel = Math.min(1, Math.max(0, rating - (star - 1)));

        return (
          <span
            key={star}
            className="star"
            style={{
              position: "relative",
              fontSize: size,
              lineHeight: size,
              zIndex: 0,
            }}
          >
            <FaStar
              style={{
                color: "#d4d4d4",
                fill: "#d4d4d4",
                stroke: "var(--text-charcol)",
                strokeWidth: "1px",
              }}
            />
            <FaStar
              style={{
                fill: "var(--tertiary-color)",
                stroke: "var(--tertiary-color)",
                strokeWidth: "1px",
                position: "absolute",
                top: 0,
                left: 0,
                clipPath: `inset(0 ${100 - fillLevel * 100}% 0 0)`,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}

export default StarDisplay;