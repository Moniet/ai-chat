import { createRoot } from "react-dom/client"
import Sidebar from "./Sidebar"
import ThemeProvider from "../../providers/theme-provider/ThemeProvider"

import "../../../index.css"
import { StrictMode } from "react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import CaptureApiKeys from "../CaptureApiKeys/CaptureApiKeys"
import ModelSelection from "../ModelSelection/ModelSelection"
import { Toaster } from "@/components/design-system/toaster"

// const Redirect = ({ children }: PropsWithChildren) => {
//   const nav = useNavigate()
//   useLayoutEffect(() => {
//     const url = new URL(window.location.href)
//     const path = url.searchParams.get("path")
//     if (path) nav(path)
//   }, [nav])

//   return <div />
// }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <MemoryRouter>
        <Routes>
          <Route element={<Sidebar />} path="/" />
          <Route element={<Sidebar />} path="/chat" />
          <Route element={<CaptureApiKeys />} path="/capture-keys" />
          <Route path="/model-selection" element={<ModelSelection />} />
          <Route path="/sign-in" element={<div>sign in</div>} />
        </Routes>
        <Toaster />
      </MemoryRouter>
    </ThemeProvider>
  </StrictMode>
)
