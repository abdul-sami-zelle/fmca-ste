import React, { useEffect, useRef, useState } from "react";
import "./WriteReview.css";
import RatingReview from "../starRating/starRating";
import { IoIosClose } from "react-icons/io";
import productImage from '../../../Assets/Furniture Mecca/product page/try these/B560__02 2.png'
import { url } from "../../../utils/api";
import { IoInformationCircleOutline } from "react-icons/io5";
import { CiCamera, CiYoutube } from "react-icons/ci";
import axios from "axios";
import { formatDate } from "react-calendar/dist/cjs/shared/dateFormatter.js";
import Image from "next/image";
import { useProductPage } from "@/context/ProductPageContext/productPageContext";


export default function WriteReview({ product_id, productData, snakeBarOpen, review_enable, product_name, product_permalink, }) {

    const { singleProductData } = useProductPage();
    const [reviewData, setReviewData] = useState(
        {
            "product_id": 0,
            "product_permalink": "",
            "product_name": "",
            "reviewer": "",
            "reviewer_email": "",
            "review_title": "",
            "verified": false,
            "review": "",
            "rating": 0,
            "helpful": 0,
        },
    )
    const [remainingTime, setRemainingTime] = useState(0)
    const [loading, setLoading] = useState(false);
    const checkToken = async () => {
        const token = localStorage.getItem('userToken');
        if (token) {
            try {
                setLoading(true)
                const response = await fetch(`${url}/api/v1/web-users/verify-token`, {
                    method: "GET",
                    headers: {
                        authorization: `${token}`
                    }
                })

                if (response.ok) {
                    const result = await response.json()
                    setRemainingTime(result?.remainingTime)
                    const userId = localStorage.getItem('uuid');
                    if (userId) {
                        try {
                            const response2 = await fetch(`${url}/api/v1/web-users/get/${userId}`, {
                                method: 'GET',
                                headers: {
                                    authorization: `${token}`
                                }
                            })
                            if (response2.ok) {
                                const userResult = await response2.json();
                                setReviewData((prevData) => ({
                                    ...prevData,
                                    reviewer: `${userResult?.data?.first_name} ${userResult?.data?.last_name}`,  // Set your desired name
                                    reviewer_email: userResult?.data?.email // Set your desired email
                                }));
                            }


                        } catch (error) {
                            localStorage.removeItem('uuid');
                        }
                    }
                }
            } catch (error) {
                localStorage.removeItem('userToken');
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }
    }



    useEffect(() => {
        checkToken()
    }, [])


    const [ratingCount, setRating] = useState(1);
    useEffect(() => {
        setReviewData((prevData) => ({
            ...prevData,
            rating: ratingCount,
            product_id: singleProductData?.uid,
            product_name: singleProductData?.name,
            product_permalink: singleProductData?.permalink
        }))
    }, [ratingCount])


    const [writeReview, setWriteReview] = useState(false);
    const handleWriteReview = () => {
        setWriteReview(true);
    }
    const handleWriteReviewClose = () => {
        setWriteReview(false)
    }

    useEffect(() => {
        if (writeReview) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [writeReview])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setReviewData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => { }, [reviewData])

    // Function to handle button click & trigger file input
    const fileInputRef = useRef(null);
    const [images, setImages] = useState([])



    const [imagesUrl, setImagesUrl] = useState([])
    // const handleImageChange = (e) => {
    //     const files = e.target.files;



    //     for (let i = 0; i < files.length; i++) {
    //         const file = files[i];
    //         if (files.length + images.length <= 5) { // Ensure no more than 5 images
    //             const newImages = [...images];
    //             const newImageUrls = [...imagesUrl];

    //             for (let i = 0; i < files.length; i++) {
    //                 newImages.push(files[i]); // Store file references
    //                 newImageUrls.push(URL.createObjectURL(files[i]));
    //             }
    //             setImages(newImages); // Update the images state
    //             setImagesUrl(newImageUrls);
    //         } else {
    //             snakeBarOpen('You can upload up to 5 images only.')
    //         }
    //     }
    // };

    const handleImageChange = (e) => {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 5 * 1024 * 1024) {
            snakeBarOpen('Each image must be less than 5MB.');
            return;
        }

        if (files.length + images.length <= 5) { // Ensure no more than 5 images
            const newImages = [...images];
            const newImageUrls = [...imagesUrl];

            for (let i = 0; i < files.length; i++) {
                newImages.push(files[i]); // Store file references
                newImageUrls.push(URL.createObjectURL(files[i]));
            }
            setImages(newImages); // Update the images state
            setImagesUrl(newImageUrls);
        } else {
            snakeBarOpen('You can upload up to 5 images only.');
        }
    }
};

    // const handleImageChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     const maxFilesAllowed = 5;
    //     const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    //     const newImages = [...images];
    //     const newImageUrls = [...imagesUrl];

    //     for (const file of files) {
    //         if (newImages.length >= maxFilesAllowed) {
    //             snakeBarOpen('You can upload up to 5 images only.');
    //             break;
    //         }

    //         if (file.size > maxSizeInBytes) {
    //             snakeBarOpen(`"${file.name}" is larger than 2MB.`);
    //             continue;
    //         }

    //         newImages.push(file);
    //         newImageUrls.push(URL.createObjectURL(file));
    //     }

    //     setImages(newImages);
    //     setImagesUrl(newImageUrls);
    // };



    useEffect(() => { }, [images])


    const handleSubmitReview = async (e) => {


        const formData = new FormData();


        formData.append("product_id", reviewData.product_id);
        formData.append("product_permalink", reviewData.product_permalink);
        formData.append("product_name", reviewData.product_name);
        formData.append("reviewer", reviewData.reviewer);
        formData.append("reviewer_email", reviewData.reviewer_email);
        formData.append("review_title", reviewData.review_title);
        formData.append("review", reviewData.review);
        formData.append("verified", reviewData.verified);
        formData.append("rating", reviewData.rating);
        formData.append("helpful", reviewData.helpful);

        images.forEach(image => {
            formData.append("images", image); // 'images' is the key on the backend
        });

        const api = `/api/v1/reviews/add`
        try {
            const reviewResponse = await axios.post(`${url}${api}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });



            setWriteReview(false)
            setReviewData(
                {
                    "product_id": 0,
                    "product_permalink": "",
                    "product_name": "",
                    "reviewer": "",
                    "reviewer_email": "",
                    "review_title": "",
                    "review": "",
                    "rating": 0,
                    "helpful": 0,
                    "images": [],
                },
            )
            setImages([])

        } catch (error) {
            console.error("UnExpected Server Error", error);
        }
    }



    const [showGuideLine, setShowGuideLine] = useState(false);
    const handleShowGuideline = () => {
        setShowGuideLine(!showGuideLine);
    }



    return (
        <>
            <div className="write_review_main">
                <button onClick={handleWriteReview} className="write_review_btn">Write a Review</button>
            </div>
            <div className={`write-review-modal ${writeReview ? 'show-review-modal' : ''}`}>

                <div className="write-review-inner-section">

                    <div className="write-review-inner-sub-section">
                        {/* <button
                            onClick={handleWriteReviewClose}
                            className="write-review-modal-close-button"
                        > */}
                            <IoIosClose size={25} className="write-review-modal-close-button" onClick={handleWriteReviewClose} />
                        {/* </button> */}
                        <h3 className="review-modal-main-heading">Please Share Your Experience</h3>

                        <div className="review-modal-head">
                            <div className="review-modal-product-details">
                                <p className="write-review-product-name">{productData?.name}</p>
                                <p className="write-review-comment-guide">Your feedback will help other shoppers make good choices, and we'll use it to improve our products.</p>
                                <p className="review-guideline" onClick={handleShowGuideline}>{showGuideLine ? 'Hide Guidelines' : 'Review Guidelines'}</p>
                                <div className={`review-guideline-details ${showGuideLine ? 'show-review-guideline' : ''}`}>
                                    <p>
                                        We value your input and invite you to rate and review your purchases. Be sure to explain why you like or dislike the product and focus on the product's features and your own experience using it.

                                        If you wish to comment about product selection, pricing, ordering, delivery or other issues, please contact our customer support.

                                        Please refrain from including any of the following in your review:

                                        Obscene or discriminatory language
                                        Critical or inappropriate comments about other reviews and shoppers
                                        Advertising, spam, references to other websites or retailers
                                        Personal information such as email addresses, phone numbers or physical addresses
                                        All reviews are subject to our store's Terms of Use.
                                    </p>
                                </div>
                            </div>
                            {productData?.image?.image_url !== undefined && <Image src={url + productData?.image?.image_url} width={220} height={120} alt="product" />}
                        </div>


                        <div className={`mobile-view-review-guideline-details ${showGuideLine ? 'mobile-view-show-review-guideline' : ''}`}>
                            <p>
                                We value your input and invite you to rate and review your purchases. Be sure to explain why you like or dislike the product and focus on the product's features and your own experience using it.

                                If you wish to comment about product selection, pricing, ordering, delivery or other issues, please contact our customer support.

                                Please refrain from including any of the following in your review:

                                Obscene or discriminatory language
                                Critical or inappropriate comments about other reviews and shoppers
                                Advertising, spam, references to other websites or retailers
                                Personal information such as email addresses, phone numbers or physical addresses
                                All reviews are subject to our store's Terms of Use.
                            </p>
                        </div>



                        {remainingTime === 0 ? (
                            <div className="user-email-and-name-container">

                                <div className="review-write-section">
                                    <h3>Name</h3>
                                    <input
                                        type="text"
                                        placeholder="Enter Your Name"
                                        name="reviewer"
                                        value={reviewData.reviewer}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="review-write-section">
                                    <h3>Email</h3>
                                    <input
                                        type="text"
                                        placeholder="Enter Email Address"
                                        name="reviewer_email"
                                        value={reviewData.reviewer_email}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>
                        ) : (<></>)}



                        <div className="review-overall-rating">
                            <h3>Overall rating</h3>
                            <RatingReview rating={ratingCount} setRating={setRating} />
                            {/* <RatingReview rating={(productData?.average_rating)} disabled={true} size={"20px"} /> */}
                        </div>

                        <div className="review-write-section">
                            <h3>Review</h3>
                            <textarea
                                rows={4}
                                maxLength={150}
                                name="review"
                                value={reviewData.review}
                                onChange={handleChange}
                            />
                            <p>
                                <IoInformationCircleOutline size={20} />
                                Make your review great: Describe what you liked, what you didn’t
                                like, and other key things shoppers should know (minimum 15 characters)
                            </p>
                        </div>

                        <div className="review-write-section">
                            <h3>Review Title</h3>
                            <input
                                type="text"
                                maxLength={15}
                                name="review_title"
                                value={reviewData.review_title}
                                onChange={handleChange}
                            />
                            <p>
                                <IoInformationCircleOutline size={20} />
                                Your overall impression (150 characters or less)
                            </p>
                        </div>

                        <div className="review-write-section">
                            <h3>Photos or videos</h3>
                            <div className="review-photos-or-video-container">
                                <input
                                    name="images"
                                    type="file"
                                    id="images"
                                    accept="image/*"
                                    multiple // Allows for multiple file selection
                                    onChange={handleImageChange} // Handle image selection
                                    // className="image_upload_review"
                                    hidden // Hide the default file input element
                                />
                                <label htmlFor="images">
                                    <CiCamera size={20} color="#4478C5" />
                                    Add Photo
                                </label>

                                <div>
                                    {imagesUrl.map((url, index) => (
                                        <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: '60px', height: '60px', margin: '5px' }} />
                                    ))}
                                </div>


                            </div>
                            <p>
                                <IoInformationCircleOutline size={20} />
                                You may add up to five photos or videos
                            </p>
                        </div>



                        <div className="submit-review-container">
                            <button type="button" onClick={handleSubmitReview} >
                                Submit
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
