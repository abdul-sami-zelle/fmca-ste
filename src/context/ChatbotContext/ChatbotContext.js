import { createContext, useContext, useEffect, useRef, useState } from "react";

const ChatOpenContext = createContext();

export const ChatOpenProvider = ({children}) => {

    const [isOpen, setIsOpen] = useState(false);
      const [isTransitioning, setIsTransitioning] = useState(false);
      const [showChatUsOnly, setShowChatUsOnly] = useState(false);
      const [showOfflineScreen, setShowOfflineScreen] = useState(false);
      const [showOnlineChatUs, setShowOnlineChatUs] = useState(false);
      const [startScreenClosed, setStartScreenClosed] = useState(true);
      const [isMobile, setIsMobile] = useState(false);
      const [showConversationList, setShowConversationList] = useState(false);
      const [activeTab, setActiveTab] = useState("home");
    
      const onTab = (tab) => {
        setStartScreenClosed(true);
    
        setActiveTab(tab);
    
        if (tab === "home") {
          setShowConversationList(false);
            setStartScreenClosed(true);
          setIsOpen(true);
        } else if (tab === "chat") {
          setShowConversationList(true);
          setIsOpen(false);
        }
      };
    
      const initialTimerRef = useRef(null);
      const autoCloseTimerRef = useRef(null);
    
      useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 600);
        };
    
        handleResize();
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
    
      const clearTimers = () => {
        if (initialTimerRef.current) {
          clearTimeout(initialTimerRef.current);
          initialTimerRef.current = null;
        }
        if (autoCloseTimerRef.current) {
          clearTimeout(autoCloseTimerRef.current);
          autoCloseTimerRef.current = null;
        }
      };
    
      useEffect(() => {
        // if (!isMobile) {
        //   setStartScreenClosed(false);
        //   return;
        // }
    
        // clearTimers();
        // initialTimerRef.current = setTimeout(() => {
        //   setIsTransitioning(true);
        //   setTimeout(() => {
        //     setStartScreenClosed(false);
        //     setIsTransitioning(false);
    
        //     autoCloseTimerRef.current = setTimeout(() => {
        //       handleStartScreenClose();
        //     }, 5000);
        //   }, 300);
        // }, 5000);
    
        // return clearTimers;
      }, [isMobile]);
    
      const resetAutoCloseTimer = () => {
        if (!isMobile || startScreenClosed) return;
    
        clearTimeout(autoCloseTimerRef.current);
        // autoCloseTimerRef.current = setTimeout(() => {
        //   handleStartScreenClose();
        // }, 5000);
      };
    
      const handleTabClickFromFooter = (tab) => {
        if (tab === "home") {
          setShowConversationList(false);
          setTimeout(() => {
            setActiveTab("home");
            setIsOpen(true);
          }, 0);
        } else {
          setActiveTab(tab);
          setShowConversationList(true);
        }
      };
    
      const handleStartScreenClose = () => {
        clearTimers();
        setIsTransitioning(true);
        setTimeout(() => {
          // setStartScreenClosed(true);
          // setIsTransitioning(false);
        }, 300);
      };
    
      const handleFaqClickFromHome = (faq) => {
        window.selectedFaqFromHome = faq;
        setIsTransitioning(true);
        setTimeout(() => {
          setShowChatUsOnly(true);
          setIsOpen(false);
          setIsTransitioning(false);
        }, 300);
      };
    
      const handleOpenOnlineChat = () => {
        clearTimers();
        setIsTransitioning(true);
        setTimeout(() => {
          setShowOnlineChatUs(true);
          setShowOfflineScreen(false);
          setShowChatUsOnly(false);
          setIsOpen(false);
          setIsTransitioning(false);
        }, 300);
      };
    
      const handleOpen = () => {
        resetAutoCloseTimer();
        setIsTransitioning(true);
        setTimeout(() => {
          setIsOpen(true);
          setShowChatUsOnly(false);
          setIsTransitioning(false);
        }, 300);
      };
    
      const handleBack = () => {
        resetAutoCloseTimer();
        setIsTransitioning(true);
        setTimeout(() => {
          setShowOnlineChatUs(false);
          setIsOpen(true);
          setShowChatUsOnly(false);
          setShowOfflineScreen(false);
          setIsTransitioning(false);
        }, 300);
      };
    
      const handleOpenChatUsOnly = () => {
        resetAutoCloseTimer();
        setIsTransitioning(true);
        setTimeout(() => {
          setShowChatUsOnly(true);
          setIsOpen(false);
          setIsTransitioning(false);
        }, 300);
      };
    
      const handleClose = () => {
        clearTimers();
        setIsTransitioning(true);
        setTimeout(() => {
          setShowOnlineChatUs(false);
          setIsOpen(false);
          setShowChatUsOnly(false);
          setShowOfflineScreen(false);
          setStartScreenClosed(true);
          setIsTransitioning(false);
        }, 300);
      };
    
      const handleOpenOffline = () => {
        resetAutoCloseTimer();
        setIsTransitioning(true);
        setTimeout(() => {
          setShowOfflineScreen(true);
          setIsOpen(false);
          setShowChatUsOnly(false);
          setIsTransitioning(false);
        }, 300);
      };

    return (
        <ChatOpenContext.Provider value={{
            isOpen, setIsOpen,
            isTransitioning, setIsTransitioning,
            showChatUsOnly, setShowChatUsOnly,
            showOfflineScreen, setShowOfflineScreen,
            showOnlineChatUs, setShowOnlineChatUs,
            startScreenClosed, setStartScreenClosed,
            isMobile, setIsMobile,
            showConversationList, setShowConversationList,
            activeTab, setActiveTab,
            initialTimerRef,
            autoCloseTimerRef,
            onTab,
            clearTimers,
            resetAutoCloseTimer,
            handleTabClickFromFooter,
            handleFaqClickFromHome,
            handleOpenOnlineChat,
            handleOpen,
            handleBack,
            handleOpenChatUsOnly,
            handleClose,
            handleOpenOffline,
            handleStartScreenClose,
        }}>
            {children}
        </ChatOpenContext.Provider>
    )
}

export const useChatOpenContext = () => useContext(ChatOpenContext);