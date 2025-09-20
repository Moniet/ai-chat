import { create } from "zustand"
import { baseModels } from "../lib/baseModels"
import { ReactNode } from "react"
import { createJSONStorage, persist } from "zustand/middleware"
import { storageWrapper } from "@/lib/storage"

export type ChatModel = {
  name: string
  modelId: string
  capabilities: ("chat" | "vision" | "documents" | "audio")[]
  contextLimit: number
  baseUrl: string
  icon?: ReactNode
  id: string
  costPerToken?: string | undefined
  apiStorageKey: string
  isSelected?: boolean
}

export type ModelSettings = {
  temperature: number
  topK: number
  topP: number
  contextLimit: number
  frequencyPenalty: number
  presencePenalty: number
}

export type UseModelsStore = {
  currentModel: ChatModel
  selectedModels: ChatModel[]
  defaultModel?: ChatModel
  defaultVisionModel?: ChatModel
  customModels?: ChatModel[]
  modelSettings: ModelSettings
  defaultModelSetting?: ModelSettings
  setDefaultModel: (defaultModel: ChatModel) => void
  setDefaultVisionModel: (defaultVisionModel: ChatModel) => void
  setSelectedModelList: (modelList: ChatModel[]) => void
  setCurrentModel: (model: ChatModel) => void
  setCustomModels: (model: ChatModel[]) => void
  addCustomModel: (model: ChatModel) => void
  setDefaultModelSetting: (settings: ModelSettings) => void
  setModelSettings: (settings: Partial<ModelSettings>) => void
}

export const defaultModelSettings: ModelSettings = {
  temperature: 0.6,
  topP: 1,
  topK: 40,
  presencePenalty: 0,
  frequencyPenalty: 0,
  contextLimit: 4096
}

export const useModels = create<UseModelsStore>()(
  persist(
    (set) => ({
      modelSettings: defaultModelSettings,
      defaultModel: baseModels.OPENAI[0],
      currentModel: baseModels.OPENAI[0],
      selectedModels: [
        baseModels.OPENAI[0],
        baseModels.ANTHROPIC[0],
        baseModels.GEMINI[0]
      ],
      setCurrentModel: (model: ChatModel) => set({ currentModel: model }),
      setSelectedModelList: (selectedModels: ChatModel[]) =>
        set({ selectedModels }),
      setDefaultModel: (defaultModel) => set({ defaultModel }),
      setDefaultVisionModel: (defaultVisionModel) =>
        set({ defaultVisionModel }),
      addCustomModel: (customModel) =>
        set((s) => ({
          customModels: [customModel, ...(s.customModels ?? [])]
        })),
      setCustomModels: (customModels) => set({ customModels }),
      setModelSettings: (settings) =>
        set((s) => ({
          modelSettings: {
            ...s.modelSettings,
            ...settings
          }
        })),
      setDefaultModelSetting: (settings: ModelSettings) =>
        set({
          defaultModelSetting: settings
        })
    }),
    {
      name: "models",
      storage: createJSONStorage(() => storageWrapper),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["currentModel"].includes(key)
          )
        )
    }
  )
)
