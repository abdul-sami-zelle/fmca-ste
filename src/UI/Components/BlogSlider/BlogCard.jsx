import React from 'react'
import './BlogCard.css';
import { url } from '../../../utils/api';
import Image from 'next/image';
import RatingReview from '../starRating/starRating';
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaRegClock, FaEye } from "react-icons/fa";

const BlogCard = (
    {
        img, 
        title, 
        comments,
        navigateToSingleBlog,
        date,
        month,
        start,
        totalViews,
        readTime,
    }) => {

    

  return (
    <>
        <div className='blog-card' onClick={navigateToSingleBlog}>
            <div className='blog-card-image'>
                <div className='blog-date-tag'>
                    <p>{date}</p>
                    <p>{month}</p>
                </div>
                {img ? <Image src={`${url}${img}`} width={640} height={330} alt='img' /> : <Image src={`/no-blog-img.jpg`} width={640} height={330} alt='img' />}
            </div>
            <div className='blog-arther-details'>
                <h3>{title}</h3>
                <div className='blog-created-by-and-comments'>
                    <div className='blog-star-rating'>
                        <FaRegClock size={10} color='#595959' />
                         {readTime} min
                    </div>
                    <p className='blog-total-reviews'> <FaEye size={10} color='#595959' /> {totalViews} Views</p>
                </div>
            </div>
            {/* <div className='blog-para-and-see-more'>
                <p>
                {start?.length > 200 ? `${start.substring(0, 200)}...` : start}
                </p>
                <button>
                    Read more
                    <MdKeyboardArrowRight size={20} className='blog-card-button-arrow' />
                </button>
            </div> */}
        </div> 
    </>
  )
}

export default BlogCard
