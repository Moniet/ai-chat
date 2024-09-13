import { BotIcon } from "lucide-react"

const ExtensionHeader = () => {
  return (
    <header>
      <nav className="flex w-full py-3 px-5 justify-between h-[60px] border-b dark:border-slate-800 items-center">
        <div>
          <div className="size-10 flex text-slate-400 p-1">
            <img src="/aiiko-logo.png" className="size-full" />
          </div>
        </div>
        <div></div>
      </nav>
    </header>
  )
}

export default ExtensionHeader
