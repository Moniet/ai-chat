import { ScrollArea } from "@/components/design-system/scroll-area"
import { useEffect, useRef, useCallback } from "react"
import MessageBubble from "./MessageBubble"
import { useMessages } from "@/hooks/use-messages"

const Messages = () => {
  const messages = useMessages((s) => s.messages)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isScrolledToBottomRef = useRef(true)

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current && isScrolledToBottomRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [])

  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    )

    const handleScroll = () => {
      if (scrollElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollElement
        isScrolledToBottomRef.current =
          scrollHeight - scrollTop === clientHeight
      }
    }

    scrollElement?.addEventListener("scroll", handleScroll)
    return () => scrollElement?.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const renderMessages = messages.map((m) => (
    <MessageBubble key={m.date} {...m} />
  ))

  return (
    <ScrollArea className="w-full max-h-full p-5 flex-1" ref={scrollAreaRef}>
      <div>{renderMessages}</div>
    </ScrollArea>
  )
}

export default Messages
