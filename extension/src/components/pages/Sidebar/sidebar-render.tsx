import { createRoot } from "react-dom/client"
import Sidebar from "./Sidebar"
import ThemeProvider from "../../providers/theme-provider/ThemeProvider"

import "../../../index.css"
import { PropsWithChildren, StrictMode, useLayoutEffect } from "react"
import {
  MemoryRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
  useNavigate
} from "react-router-dom"

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
          <Route path="/sign-in" element={<div>sign in</div>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  </StrictMode>
)
