import React, { useState, useRef, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { FiSend } from "react-icons/fi";
import { RiArrowLeftSLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { faqData } from "../../Data/Data";
import "./style.css";

const ChatUs = ({ onBack, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(true);
  const fileInputRef = useRef(null);
  const [faqCategories, setFaqCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [userTyped, setUserTyped] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showStartNew, setShowStartNew] = useState(false);
  const [questionClicked, setQuestionClicked] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFollowUpFromHome, setShowFollowUpFromHome] = useState(false);

  const messageEndRef = useRef(null);
  const followUpTimeoutRef = useRef(null);
  const waitingForFollowUpRef = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, isBotTyping, selectedCategory, showQuestions]);

  useEffect(() => {
    const selectedFaq = window.selectedFaqFromHome;

    if (selectedFaq) {
      const userMsg = {
        id: 1,
        text: selectedFaq.question,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([userMsg]);
      delete window.selectedFaqFromHome;

      setTimeout(() => {
        setIsBotTyping(true);

        setTimeout(() => {
          const botMsg = {
            id: 2,
            text: selectedFaq.answer,
            sender: "bot",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, botMsg]);
          setIsBotTyping(false);

          setTimeout(() => {
            setIsBotTyping(true);
            setTimeout(() => {
              const followUp = {
                id: 3,
                text: "Do you have any other questions I can help with?",
                sender: "bot",
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, followUp]);
              setMessages((prev) => [
                ...prev,
                {
                  id: prev.length + 1,
                  sender: "bot",
                  type: "yes-no-buttons",
                  timestamp: new Date(),
                  onYes: handleConfYes,
                  onNo: handleConfNo,
                },
              ]);
              // setShowFollowUpFromHome(true);
              setIsBotTyping(false);
            }, 1000);
          }, 2000);
        }, 2000);
      }, 500);
    }
  }, []);


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newMessage = {
        id: messages.length + 1,
        text: `📷 Image sent: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(followUpTimeoutRef.current);
    };
  }, []);

  const handleSend = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessages((prev) =>
      prev.filter(
        (msg) =>
          msg.type !== "category-buttons" &&
          msg.type !== "faq-questions" &&
          msg.type !== "yes-no-buttons"
      )
    );

    setMessage("");
    setShowEmojiPicker(false);
    setUserTyped(true);

    if (showFollowUp) setShowFollowUp(false);
    if (showConfirmation) setShowConfirmation(false);

    if (!selectedCategory) {
      setFaqCategories([]);
    } else if (selectedCategory && !questionClicked) {
      setShowQuestions(false);
    }

    const isFlowActive =
      selectedCategory && questionClicked && !questionAnswered;

    if (!isFlowActive) {
      setTimeout(() => {
        setIsBotTyping(true);
        setTimeout(() => {
          const botMessage = {
            id: messages.length + 2,
            text: "I think you want to discuss a topic that is not on the list. Is that correct?",
            sender: "bot",
            timestamp: new Date(),
          };

          const buttonMessage = {
            id: messages.length + 3,
            sender: "bot",
            type: "yes-no-buttons",
            timestamp: new Date(),
            onYes: handleYes,
            onNo: handleNo,
          };

          setMessages((prev) => [...prev, botMessage, buttonMessage]);
          setIsBotTyping(false);
        }, 2000);
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  useEffect(() => {
    if (messages.length > 0 || window.selectedFaqFromHome || showStartNew)
      return;

    const timeout = setTimeout(() => {
      setMessages([
        {
          id: 1,
          text: `👋 Welcome back to Furniture Mecca — it’s great to see you again! 💡 Looking for something new or need help with a past order? I’m here to help!`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);

      setTimeout(() => {
        setFaqCategories(faqData);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "bot",
            type: "category-buttons",
            timestamp: new Date(),
          },
        ]);
      }, 1000);

      setIsBotTyping(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: category.category,
        sender: "user",
        timestamp: new Date(),
      },
    ]);

    setMessages((prev) =>
      prev.filter((msg) => msg.type !== "category-buttons")
    );

    setQuestionClicked(false);
    setQuestionAnswered(false);
    setShowQuestions(false);
    setVisibleQuestions([]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "bot",
          type: "faq-questions",
          timestamp: new Date(),
        },
      ]);
      setVisibleQuestions(category.FAQs);
    }, 1000);
  };

  const handleFaqClick = (faq) => {
    setQuestionClicked(true);
    setQuestionAnswered(true);

    const userQuestion = {
      id: messages.length + 1,
      text: faq.question,
      sender: "user",
      timestamp: new Date(),
    };

    const botAnswer = {
      id: messages.length + 2,
      text: faq.answer,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userQuestion]);
    setMessages((prev) => prev.filter((msg) => msg.type !== "faq-questions"));
    setShowQuestions(false);
    setShowAnswer(false);

    setTimeout(() => {
      setIsBotTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, botAnswer]);
        setShowAnswer(true);
        setIsBotTyping(false);
        waitingForFollowUpRef.current = true;

        followUpTimeoutRef.current = setTimeout(() => {
          if (!waitingForFollowUpRef.current) return;

          setIsBotTyping(true);

          followUpTimeoutRef.current = setTimeout(() => {
            if (!waitingForFollowUpRef.current) {
              setIsBotTyping(false);
              return;
            }
            if (message.trim() !== "") {
              setIsBotTyping(false);
              return;
            }

            const followUpMessage = {
              id: messages.length + 1,
              text: "Do you have any other questions I can help with?",
              sender: "bot",
              timestamp: new Date(),
            };

            const yesNoButtons = {
              id: messages.length + 2,
              sender: "bot",
              type: "yes-no-buttons",
              timestamp: new Date(),
              onYes: handleConfYes,
              onNo: handleConfNo,
            };

            setMessages((prev) => [...prev, followUpMessage, yesNoButtons]);
            setIsBotTyping(false);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 500);
  };

  const handleYes = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: "Yes",
        sender: "user",
        timestamp: new Date(),
      },
      {
        id: prev.length + 2,
        text: (<>
            I’m sorry, I don’t have the information you’re looking for right now. 
      Please reach out to our Customer Care team at{" "}
      <a href="mailto:meccacustomercare@gmail.com">
        meccacustomercare@gmail.com
      </a>
      , and they’ll be happy to assist you further.
        </>),
        // `I’m sorry, I don’t have the information you’re looking for right now. Please reach out to our Customer Care team at ${<a href="mailto:meccacustomercare@gmail.com">meccacustomercare@gmail.com</a>} , and they’ll be happy to assist you further.`,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setShowConfirmation(false);
    setShowFollowUp(false);
    setShowStartNew(true);
  };

  const handleNo = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: "No",
        sender: "user",
        timestamp: new Date(),
      },
    ]);
    setShowConfirmation(false);
    setShowFollowUp(false);
    setShowStartNew(false);
    setSelectedCategory(null);
    setShowQuestions(false);
    setQuestionClicked(false);
    setQuestionAnswered(false);
    setFaqCategories(faqData);
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "bot",
        type: "category-buttons",
        timestamp: new Date(),
      },
    ]);
  };

  const handleConfYes = () => {
    waitingForFollowUpRef.current = false;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: "Yes",
        sender: "user",
        timestamp: new Date(),
      },
      {
        id: prev.length + 2,
        text: "Great! Please select a category below to continue.",
        sender: "bot",
        timestamp: new Date(),
      },
      {
        id: prev.length + 3,
        sender: "bot",
        type: "category-buttons",
        timestamp: new Date(),
      },
    ]);

    setSelectedCategory(null);
    setShowQuestions(false);
    setQuestionClicked(false);
    setQuestionAnswered(false);
    setFaqCategories(faqData);
    setShowFollowUp(false);
    setShowFollowUpFromHome(false);

    setMessages((prev) => prev.filter((msg) => msg.type !== "yes-no-buttons"));
  };

  const handleConfNo = () => {
    waitingForFollowUpRef.current = false;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: "No",
        sender: "user",
        timestamp: new Date(),
      },
      {
        id: prev.length + 2,
        text: "Thank you for chatting with Furniture Mecca today! Let us know if you need anything else. Have a great day!",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
    setMessages((prev) => prev.filter((msg) => msg.type !== "yes-no-buttons"));
    setShowFollowUp(false);
    setShowStartNew(true);
  };

  const handleStartNew = () => {
    setMessage("");
    setShowEmojiPicker(false);
    setIsBotTyping(true);
    setSelectedCategory(null);
    setShowQuestions(false);
    setUserTyped(false);
    setShowConfirmation(false);
    setShowStartNew(false);
    setQuestionClicked(false);
    setQuestionAnswered(false);
    setShowFollowUp(false);

    setMessages([]);

    setTimeout(() => {
      setMessages([
        {
          id: 1,
          text: "Great to see you back at Furniture Mecca! How's everything going at Exclusive Network?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);

      setIsBotTyping(true);

      setTimeout(() => {
        setFaqCategories(faqData);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "bot",
            type: "category-buttons",
            timestamp: new Date(),
          },
        ]);
        setIsBotTyping(false);
      }, 2000);
    }, 2000);
  };
  useEffect(() => { }, [messages]);
  return (
    <div className="chatus-container-main-chatbot">
      <div className="chatus-header">
        <div className="header-content">
          <div className="cht-back">
            <RiArrowLeftSLine className="back-chat-icon" onClick={onBack} />
            <div className="supportperson">
              <div className="avatarwrapper">
                <img src={`https://fmapi.myfurnituremecca.com/uploads/zoe/zoe.jpg`} />
                <span className="ailabeltxt">AI</span>
              </div>
              <div className="messageinfo chat-top">
                <p className="personname-chatbot">Zoe</p>
                <p className="messagepreview-chatbot">AI Assistant</p>
              </div>
            </div>
          </div>
          <RxCross1 className="close-icon" onClick={onClose} />
        </div>
      </div>

      <div className="chatus-body">
        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-row ${msg.sender === "user" ||
                [
                  "category-buttons",
                  "faq-questions",
                  "yes-no-buttons",
                ].includes(msg.type)
                ? "user-row right-align"
                : "bot-row"
                }`}
            >
              {msg.sender === "bot" &&
                ![
                  "category-buttons",
                  "faq-questions",
                  "yes-no-buttons",
                ].includes(msg.type) && (
                  <div className="avatarwrapper1">
                    <img src={`https://fmapi.myfurnituremecca.com/uploads/zoe/zoe.jpg`} />
                    <span className="ailabeltxt1">AI</span>
                  </div>
                )}
              <div
                className={`message-bubble ${msg.sender}`}
                style={
                  [
                    "category-buttons",
                    "faq-questions",
                    "yes-no-buttons",
                  ].includes(msg.type)
                    ? {
                      background: "transparent",
                      boxShadow: "none",
                      padding: "0",
                    }
                    : {}
                }
              >
                {msg.type === "category-buttons" && (
                  <div className="faq-category-buttons">
                    {faqCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        {cat.category}
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === "faq-questions" && (
                  <div className="faq-question-list">
                    {visibleQuestions.map((q) => (
                      <button key={q.id} onClick={() => handleFaqClick(q)}>
                        {q.question}
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === "yes-no-buttons" && (
                  <div className="confirmation-options-right">
                    <button
                      onClick={() => {
                        (msg.onYes || handleYes)();
                        setMessages((prev) =>
                          prev.filter((m) => m.id !== msg.id)
                        );
                      }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        (msg.onNo || handleNo)();
                        setMessages((prev) =>
                          prev.filter((m) => m.id !== msg.id)
                        );
                      }}
                    >
                      No
                    </button>
                  </div>
                )}

                {!msg.type && (
                  <>
                    <div className="message-content">{msg.text}</div>
                    <div className="message-timestamp">
                      {formatMessageTime(msg.timestamp)}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {isBotTyping && (
            <div className="message-row bot-row">
              <div className="avatarwrapper1">
                <img src="https://cdn.servicebell.com/assets/bella-idle-default.c62aea33..jpeg" />
                <span className="ailabeltxt1">AI</span>
              </div>
              <div className="message-bubble bot">
                <div className="message-content typing-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        {showStartNew && (
          <div className="start-new-wrapper">
            <p className="end-message-text">Your conversation has ended.</p>
            <p className="end-time-text">
              {new Date().toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            <button onClick={handleStartNew} className="start-new-btn">
              Start New
            </button>
          </div>
        )}

        {showEmojiPicker && (
          <div
            style={{
              position: "absolute",
              bottom: "100px",
              right: "10px",
              zIndex: 10,
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        {!showStartNew && (
          <div className="chatus-footer">
            <div className="input-container">
              <textarea
                placeholder="Type a message..."
                value={message}
                onChange={(e) => {
                  const value = e.target.value;
                  setMessage(value);

                  if (waitingForFollowUpRef.current && value.trim() !== "") {
                    clearTimeout(followUpTimeoutRef.current);
                    waitingForFollowUpRef.current = false;
                    setMessages((prev) =>
                      prev.filter((msg) => msg.type !== "yes-no-buttons")
                    );
                    setShowFollowUp(false);
                  }
                }}
                onKeyDown={handleKeyDown}
                rows={2}
                className="textarea-style"
              />
              <div className="buttonssss">
                <div className="attach-emoji-btn">
                  {/* <button className="image-button" onClick={handleImageClick}>
                  <CiImageOn />
                </button>
                <button
                  className="emoji-button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <MdOutlineEmojiEmotions />
                </button> */}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>
                <div>
                  <button
                    className="send-button"
                    onClick={handleSend}
                    disabled={message.trim() === ""}
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="poweredby">
          <p>
            Powered By{" "}
            <a
              href="https://zellesolutions.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Assets/chat/Images/zelle.png"
                style={{ height: "25px", width: "25px" }}
                alt="Chatbot Avatar"
              />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatUs;
