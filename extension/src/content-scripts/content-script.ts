import * as sidebar from "./toggle-sidebar"

import "./content-script.css"

const contentScript = async () => {
  chrome.runtime.onMessage.addListener(
    (message, _ignoreSender, _sendResponse) => {
      console.log("message", message)
      const { type } = message ?? { type: "" }
      if (type === "inject-sidebar") sidebar.injectSidebar()
    }
  )
}

contentScript()
