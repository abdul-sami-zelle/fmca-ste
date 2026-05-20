import React from "react";
import "./style.css";
import { RiChat3Fill } from "react-icons/ri";
import { IoMdHome } from "react-icons/io";

const Footer = ({ activeTab, onTabClick = () => {} }) => {
  return (
    <div>
      <div className="footer">
        <p
          onClick={() => onTabClick("home")}
          style={{ color: activeTab === "home" ? "#f3691e" : "" }}
        >
          <IoMdHome className="home-icon" /> Home
        </p>
        <p
          onClick={() => onTabClick("chat")}
          style={{ color: activeTab === "chat" ? "#f3691e" : "" }}
        >
          <RiChat3Fill className="home-icon" /> Chat
        </p>
      </div>
      <div className="footer-bottom">
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
  );
};

export default Footer;
