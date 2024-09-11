import { createRoot } from "react-dom/client"
import Popup from "./Popup"
import { StrictMode } from "react"

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <Popup />
  </StrictMode>
)
