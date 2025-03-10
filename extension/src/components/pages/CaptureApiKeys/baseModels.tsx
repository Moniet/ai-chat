import { ChatModel } from "@/hooks/use-models"
import { AnthropicIcon } from "./AnthropicIcon"
import GeminiIcon from "./GeminiIcon"
import { GPTIcon } from "./GPTIcon"

export const baseModels: Record<
  "OPENAI" | "GEMINI" | "ANTHROPIC",
  ChatModel[]
> = {
  OPENAI: [
    {
      id: "100",
      apiStorageKey: "OPENAI",
      baseUrl: "https://api.openai.com/v1",
      capabilities: ["chat", "vision", "documents"],
      icon: <GPTIcon />,
      contextLimit: 4096,
      name: "GPT-4o",
      modelId: "gpt-4o",
      isSelected: true
    },
    {
      id: "102",
      apiStorageKey: "OPENAI",
      baseUrl: "https://api.openai.com/v1",
      capabilities: ["chat", "vision", "documents"],
      icon: <GPTIcon />,
      contextLimit: 4096,
      name: "GPT-4o Mini",
      modelId: "gpt-4o-mini",
      isSelected: true
    },
    {
      id: "103",
      apiStorageKey: "OPENAI",
      baseUrl: "https://api.openai.com/v1",
      capabilities: ["chat", "vision", "documents"],
      icon: <GPTIcon />,
      contextLimit: 4096,
      name: "GPT-4 Turbo",
      modelId: "gpt-4-turbo"
    },
    {
      id: "104",
      apiStorageKey: "OPENAI",
      baseUrl: "https://api.openai.com/v1",
      capabilities: ["chat", "vision", "documents"],
      icon: <GPTIcon />,
      contextLimit: 4096,
      name: "GPT-4",
      modelId: "gpt-4",
      isSelected: true
    },
    {
      id: "105",
      apiStorageKey: "OPENAI",
      baseUrl: "https://api.openai.com/v1",
      capabilities: ["chat", "vision", "documents"],
      icon: <GPTIcon />,
      contextLimit: 4096,
      name: "GPT-3.5 Turbo",
      modelId: "gpt-3.5-turbo"
    }
  ],
  ANTHROPIC: [
    {
      id: "200",
      apiStorageKey: "ANTHROPIC",
      baseUrl: "https://api.anthropic.com/v1/messages",
      capabilities: ["chat", "vision", "documents"],
      icon: <AnthropicIcon />,
      contextLimit: 4096,
      name: "Claude Sonnet 3.5",
      modelId: "claude-3-5-sonnet-20240620"
    },
    {
      id: "201",
      apiStorageKey: "ANTHROPIC",
      baseUrl: "https://api.anthropic.com/v1/messages",
      capabilities: ["chat", "vision", "documents"],
      icon: <AnthropicIcon />,
      contextLimit: 4096,
      name: "Claude 3 Opus",
      modelId: "claude-3-opus-20240229"
    },
    {
      id: "203",
      apiStorageKey: "ANTHROPIC",
      baseUrl: "https://api.anthropic.com/v1/messages",
      capabilities: ["chat", "vision", "documents"],
      icon: <AnthropicIcon />,
      contextLimit: 4096,
      name: "Claude 3 Haiku",
      modelId: "claude-3-haiku-20240307"
    }
  ],
  GEMINI: [
    {
      id: "331",
      apiStorageKey: "GEMINI",
      baseUrl: "",
      capabilities: ["chat", "vision", "documents"],
      icon: <GeminiIcon />,
      contextLimit: 4096,
      name: "Gemini 1.5 Pro",
      modelId: "gemini-1.5-pro"
    },
    {
      id: "332",
      apiStorageKey: "GEMINI",
      baseUrl: "",
      capabilities: ["chat", "vision", "documents"],
      icon: <GeminiIcon />,
      contextLimit: 4096,
      name: "Gemini 1.0 Pro",
      modelId: "gemini-1.0-pro"
    },
    {
      id: "333",
      apiStorageKey: "GEMINI",
      baseUrl: "",
      capabilities: ["chat", "vision", "documents"],
      icon: <GeminiIcon />,
      contextLimit: 4096,
      name: "Gemini 1.5 Flash",
      modelId: "gemini-1.5-flash"
    }
  ]
}
