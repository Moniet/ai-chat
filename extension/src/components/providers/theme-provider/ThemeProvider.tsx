import { PropsWithChildren } from "react"
import { Provider } from "./provider"

const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider defaultTheme="system" storageKey="aiiko-theme">
      {children}
    </Provider>
  )
}

export default ThemeProvider
