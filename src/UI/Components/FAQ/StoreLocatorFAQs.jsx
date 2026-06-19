'use client';

import React, { useState, useRef, useEffect } from 'react';
import './FAQ.css';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { BsArrowRightShort } from 'react-icons/bs';

const StoreLocatorFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [seeMore, setSeeMore] = useState(false);
  const answerRef = useRef([]);

  const faqs = [
    {
      question: 'How do I find the nearest Furniture Mecca store?',
      answer:
        'You can find the nearest store by entering your ZIP code in the store locator search bar. The system will automatically show the closest Furniture Mecca locations based on your input.',
    },
    {
      question: 'Can I use my current location to find a store?',
      answer:
        'Yes. The store locator allows you to enable "Use Current Location", which detects nearby Furniture Mecca stores and displays the closest options instantly.',
    },
    {
      question: 'Where can I buy living room furniture near me?',
      answer:
        'Furniture Mecca showrooms offer complete living room sets including sofas, sectionals, recliners, and coffee tables. Use the locator to find the nearest store with available collections.',
    },
    {
      question: 'Where can I buy dining room furniture near me?',
      answer:
        'Furniture Mecca stores carry a variety of dining tables, chairs, and complete dining sets. Use the store locator to find nearby options.',
    },
    {
      question: 'Does Furniture Mecca offer financing options?',
      answer:
        'Yes, Furniture Mecca offers flexible financing options at most store locations, subject to approval. Visit your nearest store for eligibility details.',
    },
    {
      question: 'Can I call a Furniture Mecca store before visiting?',
      answer:
        'Yes. Each store listing includes a direct phone number, so you can call ahead to confirm product availability, pricing, or store hours before visiting.',
    },
    {
      question: 'What is the purpose of the Furniture Mecca store locator?',
      answer:
        'The store locator helps users quickly identify the nearest Furniture Mecca showroom based on location input and provides access to store details such as contact information, product availability, and store hours.',
    },
  ];

  useEffect(() => {
    answerRef.current.forEach((ref) => {
      if (ref) ref.style.height = '0px';
    });

    if (activeIndex !== null && answerRef.current[activeIndex]) {
      answerRef.current[activeIndex].style.height =
        answerRef.current[activeIndex].scrollHeight + 'px';
    }
  }, [activeIndex]);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="f-a-q-main-container">
      {/* <div className="faq-details">
        <h2>Frequently Asked Questions</h2>
        <p>
          Find answers to common questions about locating Furniture Mecca
          stores, financing options, product availability, and showroom
          information.
        </p>
      </div> */}

      <div className={`questions-answeres show-all`}>
        <p className="faq-heading">FAQs</p>

        {faqs
          .slice(0, seeMore ? faqs.length : 12)
          .map((item, index) => (
            <div key={index} className="question-toggler">
              <div
                className="question-section"
                onClick={() => handleToggle(index)}
              >
                <p>{item.question}</p>

                <i className="add-button-round">
                  {activeIndex === index ? (
                    <FaMinus
                      size={15}
                      color="var(--secondary-color)"
                    />
                  ) : (
                    <FaPlus
                      size={15}
                      color="var(--secondary-color)"
                    />
                  )}
                </i>
              </div>

              <div
                className={`answere-section ${
                  activeIndex === index ? 'show-answere' : ''
                }`}
                ref={(el) => (answerRef.current[index] = el)}
                style={{ height: '0px', overflow: 'hidden' }}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StoreLocatorFAQ;