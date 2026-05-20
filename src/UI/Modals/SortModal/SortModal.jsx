import React, { useEffect } from 'react'
import './SortModal.css';
import { IoIosClose } from "react-icons/io";


const SortModal = ({ isOpenSort, handleCloseSortModal, setSelectedOption, handleSelect }) => {
  useEffect(() => {
    if (isOpenSort) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpenSort])

  const sortOptions = [
    { name: 'Recent' },
    { name: 'By Price (Low to High)' },
    { name: 'By Price (High to Low)' },
    { name: 'Alphabetic (A to Z)' },
    { name: 'Alphabetic (Z to A)' },
    { name: 'By Ratings (Low to High)' },
    { name: 'By Ratings (High to Low)' },
  ]

  return (
    <div className={`sort-product-modal-main-container ${isOpenSort ? 'open-sort-product-modal' : ''}`} onClick={handleCloseSortModal}>
      <div className='sort-product-modal-inner-container' onClick={(e) => e.stopPropagation()}>
        <button onClick={handleCloseSortModal} className='sort-modal-close-button'>
          <IoIosClose size={20} color='var(--secondary-color)' />
        </button>
        {sortOptions.map((item, index) => (
          <p key={index} onClick={() => {
            handleSelect(item.name)
            setSelectedOption(item.name);
            handleCloseSortModal()
          }}>{item.name}</p>
        ))}
      </div>
    </div>
  )
}

export default SortModal
