import { CSSProperties } from "react"

const IFRAME_ID = "aiiko-sidebar"
const RESIZER_ID = "aiiko-resizer"
const MIN_WIDTH = 450
const MAX_WIDTH = 900

export const injectSidebar = () => {
  const hasSidebar = document.getElementById(IFRAME_ID)
  const resizer = document.getElementById(RESIZER_ID)

  if (hasSidebar) {
    const state = hasSidebar.dataset.state
    if (state === "open") {
      hasSidebar.classList.remove("aiiko-slide-in")
      hasSidebar.classList.add("aiiko-slide-out")
      hasSidebar.dataset.state = "closed"
      if (resizer) resizer.style.display = "none"
      setTimeout(() => {
        document.body.style.marginRight = "0px"
      }, 200) // Wait for animation to complete
    } else {
      hasSidebar.classList.remove("aiiko-slide-out")
      hasSidebar.classList.add("aiiko-slide-in")
      hasSidebar.dataset.state = "open"
      document.body.style.marginRight = hasSidebar.style.width
      if (resizer) {
        resizer.style.display = "block"
        resizer.style.right = hasSidebar.style.width
      }
    }
    return null
  }

  const iframe = new DOMParser().parseFromString(
    `<iframe
        frameborder="0"
        id=${IFRAME_ID}
        allowtransparency="true"
        class="aiiko-slide-in"
        data-state="open"
        src="${chrome.runtime.getURL(
          "src/components/pages/Sidebar/sidebar.html"
        )}"
    ></iframe>`,
    "text/html"
  ).body.firstElementChild as HTMLIFrameElement

  Object.assign(iframe.style, {
    position: "fixed",
    top: "0px",
    right: "0px",
    height: "100vh",
    width: "450px",
    zIndex: 1000000,
    border: "none",
    background: "transparent",
    "color-scheme": "auto"
  } as CSSProperties)

  document.body.style.marginRight = "450px"
  document.body.append(iframe)

  // Add resize functionality
  const newResizer = document.createElement("div")
  newResizer.classList.add("aiiko-fade-in")
  newResizer.id = RESIZER_ID
  Object.assign(newResizer.style, {
    position: "fixed",
    top: "0px",
    right: "450px",
    width: "5px",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.1)",
    cursor: "col-resize",
    zIndex: 1000001
  } as CSSProperties)

  document.body.append(newResizer)

  // Create overlay
  const overlay = document.createElement("div")
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "transparent",
    zIndex: 1000002,
    display: "none"
  } as CSSProperties)

  document.body.append(overlay)

  let isResizing = false
  let startX: number

  const startResize = (e: MouseEvent) => {
    isResizing = true
    startX = e.clientX
    overlay.style.display = "block"
    document.addEventListener("mousemove", resize)
    document.addEventListener("mouseup", stopResize)
    document.body.style.userSelect = "none"
    document.body.style.cursor = "col-resize"
    // iframe.style.transition = "none" // Disable transition during resize
  }

  const resize = (e: MouseEvent) => {
    if (!isResizing) return
    const deltaX = startX - e.clientX
    const newWidth = parseInt(iframe.style.width) + deltaX
    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      iframe.style.width = `${newWidth}px`
      newResizer.style.right = `${newWidth}px`
      document.body.style.marginRight = `${newWidth}px`
    }
    startX = e.clientX
  }

  const stopResize = () => {
    isResizing = false
    overlay.style.display = "none"
    document.removeEventListener("mousemove", resize)
    document.removeEventListener("mouseup", stopResize)
    document.body.style.userSelect = ""
    document.body.style.cursor = ""
    // iframe.style.transition = "" // Re-enable transition after resize
  }

  newResizer.addEventListener("mousedown", startResize)
}

export const toggleSetup = () => {
  chrome.runtime.onMessage.addListener(
    (message, _ignoreSender, _sendResponse) => {
      console.log("message", message)
      const { type } = message ?? { type: "" }
      if (type === "inject-sidebar") injectSidebar()
    }
  )
}
