import React from 'react'
import './StaticShimmer.css'

const StatickShimmer = () => {
  return (
    // Array.from({length: 3}).map((_, index) => (
    <div className='static-pages-shimmer-main-contianer'>
      <div className='static-shimmer-head'>
        <div className='static-shimmer-heading'></div>
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div className='static-shimmer-body-container'>

          <div className='static-shimmer-body-heading'></div>
          <div className='static-shimmer-body-content-container'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div className='static-shimmer-content-line'></div>
            ))}
          </div>
        </div>
      ))}

    </div>
    // ))
  )
}

export default StatickShimmer