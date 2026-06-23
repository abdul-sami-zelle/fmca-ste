'use client'
import React, { useState, useRef, useEffect } from 'react'
import './FAQ.css'
import { IoCheckmark } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useRouter } from 'next/router';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { BsArrowRightShort } from "react-icons/bs";

const FAQ = () => {

    const [activeIndex, setActiveIndex] = useState(null)
    const [seeMore, setSeeMore] = useState(false);
    const answerRef = useRef([]);
    useEffect(() => {
        answerRef.current.forEach(ref => {
            if (ref) ref.style.height = '0px';
        });

        if (activeIndex !== null) {
            answerRef.current[activeIndex].style.height = answerRef.current[activeIndex].scrollHeight + 'px';
        }
    }, [activeIndex])

    const params = useParams();
    const slug = params['product-archive'];
    const [faqs, setFaqs] = useState([]);
    const [content,setContent] = useState({
        heading:"",
        paragraph:""
    })
    const getFAQs = async () => {
        const api = `https://fmapi.myfurnituremecca.com/api/v1/category-faqs/get-by-slug/${slug}`;

        try {
            const response = await axios.get(api);
            if (response.status === 200) {
                setFaqs(response.data.data.faqs);
                setContent(
                    {
                        heading:response.data.data?.content?.heading || "",
                        paragraph:response.data.data?.content?.paragraph || ""
                    }
                )
            }
        } catch (error) {
            console.error("UnExpected Server Error", error);
        }

    }

    useEffect(() => { 
        getFAQs()
    }, [])
    

    const handleToggle = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null)
        } else {
            setActiveIndex(index)
        }
    }

    return (
        <>
            <div className='flexable-payment-option'>
                <h3>Need A Flexable Payment Option?</h3>
                <div className='flexable-payment-features'>
                    <span>
                        <i><IoCheckmark size={20} /> </i>
                        <p> Pre-qualify without affecting your credit</p>
                    </span>
                    <span>
                        <i><IoCheckmark size={20} /> </i>
                        <p> No credit needed option</p>
                    </span>
                </div>
                <div className='flexable-payment-features'>
                    <span>
                        <i><IoCheckmark size={20} /> </i>
                        <p> No money down plans available</p>
                    </span>
                    <span>
                        <i><IoCheckmark size={20} /> </i>
                        <p> Monthly payments, pay as you go!</p>
                    </span>
                </div>
                <button>Learn more</button>
            </div>

            <div className='f-a-q-main-container'>
                {content.heading && content.paragraph && <div className='faq-details'>
                    {content.heading && <p>{content.heading}</p>}
                    {content.paragraph && <p>{content.paragraph}</p>}
                </div>}
                {faqs?.length > 0 && (
                    <div className={`questions-answeres ${seeMore ? 'show-all' : ''}`}>
                        <p className='faq-heading'>FAQs</p>
                        {faqs?.slice(0, seeMore ? faqs.length : 2).map((item, index) => {
                            return <div key={index} className='question-toggler'>
                                <div className='question-section' onClick={() => handleToggle(index)}>
                                    <p>{item.question}</p>
                                    <i className='add-button-round'>
                                        {activeIndex === index ? <FaMinus size={15} color='var(--secondary-color)' /> : <FaPlus size={15} color='var(--secondary-color)' />}
                                    </i>
                                </div>
                                <div className={`answere-section ${activeIndex === index ? 'show-answere' : ''}`}
                                    ref={el => answerRef.current[index] = el}
                                    style={{ height: activeIndex === index ? `${answerRef.current.scrollHeight}px` : '0px' }}
                                >
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        })}
                    </div>
                )}

                <div className='faq-see-more-button-container'>
                    <button onClick={() => setSeeMore(!seeMore)} className='faq-see-more-button'> {seeMore ? 'See Less' : 'See More'} <BsArrowRightShort className={`rotate-see-more-arrow ${seeMore ? 'active-rotate' : ''}`} size={20} color='var(--color-primary)' /></button>
                </div>


            </div>
        </>
    )
}

export default FAQ
