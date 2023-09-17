import '@/styles/globals.css'
import ChatProvider from '@/Context/ChatProvider'
import { ChakraProvider } from '@chakra-ui/react'
export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
  <ChatProvider>
  <Component {...pageProps} />
  </ChatProvider>
  </ChakraProvider>
  )
}
