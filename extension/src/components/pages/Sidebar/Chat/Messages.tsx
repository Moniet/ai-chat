import { ScrollArea } from "@/components/design-system/scroll-area"
import React, { useEffect, useRef, useCallback } from "react"
import { useSidebar } from "../use-sidebar"
import MessageBubble from "./MessageBubble"
import { motion } from "framer-motion"

const Messages = () => {
  const messages = useSidebar((s) => s.messages)
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

  return (
    <ScrollArea className="w-full max-h-full p-5 flex-1" ref={scrollAreaRef}>
      {messages.map((m) => (
        <MessageBubble key={m.date} {...m} />
      ))}
    </ScrollArea>
  )
}

export default Messages
