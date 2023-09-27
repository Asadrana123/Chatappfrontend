import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Avatar, Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats,notification,setNotification } = ChatState();
  const ApiEndpoint=process.env.NEXT_PUBLIC_API_URL;
  const handleClickonChat=(chat)=>{
    setSelectedChat(chat);
  }
  const toast = useToast();
  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${ApiEndpoint}/api/chat/`, config);
      data.map((element)=>{
          if(element.Notification===true&&element.latestMessage.sender._id!==user.id) setNotification([element,...notification]);
      })
      setChats(data);
      console.log(data);
    } catch (error) {
        console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      bgImage={"linear-gradient(to right, grey , #292626);"}
      fontFamily="cursive"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="cursive"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color={"white"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            bgImage={"linear-gradient(to right, grey , #292626);"}
            color={"white"}
            backgroundColor={"black"}
            colorScheme="white"
            rightIcon={<AddIcon />}
          >
            Create Group 
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="auto">
            {chats.map((chat) => (
              <Box
                onClick={()=>handleClickonChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "white"}
                bgImage={selectedChat === chat ? "linear-gradient(to right,#393b39, #0e120e)" : "linear-gradient(to right,grey, black)"}
                color={selectedChat === chat ? "white" : "white"}
                px={2}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
              >
                <Box
                  marginRight={"8px"}
                ><Avatar
                   src={chat.isGroupChat===false? getSenderFull(user,chat.users).pic:"https://png.pngtree.com/png-vector/20191130/ourmid/pngtree-group-chat-icon-png-image_2054401.jpg"}
                /></Box>
                <Box marginTop={"2px"}>
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                  <Text fontSize={"15px"}>
                    <b>{chat.latestMessage?.sender.name}: </b>
                     {chat.latestMessage?.content.length>30?"Last message is Image":chat.latestMessage?.content.slice(0,10)+"...."}
                  </Text>

                </Box>
              
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
export default MyChats;
