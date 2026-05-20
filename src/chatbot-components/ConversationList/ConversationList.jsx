import React, { useState } from "react";
import "./style.css";
import { AiOutlineMinus } from "react-icons/ai";
import Footer from "../Footer/Footer";

const dummyConversations = [
  {
    id: 1,
    name: "Bella",
    message: "Hey! How can I help you today?",
    img: "https://cdn.servicebell.com/assets/bella-idle-default.c62aea33..jpeg",
    timestamp: "10:45 AM",
  },
  {
    id: 2,
    name: "John",
    message: "Let me know if you have any questions!",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    timestamp: "9:20 AM",
  },
  {
    id: 3,
    name: "Support Bot",
    message: "We’re available 24/7. How can we help?",
    img: "https://cdn-icons-png.flaticon.com/512/4712/4712107.png",
    timestamp: "Yesterday",
  },
  {
    id: 4,
    name: "Emma",
    message: "I'll get back to you shortly!",
    img: "https://cdn-icons-png.flaticon.com/512/194/194938.png",
    timestamp: "Monday",
  },
  {
    id: 5,
    name: "Lucas",
    message: "Thanks for reaching out!",
    img: "https://cdn-icons-png.flaticon.com/512/219/219969.png",
    timestamp: "Sunday",
  },
    {
    id: 6,
    name: "John",
    message: "Let me know if you have any questions!",
    img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    timestamp: "9:20 AM",
  },
  {
    id: 7,
    name: "Support Bot",
    message: "We’re available 24/7. How can we help?",
    img: "https://cdn-icons-png.flaticon.com/512/4712/4712107.png",
    timestamp: "Yesterday",
  },
  {
    id: 8,
    name: "Emma",
    message: "I'll get back to you shortly!",
    img: "https://cdn-icons-png.flaticon.com/512/194/194938.png",
    timestamp: "Monday",
  },
  {
    id: 9,
    name: "Lucas",
    message: "Thanks for reaching out!",
    img: "https://cdn-icons-png.flaticon.com/512/219/219969.png",
    timestamp: "Sunday",
  },
];

const ConversationList = ({
  onCloseConversationList,
  activeTab,
  onTabClick,
}) => {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const filteredConversations = dummyConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (!isOpen) {
    return (
      <div className="chat-toggle-btn" onClick={() => setIsOpen(true)}></div>
    );
  }

  return (
    <div className="conversation-list-container">
      <div className="conversation-list-header">
        <span>Conversations</span>
        <button className="new-chat-btn" onClick={onCloseConversationList}>
          <AiOutlineMinus />
        </button>
      </div>
      <div className="search-with-chatlist">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input-conversation"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="conversation-list-body">
          {/* {filteredConversations.map((conv) => (
            <div className="conversation-card" key={conv.id}>
              <img src={conv.img} alt={conv.name} className="conv-avatar" />
              <div className="conv-info">
                <div className="conv-title">
                  <span>{conv.name}</span>
                  <span className="timestamp">{conv.timestamp}</span>
                </div>
                <div className="conv-msg">{conv.message}</div>
              </div>
            </div>
          ))} */}

          {/* {filteredConversations.length !== 0 && ( */}
            <p className="no-results">No conversations found.</p>
          {/* )} */}
        </div>
      </div>

      <Footer
        activeTab={activeTab}
        onTabClick={(tab) => {
          if (tab === "home") {
            onCloseConversationList();
            setTimeout(() => {
              onTabClick(tab);
            }, 0);
          } else {
            onTabClick(tab);
          }
        }}
      />
    </div>
  );
};

export default ConversationList;
