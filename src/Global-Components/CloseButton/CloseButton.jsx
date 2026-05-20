import Image from 'next/image'
import React from 'react'
import './CloseButton.css'

const CloseButton = ({svgColor = 'charcoal', handleClose, position, top, left, right}) => {
  return (
    <button className='close-button-comp' onClick={handleClose} style={{position: position, top: top, left: left, right, right}}>
        <Image src={svgColor === 'white' ? '/icons/close-white.svg' : '/icons/close-charcoal.svg'} width={15} height={15} alt='close-icon' />
    </button>
  )
}

export default CloseButton