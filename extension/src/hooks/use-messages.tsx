import { create } from "zustand"

export type ChatMessage = {
  role: "assistant" | "user" | "system"
  content: string
  date: string
}

type Store = {
  messages: ChatMessage[]
  isGenerating: boolean
  setMessage: (message: ChatMessage) => void
  setIsGenerating: (isGenerating: boolean) => void
  updateLastMessage: (message: ChatMessage) => void
}

export const useMessages = create<Store>()((set) => ({
  messages: [],
  isGenerating: false,
  setMessage: (message: ChatMessage) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),
  updateLastMessage: (message: ChatMessage) =>
    set((state) => ({
      messages: state.messages
        .slice(0, state.messages.length - 1)
        .concat(Object.assign(state.messages.at(-1)!, message))
    })),
  setIsGenerating: (isGenerating) => set({ isGenerating })
}))
