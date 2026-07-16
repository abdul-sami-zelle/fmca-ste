import React from 'react';
import './style.css';

const ReviewCardShimmer = () => {
    return (
        <div className="card-container-wcs-shimmer">
            <div className="shimmer-card-header-wcs">
                <div className="shimmer-avatar-wcs" />
                <div className="shimmer-user-info-wcs">
                    <div className="shimmer-name-wcs" />
                    <div className="shimmer-stars-wcs" />
                </div>
            </div>

            <div className="shimmer-card-body-wcs">
                <div className="shimmer-line-wcs" />
                <div className="shimmer-line-wcs" />
                <div className="shimmer-line-wcs short" />
            </div>

            <div className="shimmer-card-footer-wcs">
                <div className="shimmer-posted-wcs" />
                <div className="shimmer-logo-wcs" />
            </div>
        </div>
    );
};

export default ReviewCardShimmer;