

'use client'

import React, { useEffect, useState } from 'react'
import './BlogPage.css';
import BlogHead from '@/UI/Components/Blogs-Components/BlogsHead/BlogHead';
import AllBlogs from '@/UI/Components/Blogs-Components/AllBlogs/AllBlogs';
import { useBlog } from '@/context/BlogsContext/blogsContext';
import ElipticalPagenation from '@/UI/Components/Products/ElepticalPagination';
import { useRouter, useSearchParams } from 'next/navigation';

const BlogPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    blogs,
    blogCategories,
    fetchBlogs,
    activeCategory,
    setActiveCategory,
    totalPages,
    currentPage,
    setCurrentPage,
  } = useBlog();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!blogCategories?.length) return;

    const pageParam = searchParams.get('page');
    const categoryParam = searchParams.get('category');

    const categoryIndex = categoryParam
      ? blogCategories.findIndex(cat => cat.slug === categoryParam)
      : 0;

    const resolvedIndex = categoryIndex >= 0 ? categoryIndex : 0;
    const resolvedPage = pageParam ? parseInt(pageParam, 10) : 1;

    setActiveCategory(resolvedIndex);
    setCurrentPage(resolvedPage);

    setIsInitialized(true);
  }, [blogCategories]);
  // When activeCategory or currentPage change (user clicks), update URL + fetch
  useEffect(() => {
    if (!isInitialized) return;
    if (!blogCategories?.length) return;

    const selectedCategory = blogCategories[activeCategory];

    const params = new URLSearchParams();

    if (activeCategory !== 0) {
      params.set('category', selectedCategory?.slug);
    }

    if (currentPage > 1) {
      params.set('page', currentPage);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';

    router.replace(newUrl || window.location.pathname, {
      scroll: false,
    });

    fetchBlogs(selectedCategory?._id, currentPage);

  }, [activeCategory, currentPage, isInitialized]);

  const handleActivePage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  return (
    <div className='blogs-page-main-container'>
      <div className='blogs-page-main-heading-div'>
        <h1 className='blogs-page-main-heading'>Exciting Blogs Created by <span> Furniture Mecca </span></h1>
        {/* <h2 className='mobile-view-blog-page-main-heading'>Exciting Blogs</h2> */}
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
  );
};

export default BlogPage;
