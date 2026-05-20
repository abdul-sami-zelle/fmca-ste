import React, { useEffect, useRef, useState } from 'react';
import './BlogHead.css';
import { useBlog } from '../../../../context/BlogsContext/blogsContext';

const BlogHead = ({ blogCategories }) => {
  const {
    activeCategory,
    setActiveCategory,
    isBlogCatLoading,
    fetchBlogs,
    currentPage,
  } = useBlog();

  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categoryRefs = useRef([]);
  const indicatorRef = useRef(null);

  const hoverIndexRef = useRef(null);
  const lastMovedIndex = useRef(null);

  const moveIndicator = () => {
    const index =
      hoverIndexRef.current != null
        ? hoverIndexRef.current
        : activeCategory;

    if (lastMovedIndex.current === index) return;

    const el = categoryRefs.current[index];
    if (el && indicatorRef.current) {
      indicatorRef.current.style.width = `${el.offsetWidth}px`;
      indicatorRef.current.style.left = `${el.offsetLeft}px`;
      indicatorRef.current.style.opacity = '1';
      lastMovedIndex.current = index;
    }
  };

  const handleHover = (index) => {
    setHoveredCategory(index);
    hoverIndexRef.current = index;
    moveIndicator();
  };

  const handleLeave = () => {
    setHoveredCategory(null);
    hoverIndexRef.current = null;
    moveIndicator();
  };

  const handleClick = (index) => {
    setActiveCategory(index);
    hoverIndexRef.current = null;
    lastMovedIndex.current = null; // force recalc
    moveIndicator();
  };

  useEffect(() => {
    moveIndicator();
  }, [activeCategory, blogCategories]);

  useEffect(() => {
    const handleResize = () => {
      lastMovedIndex.current = null;
      moveIndicator();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (blogCategories?.length > 0) {
      fetchBlogs(blogCategories[activeCategory]?._id, currentPage);
    }
  }, [activeCategory]);

  return (
    <>
      <div className='blog-head-main-container'>
        {isBlogCatLoading
          ? [...Array(5)].map((_, index) => (
              <div
                key={index}
                className='blog-head-category-shimmer shimmer'
              ></div>
            ))
          : blogCategories.map((item, index) => (
              <p
                key={index}
                ref={(el) => (categoryRefs.current[index] = el)}
                className={`blog-head-category-type ${
                  activeCategory === index && hoveredCategory === null ? 'active-category' : ''
                } ${hoveredCategory === index ? 'hovered-category' : ''}`}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={handleLeave}
                onClick={() => handleClick(index)}
              >
                {item.name}
              </p>
            ))}
        {!isBlogCatLoading && (
          <span className='indicator' ref={indicatorRef}></span>
        )}
      </div>

      {/* Mobile version unchanged */}
      <div className='mobile-view-blog-head-main-container'>
        {isBlogCatLoading
          ? [...Array(5)].map((_, index) => (
              <div
                key={index}
                className='mobile-blog-category-shimmer shimmer'
              ></div>
            ))
          : blogCategories.slice(0, 6).map((item, index) => (
              <p
                key={index}
                className={`mobile-view-blog-head-category-type ${
                  activeCategory === index ? 'active-blog-category' : ''
                }`}
                onClick={() => handleClick(index)}
              >
                {item.name}
              </p>
            ))}
      </div>
    </>
  );
};

export default BlogHead;
