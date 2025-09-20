import { OpenAI } from "openai"
import { storage } from "./storage"
import { API_KEYS } from "@/types/api-keys"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createAnthropic, anthropic } from "@ai-sdk/anthropic"
import { streamText as st } from "ai"
import { ChatModel } from "../hooks/use-models"
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index.mjs"

const openAiChat = async (
  apiKey: string,
  model: ChatModel,
  options: Omit<ChatCompletionCreateParamsNonStreaming, "model">
) => {
  const client = new OpenAI({
    apiKey,
    baseURL: model.baseUrl,
    dangerouslyAllowBrowser: true
  })

  return await client.chat.completions.create({
    model: model.modelId as any,
    stream: true,
    messages: options.messages,
    max_tokens: options.max_tokens,
    presence_penalty: options.presence_penalty,
    frequency_penalty: options.frequency_penalty
  })
}

const geminiChat = async (
  apiKey: string,
  model: ChatModel,
  options: Omit<ChatCompletionCreateParamsNonStreaming, "model"> & {
    top_k?: number
  },
  signal: AbortSignal
) => {
  const stream = await st({
    model: createGoogleGenerativeAI({ apiKey })(model.modelId as any),
    messages: options.messages as any,
    topK: options.top_k,
    topP: options.top_p ?? 1,
    maxTokens: options.max_tokens ?? 4096,
    temperature: options.temperature!,
    presencePenalty: options.presence_penalty ?? 0,
    frequencyPenalty: options.presence_penalty ?? 0,
    abortSignal: signal
  })

  return stream.textStream
}
const anthropicChat = async (
  apiKey: string,
  model: ChatModel,
  options: Omit<ChatCompletionCreateParamsNonStreaming, "model"> & {
    top_k?: number
  },
  signal: AbortSignal
) => {
  const stream = await st({
    model: createAnthropic({
      apiKey,
      headers: {
        "anthropic-dangerous-direct-browser-access": "true"
      }
    })(model.modelId),
    messages: options.messages as any,
    topK: options.top_k,
    topP: options.top_p ?? 1,
    maxTokens: options.max_tokens ?? 4096,
    temperature: options.temperature!,
    presencePenalty: options.presence_penalty ?? 0,
    frequencyPenalty: options.presence_penalty ?? 0,
    abortSignal: signal
  })

  return stream.textStream
}

const getChatStream = (
  storagePath: string,
  apiKey: string,
  model: ChatModel,
  options: Omit<ChatCompletionCreateParamsNonStreaming, "model">,
  signal: AbortSignal
) => {
  if (storagePath === "GEMINI")
    return geminiChat(apiKey, model, options, signal)

  if (storagePath === "ANTHROPIC")
    return anthropicChat(apiKey, model, options, signal)

  return openAiChat(apiKey, model, options)
}

export const aiChat = async (
  props: ChatModel,
  options: Omit<ChatCompletionCreateParamsNonStreaming, "model">,
  signal: AbortSignal
) => {
  const apiKeys = (await storage.getVal<API_KEYS>("API_KEYS"))!
  const apiKey = apiKeys[props.apiStorageKey as keyof typeof apiKeys]!

  return getChatStream(props.apiStorageKey, apiKey, props, options, signal)
}

export const streamText = async (
  apiStorageKey: string,
  stream: any,
  onChunk: (str: string) => void,
  signal: AbortSignal
) => {
  if (apiStorageKey === "GEMINI") {
    let content = ""
    onChunk(content)

    for await (const chunk of stream) {
      if (signal.aborted) return null
      content += chunk
      onChunk(content)
    }

    onChunk(content)
    return null
  }

  try {
    let text = ""

    const interval = setInterval(() => {
      onChunk(text)
    }, 100)

    onChunk(text)

    for await (const chunk of stream) {
      if (stream.controller.signal.aborted || signal.aborted) {
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
