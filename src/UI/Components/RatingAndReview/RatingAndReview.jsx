import React, { useState, useEffect } from 'react';
import './RatingAndReview.css';
import CustomerPhotos from '../CustomerPhotos/CustomerPhotos';
import RatingReview from '../starRating/starRating';
import { FaStar } from "react-icons/fa";
import { transformReviewData, extractImagesFromReviews } from '../../../utils/api';
import no_image from "../../../Assets/no_image.png"
import Image from 'next/image';

const RatingAndReview = ({ rating, data }) => {

    const [ratingDistribution, setRatingDistribution] = useState([
        { count: 5, rev: 928 },
        { count: 4, rev: 392 },
        { count: 3, rev: 170 },
        { count: 2, rev: 98 },
        { count: 1, rev: 117 }
    ]);

    const maxValue = data ? data.length : 1;

    const [customerImages, setCustomerImages] = useState([])


    useEffect(() => {
        if (data) {
            setRatingDistribution(transformReviewData(data));
            setCustomerImages(extractImagesFromReviews(data));
        }
    }, [data]);

    return (
        <div className={`rating-and-customers-photos`}>
            <div className='rating-and-review-main-container'>
                <h3>Rating & Reviews</h3>
                {/* <p>Our <Link>Community Guidelines </Link> help customers write honest reviews.</p> */}
                <div className='rating-and-review-div'>
                    <div className='rating-div'>
                        <h3>{rating}</h3>
                        <span >
                            <RatingReview disabled={true} rating={rating} />
                        </span>
                        <p>{data.length} {data.length > 1 ? 'Reviews' : 'Review'}</p>
                    </div>
                    <div className='rating-progress-bar-div'>
                        {data && ratingDistribution.map((item, index) => {
                            const progress = (item.rev / maxValue) * 100;
                            return (
                                <div key={index} className='progress-bar-div'>
                                    <div className='rating-count-div'>
                                        <p>{item.count}</p>
                                    </div>
                                    <FaStar
                                        style={{
                                            color: "var(--tertiary-color)",
                                            fontSize: "18px"
                                        }}
                                    />
                                    <div className='progress-bar-container'>
                                        <div className='progress-bar' style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Write Review Form */}

            <div className='customer-images-section'>
                <h3>Customer Photos</h3>
                {customerImages?.length > 0 ? <CustomerPhotos images={customerImages} /> :

                    <div className='customer-images-section-not'>

                        <Image src={'/Assets/global-images/no-img.svg'} width={200} height={40} alt=' no image icon' />
                    </div>


                }

            </div>
        </div>
    );
};

export default RatingAndReview;
