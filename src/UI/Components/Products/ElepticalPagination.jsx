import React from 'react';
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from 'react-icons/fa';
import './Products.css';

const ElipticalPagenation = ({
  activePageIndex,
  totalPages,
  onPrevPage,
  onNextPage,
  onPageChange,
  marginTop = '0px',
  innerTop = '10px',
  innerBottom = '10px',
}) => {


  const generatePages = () => {
    const pages = [];
    const lastPage = totalPages;

    // If few pages, just show all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Case: near the end → show last 4 pages
    if (activePageIndex >= totalPages - 3) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        if (i > 0) pages.push(i);
      }
      return pages;
    }

    // Default case → show current page centered with 3 pages, then ellipsis, then last page
    let start = activePageIndex - 1;
    let end = activePageIndex + 1;

    // Clamp so it never goes below 1
    if (start < 1) {
      start = 1;
      end = 3;
    }

    // Always exactly 3 before dot
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis & last page
    if (end < lastPage - 1) {
      pages.push('...');
      pages.push(lastPage);
    }

    return pages;
  };


  const pages = generatePages();

  return (
    <div className='view-more-products-pagination-main' style={{ marginTop: marginTop }}>
      {totalPages > 1 && (
        <div className='pagination-buttons-container' style={{ marginTop: innerTop, marginBottom: innerBottom }}>

          <span
            className={activePageIndex === 1 ? 'disabled' : ''}
            onClick={onPrevPage}
            style={{
              pointerEvents: activePageIndex === 1 ? 'none' : 'auto',
              color: activePageIndex === 1 ? '#ccc' : '#4487C5',
            }}
          >
            <FaRegArrowAltCircleLeft size={18} /> Prev
          </span>

          {pages.map((page, idx) => {
            if (page === 'start-ellipsis' || page === 'end-ellipsis' || page === '...') {
              return (
                <span key={idx} className='dots'>
                  ...
                </span>
              );
            }

            return (
              <span
                key={idx}
                onClick={() => onPageChange(page)}
                className={activePageIndex === page ? 'active-page-span' : ''}
              >
                {page}
              </span>
            );
          })}

          <span
            className={activePageIndex === totalPages ? 'disabled' : ''}
            onClick={onNextPage}
            style={{
              pointerEvents: activePageIndex === totalPages ? 'none' : 'auto',
              color: activePageIndex === totalPages ? '#ccc' : '#4487C5',
            }}
          >
            Next <FaRegArrowAltCircleRight size={18} />
          </span>
        </div>
      )}
    </div>
  );
};

export default ElipticalPagenation;