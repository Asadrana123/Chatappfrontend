import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import Signup from "@/components/authentication/Signup";
import Signin from "@/components/authentication/Signin";
import { useRouter } from "next/router";
function Homepage() {
  const router=useRouter();
  return (
    <div className="index">
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        bgImage={"linear-gradient(to right, grey , #292626);"}
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="cursive">
          Chatapp
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" bgImage={"linear-gradient(to right, grey , #292626);"}
        fontFamily="cursive"
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Signin</Tab>
            <Tab>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Signin />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
    </div>
  );
}

export default Homepage;
