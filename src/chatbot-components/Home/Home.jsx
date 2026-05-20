import React, { useState, useEffect} from "react";
import "./style.css";
import StartScreen from "../StartScreen/StartScreen";
import HomeScreen from "../HomeScreen/HomeScreen";
import ChatUs from "../ChatUs/ChatUs";
import OfflineScreen from "../OfflineScreen/OfflineScreen";
import { IoChatbubbleOutline } from "react-icons/io5";
import OnlineChatUs from "../OnlineChatUs/OnlineChatUs";
import ConversationList from "../ConversationList/ConversationList";
import { useChatOpenContext } from "@/context/ChatbotContext/ChatbotContext";
import { usePathname } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalContext/globalContext";

const Home = () => {

  const {
    isOpen, setIsOpen,
    isTransitioning,
    showChatUsOnly,
    showOfflineScreen,
    showOnlineChatUs,
    startScreenClosed,
    setStartScreenClosed,
    showConversationList,
    setShowConversationList,
    activeTab,
    onTab,
    handleTabClickFromFooter,
    handleFaqClickFromHome,
    handleOpenOnlineChat,
    handleOpen,
    handleBack,
    handleOpenChatUsOnly,
    handleClose,
    handleOpenOffline,
    handleStartScreenClose
  } = useChatOpenContext()

  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const bottomReached = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;
      setIsBottom(bottomReached);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pathname = usePathname();
  const confirmationOrderPage = pathname.startsWith('/order-confirmation')
  const {showDeliveryMessage} = useGlobalContext()


  return (
    <div className={`home-container ${isBottom && !confirmationOrderPage ? 'take-chat-home-to-up' : showDeliveryMessage ? 'take-chat-home-top-on-message-contianer' : ''}`}>
      <div
        className={`fade-wrapper ${isTransitioning
          ? "fade-out slide-down"
          : showChatUsOnly || showOfflineScreen || showOnlineChatUs
            ? "fade-in slide-up"
            : "fade-in"
          }`}
      >
        {/* {!startScreenClosed &&
          !isOpen &&
          !showChatUsOnly &&
          !showOfflineScreen &&
          !showOnlineChatUs && (
            <StartScreen
              onOpen={handleOpen}
              source={"/Assets/chat/Images/ai-chatbot.gif"}
              onChatUsClick={handleOpenChatUsOnly}
              onStartScreenClose={handleStartScreenClose}
            />
          ) 
          } */}

        {startScreenClosed &&
          !isOpen &&
          !showChatUsOnly &&
          !showOfflineScreen &&
          !showOnlineChatUs && (
            <button className="chat-btn-home" onClick={handleOpenChatUsOnly}>
              <IoChatbubbleOutline className="chat-us-home-icon" />
              Chat Us
            </button>
          )}
        {showConversationList ? (
          <ConversationList
            activeTab={activeTab}
            onCloseConversationList={() => {
              setShowConversationList(false);
              setStartScreenClosed(false);
              setIsOpen(false);
            }}
            onTabClick={handleTabClickFromFooter}
          />
        ) : showChatUsOnly ? (
          <ChatUs onBack={handleOpen} onClose={handleClose} />
        ) : showOnlineChatUs ? (
          <OnlineChatUs onBack={handleBack} onClose={handleClose} />
        ) : showOfflineScreen ? (
          <OfflineScreen onBack={handleBack} onClose={handleClose} />
        ) : isOpen ? (
          <HomeScreen
            onClose={handleClose}
            onOpenChatUs={handleOpenChatUsOnly}
            onOpenOffline={handleOpenOffline}
            onOpenOnlineChat={handleOpenOnlineChat}
            onFaqClick={handleFaqClickFromHome}
            onOpenConversationList={() => setShowConversationList(true)}
            activeTab={activeTab}
            onTabClick={onTab}
            isOpen={true}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Home;
