import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const router=useRouter();
  useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if(userInfo){
        setUser(userInfo);
        router.push("/chatpage");
      }
      else{
          router.push("/");
      }
  }, []);
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
