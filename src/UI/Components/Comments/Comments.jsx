import React from 'react'
import './Comments.css';
import thumbUp from '../../../Assets/icons/Thumbs up.png'
import RatingReview from '../starRating/starRating';
import { url } from '../../../utils/api';
import { formatTime } from '../../../utils/api';

const Comments = ({ data ,order }) => {

    return (
        <div>
            {data?.map((item, index) => {
                return <div className='comments-container'>
                    <div className='user-details'>
                        <div className='user-name-and-detail'>
                            <h3>{item.reviewer}</h3>
                            <p>{"Pennesylvania"}</p>
                            <p>{item.verified ? "Verified" : "Not Verifiled"}</p>
                        </div>
                        <div className="cemmented-product-images">
                            {item?.images &&
                                item.images.slice(0, 3).map((image, index) => (
                                    <img key={index} src={`${url}${image}`} alt={`img-${index}`} />
                                ))}
                        </div>

                    </div>
                    <div key={index} className='comment-section'>
                        <div className='stars-and-date'>
                            <RatingReview disabled={true} rating={item.rating} />
                            <p>{formatTime("Pennsylvania",item.date_created)}</p>
                        </div>
                        <div className='comment-and-see-more'>
                            <p>{item.review}</p>
                        </div>
                    </div>
                    <div className='feedback'>
                        <button>
                            <img src={thumbUp} alt='thhumb' />
                            Helpful  0
                        </button>
                    </div>
                </div>
            })}


            <div className='mobile-comments'>
                {data && data?.map((item, index) => (
                    <div key={index} className='mobile-single-comment'>
                        <div className='mobile-comment-name-and-date'>
                            <h3>{item.reviewer}</h3>
                            <p>{formatTime("Pennsylvania",item.date_created)}</p>
                        </div>
                        <h3 className='mobile-comment-state'>{item.state}</h3>
                        <div className='mobile-comment-status-and-rating'>
                            <p>Panselvania</p>
                            <div className='mobile-comment-verified-and-rating-stars'>
                                <p>{item.verified ? "Verified" : "Not Verifiled"}</p>
                                <RatingReview disabled={true} rating={item.rating} />
                                
                            </div>
                        </div>
                        <p className='mobile-comment'>{item.review}</p>
                        <button className='mobile-comment-show-more-btn'>show more</button>
                        <div className='mobile-comment-images-and-feedback'>
                            <div className='mobile-single-comment-images'>
                                {item.images?.slice(0, 2).map((item, index) => (
                                    <img src={`${url}${item}`} alt='product-image' />
                                ))}
                                <div className={`mobile-comment-view-more-images ${item.image?.length !== 0 && item.images?.length > 2 ? 'show-view-more-option' : ''}`}>
                                    <p>View More</p>
                                </div>
                            </div>
                            <button className='mobile-comment-feedback'>
                                <img src={thumbUp} alt='thhumb' />
                                <p>Helpful  0</p>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comments
