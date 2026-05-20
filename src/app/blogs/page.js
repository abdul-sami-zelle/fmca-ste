'use client'

import React, { useEffect } from 'react'
import './BlogPage.css';
import BlogHead from '@/UI/Components/Blogs-Components/BlogsHead/BlogHead';
import AllBlogs from '@/UI/Components/Blogs-Components/AllBlogs/AllBlogs';
import { useBlog } from '@/context/BlogsContext/blogsContext';
import ElipticalPagenation from '@/UI/Components/Products/ElepticalPagination';

const BlogPage = () => {

  const {
    blogs,
    blogCategories,
    fetchBlogs,
    activeCategory,
    totalPages,
    currentPage,
    setCurrentPage,
  } = useBlog()


  useEffect(() => {
    fetchBlogs(blogCategories?.[activeCategory]?._id, currentPage);
  }, [activeCategory, currentPage, blogCategories]);

  const handleActivePage = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);

      if(typeof window !== 'undefined') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }

    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      if(typeof window !== 'undefined') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  };


  return (
    <div className='blogs-page-main-container'>
      <div className='blogs-page-main-heading-div'>
        <h3 className='blogs-page-main-heading'>Exciting Blogs Created by <span> Furniture Mecca </span></h3>
        <h3 className='mobile-view-blog-page-main-heading'>Exciting Blogs</h3>
      </div>
      <BlogHead blogCategories={blogCategories} />
      <AllBlogs blogData={blogs} />
      <ElipticalPagenation
        activePageIndex={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onPageChange={handleActivePage}
        onNextPage={handleNextPage}
      />
    </div>
  )
}

export default BlogPage
