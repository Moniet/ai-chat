import Messages from "./Chat/Messages";
import ChatFooter from "./Chat/ChatFooter";
import SidebarHeader from "./SidebarHeader";
import Layout from "@/components/design-system/layout";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ExtensionHeader from "@/components/shared/extension-header";

const Sidebar = () => {
  // const { apiKeys, isLoading: isLoadingKeys } = useApiKeys({})

  return (
    <Layout>
      <ExtensionHeader />
      <SidebarHeader />
      <Messages />
      <ChatFooter />
    </Layout>
  );
};

export default Sidebar;
