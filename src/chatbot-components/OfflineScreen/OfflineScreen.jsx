import React, { useState, useRef } from "react";
import { RxCross1 } from "react-icons/rx";
import { FiSend } from "react-icons/fi";
import { RiArrowLeftSLine } from "react-icons/ri";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import EmojiPicker from "emoji-picker-react";
import "./style.css";
import { FaRegCalendar } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";

const OfflineScreen = ({ onBack, onClose }) => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showBotOptions, setShowBotOptions] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newMessage = {
        id: messages.length + 1,
        text: `📷 Image sent: ${file.name}`,
        sender: "user",
        timestamp: "Just now",
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handleSend = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: "users",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setShowEmojiPicker(false);
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Our Human team is offline this second... but to best assist you, someone will follow up shortly via email.",
        sender: "bots",
        timestamp: new Date(),
        avatar: "/assets/chat/Images/advisor2.png",
      };
      setMessages((prev) => [...prev, botResponse]);
      setShowBotOptions(true);
    }, 1000);
  };
  const formatMessageTime = (timestamp) => {
    const now = new Date();
    const timeDiff = (now - new Date(timestamp)) / 1000;

    if (timeDiff < 60) {
      return "Just now";
    } else {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="chatus-container">
      <div className="chatus-header">
        <div className="header-content">
          <RiArrowLeftSLine className="back-chat-icon" onClick={onBack} />
          <p>Furniture Mecca</p>
          <RxCross1 className="close-icon" onClick={onClose} />
        </div>
        <div className="company-logo123">
          <img src="/assets/chat/Images/advisor2.png" alt="" />
        </div>
        <div className="meeting-us-btn123">
          <p>
            <FaRegCalendar className="meeting-us-icon123" /> Book a Meeting
          </p>
        </div>
      </div>

      <div className="chatus-body">
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
        <div className="messages-container">
          {messages.map((msg) => (
            <div className={`message-rows ${msg.sender}`}>
              {msg.sender === "bots" && msg.avatar && (
                <img src={msg.avatar} alt="Bot" className="bot-avatars" />
              )}
              <div
                className={`message-bubble ${msg.sender}`}
                style={{
                  alignSelf: msg.sender === "users" ? "flex-end" : "flex-start",
                  textAlign: msg.sender === "users" ? "right" : "left",
                }}
              >
                <div className="message-content">{msg.text}</div>
                <div className="message-timestamps">
                  {formatMessageTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
          {showBotOptions && (
            <div className="bot-options">
              <button
                onClick={() =>
                  window.open("https://your-book-demo-link.com", "_blank")
                }
              >
                Book Demo
              </button>
              <button onClick={() => setShowBotOptions(false)}>
                Leave Message
              </button>
              <button
                onClick={() =>
                  window.open("https://your-support-link.com", "_blank")
                }
              >
                Support
              </button>
            </div>
          )}
        </div>

        {showEmailError && (
          <span className="errorrrrr">Not a valid email address</span>
        )}
        {!showBotOptions && (
          <div className="input-containersss">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                position: "relative",
              }}
            >
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  placeholder="Email@example.com"
                  value={email}
                  onChange={(e) => {
                    const input = e.target.value;
                    setEmail(input);

                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const isValid = emailPattern.test(input);

                    setIsEmailValid(isValid);

                    if (isValid && !emailSubmitted) {
                      setEmailSubmitted(true);
                      setShowEmailError(false);
                    } else if (!isValid) {
                      setEmailSubmitted(false);
                    }
                  }}
                  className="textarea-style"
                />

                {isEmailValid && (
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "green",
                      fontSize: "25px",
                    }}
                  >
                    <IoCheckmark />
                  </span>
                )}
              </div>
            </div>

            <textarea
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="textarea-style"
              disabled={!emailSubmitted}
            />
            <div className="buttonssss">
              <div className="attach-emoji-btn">
                <button
                  className="image-button"
                  onClick={handleImageClick}
                  disabled={!emailSubmitted}
                >
                  <CiImageOn />
                </button>
                <button
                  className="emoji-button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={!emailSubmitted}
                >
                  <MdOutlineEmojiEmotions />
                </button>
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
                  disabled={!emailSubmitted || message.trim() === ""}
                >
                  <FiSend />
                </button>
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

export default OfflineScreen;
