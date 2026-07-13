import React from 'react';
import './AllBlogs.css';
import BlogCard from '../BlogCard/BlogCard';
import BlogCardShimmer from '../../Loaders/blogCardShimmer/BlogCardShimmer';
import { url } from '../../../../utils/api';
import { useRouter } from 'next/navigation';
import { useBlog } from '@/context/BlogsContext/blogsContext';
import Image from 'next/image';

const AllBlogs = ({ blogData }) => {

  // States and Variables
  const router = useRouter();

  // Functions
  const handleNavigate = (item) => {
    router.push(`/single-blog/${item.slug}`, { state: item });
  }


  const {
    isBlogLoading
  } = useBlog();


  return (
    <div className='blog-page-blog-cards-main-container'>
      {isBlogLoading && <div className='blog-loader'>
        <Image src={'/Assets/Loader-animations/loader-check-two.gif'} width={1590} height={800} alt='animation' />
        <p>Please Wait</p>
      </div>}
      {blogData?.length > 0 ? (
        blogData?.map((item, index) => (
          <div key={index} className='blog-cards-col'>
            <BlogCard
              singleBlog={item}
              blogMainImage={item?.image?.image_url ? `${url}${item.image.image_url}`: `/no-blog-img.jpg`}
              ind={index}
              blogCategory={item.category.name}
              blogTitle={item.title}
              blogPostDate={item.publishedDate}
              navigateToSinglePage={() => handleNavigate(item)}
              keyind={item?._id}
            />
          </div>
        ))
      ) : (
        Array.from({ length: 9 }).map((_, index) => (
          <BlogCardShimmer key={index} />
        ))
      )
      }
    </div>
  )
}

export default AllBlogs
