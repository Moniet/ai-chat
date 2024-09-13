import Messages from "./Chat/Messages"
import ChatFooter from "./Chat/ChatFooter"
import SidebarHeader from "./SidebarHeader"
import Layout from "@/components/design-system/layout"

const Sidebar = () => {
  // const { apiKeys, isLoading: isLoadingKeys } = useApiKeys()

  return (
    <Layout>
      <SidebarHeader />
      <Messages />
      <ChatFooter />
    </Layout>
  )
}

export default Sidebar
