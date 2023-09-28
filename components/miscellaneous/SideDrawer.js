import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../useAvtar/UserListItem";
import { useRouter } from "next/router";
import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const ApiEndpoint=process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    router.push("/");
  };
  const updateInDB = async (chat) => {
    setSelectedChat(chat);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    try {
      const data = await axios.put(`${ApiEndpoint}/api/chat/sendNotification`, {
        chatId: chat._id,
        value: false,
      }, config);
     const newnotification=notification.filter((element)=>{
            return element._id!=chat._id;
      })
      setNotification(newnotification);
    } catch (err) {
            console.log(err);
    }
  }
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`${ApiEndpoint}/api/user/getusers`, { search }, config);

      setLoading(false);
      setSearchResult(data.users);
      console.log(searchResult)
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${ApiEndpoint}/api/chat/`, { userId }, config);
      console.log(data);
      console.log(chats);
      if (!chats.find((c) => c._id === data.chat._id)) setChats([data.chat, ...chats]);
      setSelectedChat(data.chat);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        fontFamily="cursive"

      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button bgImage={"linear-gradient(to right, grey , #292626);"} colorScheme={"white"} onClick={onOpen}>
            <Text display="flex">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" display={{ base: "none", sm: "flex" }} fontFamily="cursive" color="white">
          Chatapp
        </Text>
        <div>
          <Menu>
            <MenuButton padding={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="3xl" margin={1} color={"white"} />
            </MenuButton>
            <MenuList paddingLeft={2}>
              {notification.length == 0 && "No New Messages"}
              {notification.map((element) => (
                <MenuItem
                  key={element._id}
                  onClick={()=>updateInDB(element)}
                >
                 New notification from {element.isGroupChat===true?<>{element.chatName}</>:<>{getSender(user,element.users)}</>}
                </MenuItem>
              ))
              }
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} >Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} bgImage={"linear-gradient(to right, grey , #292626);"}>
        <DrawerOverlay />
        <DrawerContent bgImage={"linear-gradient(to right, grey , #292626);"}>
          <DrawerHeader borderBottomWidth="1px" color={"white"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                _placeholder={{color:"white"}}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((currentuser) => (
                <UserListItem
                  key={currentuser._id}
                  user={currentuser}
                  handleFunction={() => accessChat(currentuser._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
