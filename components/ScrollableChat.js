import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  isLastMessage,
  isSameSender,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ChatMessage from "./ChatMessage";
import ScrollableFeed from "react-scrollable-feed";
const ScrollableChat = ({ messages }) => {
  const scrollableRef = useRef(null);
  useEffect(() => {
    scrollableRef.current?.scrollIntoView();
  }, [messages]);
  const { user } = ChatState();
  return (
    <>
      {messages &&
        messages.map((m, i) => (
          <div ref={scrollableRef} style={{ display: "flex" }} key={m._id} >
            {((isSameSender(messages, m, i, user.id)===false&&isLastMessage(messages, m, i, user.id)) && <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender.name}
                src={m.sender.pic}
              />
            </Tooltip>)}
            {m.content?.includes("http://res.cloudinary.com/my1chatapp/image/upload")?<ChatMessage imageUrl={m.content} isMyMessage={false}
                   mymargin={(isSameSender(messages, m, i, user.id)===false&&isLastMessage(messages, m, i, user.id))?0:isSameSender(messages, m, i, user.id)?"auto":33}
            />:<span
              style={{
                backgroundColor: `${m.sender._id === user.id ? "#292b29" : "grey"
                  }`,
                marginTop:4,
                color:"white",
                marginLeft:(isSameSender(messages, m, i, user.id)===false&&isLastMessage(messages, m, i, user.id))?0:isSameSender(messages, m, i, user.id)?"auto":33,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>}
          </div>
        ))}
    </>
  );
};

export default ScrollableChat;
