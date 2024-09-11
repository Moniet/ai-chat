import Messages from "./Chat/Messages"
import ChatFooter from "./Chat/ChatFooter"
import SidebarHeader from "./SidebarHeader"

const Sidebar = () => {
  // const { apiKeys, isLoading: isLoadingKeys } = useApiKeys()

  return (
    <div className="bg-transparent h-full">
      <div className="flex flex-col w-full h-full dark:bg-slate-900 text-zinc-50 shadow-lg border-l bg-zinc-50 border-zinc-100 dark:border-slate-800">
        <SidebarHeader />
        <Messages />
        <ChatFooter />
      </div>
    </div>
  )
}

export default Sidebar
