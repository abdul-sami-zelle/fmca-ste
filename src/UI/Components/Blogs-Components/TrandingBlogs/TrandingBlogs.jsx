import React from 'react'
import './TrandingBlogs.css'
// import { url } from '../../../../utils/api'
import { url,formatDate } from '@/utils/api'
import { useRouter } from 'next/navigation'
// import {useNavigate } from 'react-router-dom'

const TrandingBlogs = ({blogs}) => {
    // const navigate = useNavigate();
    const router = useRouter()
    const navigateToSingleBlog = (item) => {
        router.push(`/single-blog/${item.slug}`, {state:  item});
    }

    return (
        <div className='tranding-blogs-main-section'>
            <h3>Trending</h3>
            <div className='tranding-blogs-cards'>
                {blogs?.map((item, index) => (
                    <div key={index} className='tranding-single-blog-card' onClick={() => navigateToSingleBlog(item)}>
                        <img src={`${url}${item.image.image_url}`} alt='imm' className='tranding-blog-man-image' />
                        <div className='tranding-blog-content'>
                            <h3 className='tranding-blog-name'>{item.title}</h3>
                            <p className='tranding-blog-post-date'>{formatDate(item.publishedDate)}</p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default TrandingBlogs
