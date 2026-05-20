import React from "react";

const DottedCircle = ({
  radius = 80,
  dotCount = 16,
  dotRadius = 5,
  size = 200,
  left,
  right,
  top,
  bottom,
  animationDelayFactor = 0.1, // Default factor for animation delay
  isBlink = false, // Controls blinking
  startColor,
  stopColor,
  className
}) => {
  const centerX = size / 2; // Center of the SVG (x-axis)
  const centerY = size / 2; // Center of the SVG (y-axis)

  // Function to calculate the positions of dots
  const dots = Array.from({ length: dotCount }).map((_, index) => {
    const angle = (index / dotCount) * 2 * Math.PI; // Angle in radians
    const x = centerX + radius * Math.cos(angle); // X coordinate
    const y = centerY + radius * Math.sin(angle); // Y coordinate
    return { x, y, delay: index * animationDelayFactor }; // Add delay dynamically
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`dotted-circle`}
      style={{
        left: left,
        right: right,
        top: top,
        bottom: bottom,
      }}
    >
      <defs>
        <radialGradient id="gradient1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={stopColor} />
        </radialGradient>

        <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFF" />
        </filter>
      </defs>

      {dots.map((dot, index) => (
        <circle
          key={index}
          className={`dot dot-${index} ${isBlink ? "blink" : ""}`} // Add "blink" class if isBlink is true
          cx={dot.x}
          cy={dot.y}
          r={dotRadius}
          fill="url(#gradient1)"
          filter="url(#drop-shadow)"
          style={{
            animationDelay: `${dot.delay}s`, // Use dynamic delay
          }}
        />
      ))}
    </svg>
  );
};

export default DottedCircle;
