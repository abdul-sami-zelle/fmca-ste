"use client"

import React, { useState, useRef, useEffect } from 'react';
import StarDisplay from './StarDisplay';
import './style.css';

const ReviewCard = ({ reviewData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      // Compare full scroll height vs visible clamped height
      const isOverflowing = textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsClamped(isOverflowing);
    }
  }, [reviewData]);

  if (!reviewData) return null;

  const { name, rating, date, review } = reviewData;

  const avatarLetter = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="card-container-wcs">
      {/* Header Section: Dynamic Letter Avatar, Name, Stars, and Date */}
      <div className="card-header-wcs">
        <div className="avatar-letter-wcs">
          {avatarLetter}
        </div>
        <div className="user-info-wcs">
          <div className="user-name-wcs">{name}</div>
          <div className="rating-container-wcs">
            <StarDisplay rating={rating} size="16px" />
            {/* <span className="date-wcs">{date}</span> */}
          </div>
        </div>
      </div>

      {/* Review Body */}
      <div className="card-body-wcs">
        <p
          ref={textRef}
          className={`review-text-wcs ${isExpanded ? 'expanded' : ''}`}
        >
          {review}
        </p>
        {isClamped && (
          <button
            className="read-more-btn-wcs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Footer Section: Google Branding */}
      <div className="card-footer-wcs">
        <span className="posted-on-wcs">Posted on</span>
        <img src="/Assets/google.png" alt="" srcset="" />
      </div>
    </div>
  );
};

export default ReviewCard;