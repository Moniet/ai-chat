import { OpenAI } from "openai"
import { ChatMessage, ChatModel } from "../components/pages/Sidebar/use-sidebar"
import { storage } from "./storage"
import { API_KEYS } from "@/types/api-keys"
import { APIPromise, RequestOptions } from "openai/core.mjs"
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs"
import { Stream } from "openai/streaming.mjs"
import { debounce } from "lodash"

type Props = {
  message: ChatMessage
}

export const aiChat = async (
  props: ChatModel,
  options: Omit<ChatCompletionCreateParamsNonStreaming, "model">
) => {
  const apiKeys = (await storage.getVal<API_KEYS>("API_KEYS"))!
  const apiKey = apiKeys[props.apiStorageKey as keyof typeof apiKeys]!

  console.log({ apiKey })

  const client = new OpenAI({
    apiKey,
    baseURL: props.baseUrl,
    dangerouslyAllowBrowser: true
  })

  return await client.chat.completions.create({
    temperature: 0.6,
    model: props.value as any,
    stream: true,
    ...options
  })
}

export const streamText = async (
  stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>,
  onChunk: (str: string) => void
) => {
  try {
    let text = ""

    const interval = setInterval(() => {
      onChunk(text)
    }, 100)

    onChunk(text)
    for await (const chunk of stream) {
      if (stream.controller.signal.aborted) {
        return null
      }

      const content = chunk.choices[0]?.delta?.content || ""
      if (content) {
        text += content
      }
    }

    clearInterval(interval)
    onChunk(text)
  } catch (error) {
    console.error("Error in streamText:", error)
    throw error
  }
}
