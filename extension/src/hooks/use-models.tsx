import { create } from "zustand"
import { baseModels } from "../components/pages/CaptureApiKeys/baseModels"
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

export type UseModelsStore = {
  currentModel: ChatModel
  selectedModels: ChatModel[]
  defaultModel?: ChatModel
  defaultVisionModel?: ChatModel
  customModels?: ChatModel[]
  setDefaultModel: (defaultModel: ChatModel) => void
  setDefaultVisionModel: (defaultVisionModel: ChatModel) => void
  setSelectedModelList: (modelList: ChatModel[]) => void
  setCurrentModel: (model: ChatModel) => void
  setCustomModels: (model: ChatModel[]) => void
  addCustomModel: (model: ChatModel) => void
}

export const useModels = create<UseModelsStore>()(
  persist(
    (set) => ({
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
      setCustomModels: (customModels) => set({ customModels })
    }),
    {
      name: "models",
      storage: createJSONStorage(() => storageWrapper)
    }
  )
)
