import React, { useEffect, useState } from 'react'
import './BlogCard.css'
import axios from 'axios'
import { url ,formatDate} from '../../../../utils/api'
import Link from 'next/link'
import Image from 'next/image'
import { FaRegClock, FaEye } from "react-icons/fa";

const BlogCard = ({
  blogMainImage,
  navigateToSinglePage,
  blogCategory,
  blogTitle,
  blogPostDate,
  ind,
  keyind,
  singleBlog
}) => {
  const [animButton, setAnimButton] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false); // state to track image load

  const fetchVariableData = async () => {
    const api = `/api/v1/products/get/468`
    try {
      const response = await axios.get(`${url}${api}`);
    } catch (error) {
      console.error("error", error);
    }
  }

  useEffect(() => {
    fetchVariableData();
  }, [])

  const handleButtonsAnimation = (ind) => {
    setAnimButton(ind);
  }

  const handleButtonAnimEnd = () => {
    setAnimButton(null)
  }

  const maxLength = 40;
  const truncateTitle = (title, maxLength) => {
    if (!title) return '';
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
  };



  return (
    <Link
      href={`/single-blog/${singleBlog.slug}`}
      className='blog-card-main-container'
      onMouseEnter={() => handleButtonsAnimation(ind)}
      onMouseLeave={handleButtonAnimEnd}
      // onClick={navigateToSinglePage}
      key={keyind}
    >
      <div className='blog-card-main-image-div'>
        {!imageLoaded && <div className='blog-image-shimmer'></div>}
        <img
          src={blogMainImage}
          alt='main'
          className={`blog-card-main-image-class ${imageLoaded ? 'visible' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
      </div>

      <div className='blog-card-content-div'>
        <Link className='blog-card-category' href={'#'}>{blogCategory}</Link>
        <h3 className='blog-card-main-title'>{blogTitle}</h3>
        <div className={`blog-card-footer-buttons ${animButton === ind ? 'increase-padding-anim' : ''}`}>
          <div className='blog-view-and-read-container'>
            <span>
              <FaRegClock size={10} color='#595959' />
              {singleBlog.readTime}min
            </span>
            <span>
              <FaEye size={10} color='#595959' />
              {singleBlog.totalViews}
            </span>
          </div>
          <p className='blog-card-post-date'>{formatDate(blogPostDate)}</p>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
