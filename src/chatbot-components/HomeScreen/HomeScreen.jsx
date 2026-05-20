import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { MdOutlineCalendarToday } from "react-icons/md";
import { FaRegWindowMinimize } from "react-icons/fa";
import { faqData } from "../../Data/Data";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import Footer from "../Footer/Footer";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { useChatOpenContext } from "@/context/ChatbotContext/ChatbotContext";
import Link from "next/link";

const HomeScreen = ({
  onClose,
  onOpenChatUs,
  onFaqClick,
  onOpenConversationList,
  activeTab,
  onTabClick,
}) => {
  const [showAllConversations, setShowAllConversations] = useState(false);
  const [isTeamOnline, setIsTeamOnline] = useState(false);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning!");
  // const [visibleCount, setVisibleCount] = useState(5);
  const [allFaqs, setAllFaqs] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);


  const handleCategoryClick = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  useEffect(() => {
    const flatFaqs = faqData.flatMap(({ category, FAQs }) =>
      FAQs.map((faq) => ({ ...faq, category }))
    );

    setAllFaqs(flatFaqs);
  }, []);

  const groupedFaqs = allFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const allCategoryNames = Object.keys(groupedFaqs);
  const visibleCategoryNames = showAllFaqs
    ? allCategoryNames
    : allCategoryNames.slice(0, 5);

  // const handleSeeMore = () => {
  //   setVisibleCount((prev) => Math.min(prev + 5, allFaqs.length));
  // };

  const conversations = [
    {
      name: "Zoe",
      message: "Hi there! Great to see you back again a...",
      img: "https://cdn.servicebell.com/assets/bella-idle-default.c62aea33..jpeg",
    },
    {
      name: "Zoe",
      message: "Hello, nice to meet you! How can I help ...",
      img: "https://cdn.servicebell.com/assets/bella-idle-default.c62aea33..jpeg",
    },
    {
      name: "Zoe",
      message: "Hello, nice to meet you! How can I help ...",
      img: "https://cdn.servicebell.com/assets/bella-idle-default.c62aea33..jpeg",
    },
    {
      name: "Zoe",
      message: "Just let me know if you have any questi...",
      img: "https://cdn.servicebell.com/assets/bella-idle-default.c62aea33..jpeg",
    },
  ];

  const visibleConversations = showAllConversations
    ? conversations
    : conversations.slice(0, 2);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning!");
    else if (hour < 18) setGreeting("Good Afternoon!");
    else setGreeting("Good Evening!");

    const online = Math.random() < 0.6;
    setIsTeamOnline(online);
  }, []);


  // Video
  const [isMuted, setIsMuted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const {handleStartScreenClose} = useChatOpenContext()


  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
    videoRef.current?.play();
  };

  const handleVideoEnded = () => {
    videoRef.current?.pause();
    handleStartScreenClose()
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="home-screen-container-main">
      <div className="home-screen-subcontainer">
        <div className="video-section-wrapper">

          {/* {!videoLoaded && ( */}
            <img
              className="background-placeholder"
              src={`https://fmapi.myfurnituremecca.com/uploads/zoe/zoe.jpg`}
              alt="AI Chatbot Placeholder"
            />
          {/* )} */}

          {/* <video
            className={`background-video ${videoLoaded ? 'visible' : 'hidden'}`}
            ref={videoRef}
            autoPlay
            muted={isMuted}
            playsInline
            onCanPlayThrough={handleVideoCanPlay}
            onEnded={handleVideoEnded}
          >
            <source src={`https://fmapi.myfurnituremecca.com/uploads/zoe/video.mp4" type="video/mp4`} />
            Your browser does not support the video tag.
          </video> */}

          <div className="ai-label" onClick={toggleMute}>
            {!isMuted ? <HiSpeakerWave size={15} color="#6658f1" /> : <HiSpeakerXMark size={15} color="#6658f1" />}
          </div>
          {/* <RxCross2
            className="RxCross2"
            onClick={(e) => {
              e.stopPropagation();
              handleStartScreenClose();
            }}
          /> */}

          {/* <img
            className="background-video"
            src="/Assets/chat/Images/ai-chatbot.gif"
            alt="AI Chatbot animation"
          /> */}
          <div className="video-overlay-content">
            <div className="headerssss">
              <FaRegWindowMinimize
                className="cross-iconxxxxx"
                onClick={onClose}
              />
            </div>

            <div>
              <div className="greeting">
                <h2>{greeting}</h2>
                <p>How can we help you today?</p>
              </div>

              <div className="ai-button-container" onClick={onOpenChatUs}>
                <div className="btn-overlay"></div>
                <div className="image-with-text">
                  <div className="ai-avatar-image-wrapper">
                    <div className="ai-label-text">AI</div>
                    <div className="online-dot"></div>
                    <div className="avatar-image-inner">
                      <img
                        // src="https://cdn.servicebell.com/assets/bella-idle-default.c62aea33..jpeg"
                        src={`https://fmapi.myfurnituremecca.com/uploads/zoe/zoe.jpg`}
                        alt="AI Avatar"
                        className="avatar-image"
                      />
                    </div>
                  </div>
                  <span className="talk-to-ai-text">
                    Chat with Digital Assistant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-screen-box">

          <Link className="meeting-us-btn" href={'/book-an-appointment'}>
            <p >
              <MdOutlineCalendarToday className="meeting-us-icon" /> Book
              Meeting
            </p>
          </Link>

          {/* <div className="support-people-list">
            {conversations.length > 0 && (
              <>
                <div className="support-people-items">
                  {visibleConversations.map((c, i) => (
                    <div className="support-person" key={i}>
                      <div className="avatar-wrapper">
                        <img src={c.img} alt={c.name} />
                        <span className="ai-label-txt">AI</span>
                      </div>
                      <div className="message-info">
                        <p className="person-name">{c.name}</p>
                        <p className="message-preview">{c.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {!showAllConversations && conversations.length > 2 && (
                  <div className="see-all" onClick={onOpenConversationList}>
                    See all conversations
                  </div>
                )}
              </>
            )}
          </div> */}
          <div className="support-people-list">
            <h2>Frequently Asked Questions</h2>
            <div className="faq">
              {visibleCategoryNames.map((category) => (
                <div key={category} className="faq-category-group">
                  <div
                    className="faq-category-title"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <span>{category}</span>
                    <span className="faq-toggle-icon">
                      {expandedCategory === category ? (
                        <AiOutlineMinus />
                      ) : (
                        <AiOutlinePlus />
                      )}
                    </span>
                  </div>

                  <div
                    className={`faq-questions-wrapper ${expandedCategory === category ? "open" : ""
                      }`}
                  >
                    <div className="faq-questions">
                      {groupedFaqs[category].map((faq) => (
                        <div
                          key={faq.id}
                          className="faqitem"
                          onClick={() => onFaqClick && onFaqClick(faq)}
                        >
                          {faq.question}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!showAllFaqs && allCategoryNames.length > 5 && (
              <div
                className="view-all-faqs"
                onClick={() => setShowAllFaqs(true)}
              >
                See More
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer activeTab={activeTab} onTabClick={onTabClick} />
    </div>
  );
};

export default HomeScreen;
