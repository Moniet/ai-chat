import { storage } from "@/lib/storage"
import { ReactNode } from "react"
import { create } from "zustand"
import { FaMeta } from "react-icons/fa6"
import { createJSONStorage, persist, StateStorage } from "zustand/middleware"

export type ChatModel = {
  label: string
  value: string
  capabilities: ("chat" | "vision" | "documents" | "audio")[]
  contextLimit: number
  baseUrl: string
  icon?: ReactNode
  id: string
  apiStorageKey: string
}

export type ChatMessage = {
  role: "assistant" | "user" | "system"
  content: string
  date: string
}

export type SidebarStore = {
  isGenerating: boolean
  currentModel: ChatModel
  modelList: ChatModel[]
  messages: ChatMessage[]
  setMessage: (message: ChatMessage) => void
  updateLastMessage: (message: ChatMessage) => void
  setIsGenerating: (isGenerating: boolean) => void
}

const storageWrapper: StateStorage = {
  getItem: (name: string) => storage.getVal<string>(name as any),
  setItem: (name: string, value: string) =>
    storage.getVal<string>(name as any, value as any),
  removeItem: (name: string) => storage.removeVal(name as any)
}

const GPTIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      className="size-full"
      viewBox="0 0 24 24"
    >
      <path
        d="M 11.134766 1.0175781 C 10.87173 1.0049844 10.606766 1.0088281 10.337891 1.0332031 C 8.1135321 1.2338971 6.3362243 2.7940749 5.609375 4.8203125 C 3.8970488 5.1768339 2.4372723 6.3048522 1.671875 7.9570312 C 0.73398779 9.9840533 1.1972842 12.30076 2.5878906 13.943359 C 2.0402591 15.605222 2.2856216 17.434472 3.3320312 18.921875 C 4.6182099 20.747762 6.8565685 21.504693 8.9746094 21.121094 C 10.139659 22.427613 11.84756 23.130452 13.662109 22.966797 C 15.886521 22.766098 17.663809 21.205995 18.390625 19.179688 C 20.102972 18.823145 21.563838 17.695991 22.330078 16.042969 C 23.268167 14.016272 22.805368 11.697142 21.414062 10.054688 C 21.960697 8.3934373 21.713894 6.5648387 20.667969 5.078125 C 19.38179 3.2522378 17.143432 2.4953068 15.025391 2.8789062 C 14.032975 1.7660011 12.646869 1.0899755 11.134766 1.0175781 z M 11.025391 2.5136719 C 11.921917 2.5488523 12.754993 2.8745885 13.431641 3.421875 C 13.318579 3.4779175 13.200103 3.5164101 13.089844 3.5800781 L 9.0761719 5.8964844 C 8.7701719 6.0724844 8.5801719 6.3989531 8.5761719 6.7519531 L 8.5175781 12.238281 L 6.75 11.189453 L 6.75 6.7851562 C 6.75 4.6491563 8.3075938 2.74225 10.433594 2.53125 C 10.632969 2.5115 10.83048 2.5060234 11.025391 2.5136719 z M 16.125 4.2558594 C 17.398584 4.263418 18.639844 4.8251563 19.417969 5.9101562 C 20.070858 6.819587 20.310242 7.9019929 20.146484 8.9472656 C 20.041416 8.8773528 19.948163 8.794144 19.837891 8.7304688 L 15.826172 6.4140625 C 15.520172 6.2380625 15.143937 6.2352031 14.835938 6.4082031 L 10.052734 9.1035156 L 10.076172 7.0488281 L 13.890625 4.8476562 C 14.584375 4.4471562 15.36085 4.2513242 16.125 4.2558594 z M 5.2832031 6.4726562 C 5.2752078 6.5985272 5.25 6.7203978 5.25 6.8476562 L 5.25 11.480469 C 5.25 11.833469 5.4362344 12.159844 5.7402344 12.339844 L 10.464844 15.136719 L 8.6738281 16.142578 L 4.859375 13.939453 C 3.009375 12.871453 2.1365781 10.567094 3.0175781 8.6210938 C 3.4795583 7.6006836 4.2963697 6.8535791 5.2832031 6.4726562 z M 15.326172 7.8574219 L 19.140625 10.060547 C 20.990625 11.128547 21.865375 13.432906 20.984375 15.378906 C 20.522287 16.399554 19.703941 17.146507 18.716797 17.527344 C 18.724764 17.401695 18.75 17.279375 18.75 17.152344 L 18.75 12.521484 C 18.75 12.167484 18.563766 11.840156 18.259766 11.660156 L 13.535156 8.8632812 L 15.326172 7.8574219 z M 12.025391 9.7109375 L 13.994141 10.878906 L 13.966797 13.167969 L 11.974609 14.287109 L 10.005859 13.121094 L 10.03125 10.832031 L 12.025391 9.7109375 z M 15.482422 11.761719 L 17.25 12.810547 L 17.25 17.214844 C 17.25 19.350844 15.692406 21.25775 13.566406 21.46875 C 12.449968 21.579344 11.392114 21.244395 10.568359 20.578125 C 10.681421 20.522082 10.799897 20.48359 10.910156 20.419922 L 14.923828 18.103516 C 15.229828 17.927516 15.419828 17.601047 15.423828 17.248047 L 15.482422 11.761719 z M 13.947266 14.896484 L 13.923828 16.951172 L 10.109375 19.152344 C 8.259375 20.220344 5.8270313 19.825844 4.5820312 18.089844 C 3.9291425 17.180413 3.6897576 16.098007 3.8535156 15.052734 C 3.9587303 15.122795 4.0516754 15.205719 4.1621094 15.269531 L 8.1738281 17.585938 C 8.4798281 17.761938 8.8560625 17.764797 9.1640625 17.591797 L 13.947266 14.896484 z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

export const defaultModels: ChatModel[] = [
  {
    id: "81940a48-195f-458b-9997-ff35033fbd3e",
    label: "GPT-4o",
    value: "gpt-4o",
    baseUrl: "https://api.openai.com/v1",
    capabilities: ["chat"],
    icon: <GPTIcon />,
    contextLimit: 1024,
    apiStorageKey: "OPENAI"
  },
  {
    id: "2cc6b4b8-50ef-4622-b42b-f1fccc70a03f",
    label: "Llama 405B",
    value: "llama-405B",
    baseUrl: "https://api.openai.com/v1",
    apiStorageKey: "LLAMA",
    capabilities: ["chat"],
    icon: <FaMeta className="size-full" />,
    contextLimit: 2048
  }
]

export const useSidebar = create<SidebarStore>()(
  persist(
    (set) => ({
      currentModel: defaultModels[0],
      isGenerating: false,
      messages: [
        {
          role: "assistant",
          content: "Hi I'm your helpful assistant",
          date: "2024-09-07T10:47:50.510Z"
        }
        // {
        //   role: "user",
        //   content: "Hi ", //can you pretend to be my therapist, i need someone to talk to.
        //   date: "2024-09-07T10:47:59.760Z"
        // }
      ],
      modelList: defaultModels,
      setCurrentModel: (model: ChatModel) => set({ currentModel: model }),
      setModelList: (modelList: ChatModel[]) => set({ modelList }),
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
    }),
    {
      name: "sidebar",
      storage: createJSONStorage(() => storageWrapper),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["messages", "isGenerating"].includes(key) // filter out these keys
          )
        )
    }
  )
)
