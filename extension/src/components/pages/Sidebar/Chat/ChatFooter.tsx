import { Button } from "@/components/design-system/button"
import { storage } from "@/lib/storage"

import { Loader, Mic, SendIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { aiChat, streamText } from "@/lib/aiChat"
import { toast } from "@/hooks/use-toast"
import { useMessages, ChatMessage } from "@/hooks/use-messages"
import { useModels } from "@/hooks/use-models"

const ChatFooter = () => {
  const textarea = useRef<HTMLTextAreaElement>(null)
  const [message, setMessage] = useState("")

  const isGenerating = useMessages((s) => s.isGenerating)
  const setIsGenerating = useMessages((s) => s.setIsGenerating)
  const messages = useMessages((s) => s.messages)
  const setChatMessage = useMessages((s) => s.setMessage)
  const updateLastMessage = useMessages((s) => s.updateLastMessage)
  const model = useModels((s) => s.currentModel)
  const controller = useRef<AbortController>(new AbortController())

  useEffect(() => {
    textarea?.current?.focus()
    const adjustHeight = () => {
      if (textarea.current) {
        const el = textarea.current

        // Store the message in storage
        storage.setVal("typed-message" as any, message)

        // Reset height to auto and set to 0 to correctly calculate the new height
        el.style.minHeight = "auto"
        el.style.minHeight = "0px"

        // Calculate new height
        const scrollHeight = el.scrollHeight
        const newHeight = Math.min(Math.max(scrollHeight, 65), 500)

        // Set new height
        el.style.minHeight = `${newHeight}px`
      }
    }

    adjustHeight()

    // Add event listener for window resize
    textarea.current?.addEventListener("resize", adjustHeight)

    // Cleanup function to remove event listener
    const textareaElement = textarea.current
    return () => {
      textareaElement?.removeEventListener("resize", adjustHeight)
    }
  }, [message])

  const handleSend = async () => {
    const currentMessage = message.trim()
    const temp = currentMessage

    if (!currentMessage) {
      return
    }

    setMessage("")

    const nextMessage: ChatMessage = {
      role: "user",
      content: message,
      date: new Date().toISOString()
    }

    setChatMessage(nextMessage)

    const stream = await aiChat(
      model,
      {
        messages: [...messages, nextMessage]
      },
      controller.current.signal
    ).catch((err) => {
      console.error(err)
      toast({
        title: "Error generating text",
        description: "There was an error generating the text",
        variant: "destructive"
      })
      return null
    })

    console.log({ stream })

    if (!stream) {
      return
    }

    const data: ChatMessage = {
      date: new Date().toISOString(),
      role: "user",
      content: ""
    }

    setChatMessage({
      role: "assistant",
      content: "loading...",
      date: new Date().toISOString()
    })

    setIsGenerating(true)

    controller.current = new AbortController()

    try {
      await streamText(
        model.apiStorageKey,
        stream as any,
        (text: string) => {
          updateLastMessage({
            ...data,
            role: "assistant",
            content: text
          })
        },
        controller.current.signal
      )
    } finally {
      setIsGenerating(false)
    }

    setMessage("")
    storage.setVal("typed-message" as any, "")
  }

  useEffect(() => {
    const cb = function (event: KeyboardEvent) {
      // Check if the pressed key is Enter and if Cmd (Mac) or Ctrl (Windows) is also pressed
      if (
        event.key === "Enter" &&
        !event.metaKey &&
        !event.shiftKey &&
        message
      ) {
        // Prevent the default action
        event.preventDefault()
        handleSend()
      }
    }
    document.addEventListener("keydown", cb)

    return () => {
      document.removeEventListener("keydown", cb)
    }
  }, [message])

  return (
    <div className="relative w-full p-3 border-t border-t-slate-800 h-fit gap-2 flex items-end">
      <div className="px-4 rounded-md border border-slate-800 focus:border-slate-600 w-full">
        <textarea
          ref={textarea}
          name="message"
          className="w-full min-h-[65px] h-full max-h-[500px] resize-none border-none outline-none focus:border-none focus:outline-none bg-transparent placeholder:text-slate-600 text-sm py-2 pr-5"
          placeholder="Type your message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <div className="absolute bottom-5 right-5 gap-1 flex flex-col">
          <div className="flex-[0.5] h-[40px]">
            <Button
              variant={"outline"}
              className="size-6 p-1"
              size="sm"
              aria-label="Record Message"
            >
              <Mic className="size-4" />
            </Button>
          </div>
          {!isGenerating && (
            <Button
              className="size-6 max-h-[40px] p-1"
              aria-label="Send Message"
              size="sm"
              variant={"outline"}
              onClick={(e) => {
                e.preventDefault()
                handleSend()
              }}
              disabled={isGenerating}
            >
              <SendIcon className="size-4 " />
            </Button>
          )}
          {isGenerating && (
            <Button
              className="size-6 max-h-[40px] p-1"
              aria-label="Send Message"
              size="sm"
              variant={"outline"}
              onClick={() => {
                controller.current.abort()
              }}
            >
              <Loader className="size-4 animate-spin" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatFooter
