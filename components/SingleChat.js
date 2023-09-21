import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";
import chattinggif from "../animations/chatting.json";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import { io } from "socket.io-client";
const ENDPOINT = "https://chatappserver6.onrender.com"
var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const ApiEndpoint=process.env.NEXT_PUBLIC_API_URL;
  const toast = useToast();
  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: chattinggif,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  const updateInDB = async (chat, value) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    try {
      const data = await axios.put(`${ApiEndpoint}/api/chat/sendNotification`, {
        chatId: chat._id,
        value: value
      }, config);
    } catch (err) {
            console.log(err);
    }
  }
  useEffect(() =>{
    //socket = io(ENDPOINT);
     socket = io(ENDPOINT,{
         transports: ['websocket'],
        });
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true)
    });
    fetchMessages();
    selectedChatCompare=selectedChat;
  }, [selectedChat])
  const checkpresentbefore = (datatoadd, arr) => {
    var ans = false;
    arr.map((element) => {
      console.log(element._id);
      console.log(datatoadd._id);
      if (element._id === datatoadd._id) ans = true;
    })
    return ans;
  }
  useEffect(() => {
    socket.on("recievedMessage", (data) => {
      console.log(selectedChat);
      if (!selectedChatCompare || selectedChatCompare._id !== data.chat._id){
        if (checkpresentbefore(data.chat, notification) === false) {
          updateInDB(data.chat, true);
          setNotification([data.chat, ...notification]);
        }
      }
      setMessages([...messages, data]);
    })
    socket.on("typing", () => {
      setIsTyping(true);
    })
    socket.on("stop typing", () => {
      setIsTyping(false);
    })
  })
  const typinghandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    selectedChat.userId = user.id;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= 2000 && typing) {
        socket.emit("stop typing", selectedChat);
        setTyping(false);
      }
    }, timerLength);
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${ApiEndpoint}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data.result);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    setLoading(false);
  };
  const sendMessage = async (event)=>{
    if (event.key === "Enter" && newMessage){
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${ApiEndpoint}/api/message/sendMessage`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setMessages([...messages, data.data[0]]);
        data.data[0].userId = user.id;
        socket.emit("newMessage", data.data[0]);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="cursive"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color={"white"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            className="messagesBackground"
            fontFamily="cursive"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? <div>
                <Lottie
                  animationData={animationData}
                  style={{ height: "100px", width: "100px" }}
                />
              </div> : <></>}
              <Input
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typinghandler}
                fontFamily="cursive"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%" className="singleChat">
          <div>
            <Lottie
              animationData={chattinggif}
              options={defaultOptions}
            />
          </div>
          {/* <Text fontSize="3xl" pb={3} fontFamily="Work sans">
               Select a Chat to start Chatting
          </Text> */}
        </Box>
      )}
    </>
  );
};
export default SingleChat;
