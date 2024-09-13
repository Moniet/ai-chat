import { PropsWithChildren } from "react"

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-transparent h-full">
      <div className="flex flex-col w-full h-full dark:bg-slate-900 text-zinc-50 shadow-lg border-l bg-zinc-50 border-zinc-100 dark:border-slate-800">
        {children}
      </div>
    </div>
  )
}

export default Layout
