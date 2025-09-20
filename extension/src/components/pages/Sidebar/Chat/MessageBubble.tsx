import clsx from "clsx"
import { motion } from "framer-motion"
import Markdown from "react-markdown"
import gfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "./MessageBubble.css"

// import prism from "remark-prism"
import { PropsWithChildren } from "react"
import { useModels } from "@/hooks/use-models"
import { ChatMessage } from "@/hooks/use-messages"
import { BotIcon } from "lucide-react"

const Code = ({ children }: PropsWithChildren) => {
  return (
    <code className="dark p-3 rounded-md my-5 max-w-full overflow-x-auto block bg-zinc-800 whitespace-pre">
      {children}
    </code>
  )
}

const Pre = ({ children }: PropsWithChildren) => {
  return (
    <pre className="max-w-full overflow-x-auto rounded-md bg-zinc-800 whitespace-pre-wrap mt-5">
      {children}
    </pre>
  )
}

const userStyle = "w-fit dark:bg-blue-700 text-zinc-50 text-left"
const aiStyle = "bg-zinc mr-auto dark:bg-slate-700 text-zinc-50"

const MessageBubble = ({ role, content, date }: ChatMessage) => {
  const model = useModels((s) => s.currentModel)
  const icon = model.icon

  return (
    <motion.div
      className={`message-bubble flex flex-col mt-8 gap-2 justify-start max-w-[100%] overflow-hidden ${
        role === "user" ? "items-end" : "items-start"
      }`}
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2
      }}
    >
      <div
        className={`flex items-start w-full ${
          role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {role === "assistant" && (
          <div className="size-[34px] aspect-square p-[5px] mr-2 border dark:border-slate-700 rounded-full w-fit flex dark:text-zinc-50 text-slate-900">
            {<BotIcon className="size-5" />}
          </div>
        )}
        <div className="max-w-[80vw] overflow-hidden">
          <div
            className={clsx(
              "px-4 py-2 rounded-xl flex-1 max-w-fit",
              ` ${role === "assistant" ? aiStyle : userStyle}`
            )}
          >
            <Markdown
              components={{ code: Code, pre: Pre }}
              remarkPlugins={[gfm]}
              rehypePlugins={[rehypeHighlight]}
              className={"w-full max-w-full"}
            >
              {content}
            </Markdown>
          </div>
        </div>
      </div>

      <time
        className={`text-xs text-slate-500 ${
          role === "assistant" ? "text-left ml-11" : "mr-2 text-right"
        }`}
        dateTime={date}
      >
        {new Date(date).toDateString()}
      </time>
    </motion.div>
  )
}

export default MessageBubble
