import { ReactNode, useEffect, useMemo, useState } from "react"
import { baseModels } from "./baseModels"
import { GPTIcon } from "./GPTIcon"
import { Label } from "@/components/design-system/label"
import { Input } from "@/components/design-system/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/design-system/select"
import { Checkbox } from "@/components/design-system/checkbox"
import { storage } from "@/lib/storage"
import { AnthropicIcon } from "./AnthropicIcon"
import { CaretDownIcon } from "@radix-ui/react-icons"
import { Eye, EyeOff } from "lucide-react"
import GeminiIcon from "./GeminiIcon"
import { useModels, ChatModel } from "@/hooks/use-models"

type ItemProps = {
  icon: ReactNode
  apiStorageKey: string
  label: string
  models: ChatModel[]
}

const Item = (props: ItemProps) => {
  const { icon, label, models } = props
  const [showMore, setShowMore] = useState(false)
  const defaultModel = useModels((s) => s.defaultModel)
  const setDefaultModel = useModels((s) => s.setDefaultModel)
  const [shouldReveal, setShouldReveal] = useState(false)

  const [apiKey, setApiKey] = useState("")
  const [selectedModel, setSelectedModel] = useState<ChatModel>(props.models[0])

  useEffect(() => {
    ;(async () => {
      const apiKeys = (await storage.getVal("API_KEYS")) ?? []
      storage.setVal("API_KEYS", {
        ...apiKeys,
        [props.apiStorageKey]: apiKey
      })
    })()
  }, [apiKey, props.apiStorageKey])

  useEffect(() => {
    storage
      .getVal("API_KEYS")
      .then((values) =>
        setApiKey(values?.[props.apiStorageKey as keyof typeof values] ?? "")
      )

    const hasDefaultModel = models.find(
      (m) => m.modelId === defaultModel?.modelId
    )
    if (hasDefaultModel) setSelectedModel(hasDefaultModel)
  }, [defaultModel?.modelId, models, props.apiStorageKey])

  return (
    <div className="w-full rounded-lg relative border border-slate-700  overflow-hidden">
      <div className="flex items-center text-lg border-b border-b-slate-700 p-3">
        <div className="size-5 mr-2" role="img">
          {icon}
        </div>
        {label}
      </div>
      <div className="flex flex-col max-sm:space-y-5">
        <div className="flex gap-2 items-center px-5 pb-3 pt-5">
          <Label className="font-light w-[50px] font-sm whitespace-nowrap text-slate-100 mr-2">
            {"API Key"}
          </Label>
          <div className="relative mt-1">
            <Input
              type={shouldReveal ? "text" : "password"}
              value={apiKey}
              placeholder="sk-xxxxxxxxxxxx"
              className=" min-w-[200px] w-[min(100%,500px)]"
              onChange={(e) => {
                setApiKey(e.target.value)
              }}
            />

            {/* <div className="w-[25px] h-[25px] aspect-square rounded-md bg-slate-700 p-[5px] absolute left-[5px] top-[50%] -translate-y-1/2">
                {icon}
              </div> */}
          </div>
          <button
            aria-label={shouldReveal ? "Hide" : "Reveal"}
            className="w-fit mt-1"
            onClick={() => setShouldReveal((p) => !p)}
          >
            <div className="text-xs dark:text-zinc-400 flex items-center">
              <div className="mr-1 size-8 flex items-center justify-center border border-slate-800 rounded-md">
                {shouldReveal ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </div>
              {/* <p>{shouldReveal ? "Hide" : "Reveal"}</p> */}
            </div>
          </button>
        </div>

        <div className="flex justify-start ml-5 pb-5 !mt-0">
          <button
            onClick={() => setShowMore((b) => !b)}
            className={`flex items-center gap-1 text-slate-400`}
          >
            {"Advanced"}{" "}
            <span>
              <CaretDownIcon
                className={`transition-transform ${
                  showMore ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </button>
        </div>

        {showMore && (
          <div className="px-5 !mt-0">
            <div className="border-t !mt-0 border-t-slate-700 w-full" />
          </div>
        )}
        {showMore && (
          <div className="p-5 pt-0">
            <div className="flex justify-start gap-3 items-center">
              <Label className="text-sm font-light mb-1 w-[50px]">Models</Label>
              <div>
                <Select
                  value={selectedModel?.modelId}
                  onValueChange={(value) => {
                    setSelectedModel(models.find((m) => m.modelId === value)!)
                  }}
                >
                  <SelectTrigger className="border border-slate-800 text-slate-200 min-w-[200px]  w-[min(100%,500px)]">
                    <SelectValue
                      placeholder="Select a model"
                      className="text-slate-500"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem value={m.modelId} key={m.modelId}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 items-center mt-3  ml-[62px]">
              <Checkbox
                onCheckedChange={(checked) =>
                  checked ? setDefaultModel(selectedModel) : ""
                }
                id={`${props.apiStorageKey}-default-mode`}
                checked={defaultModel?.modelId === selectedModel.modelId}
              />
              <Label
                className="text-sm font-light"
                htmlFor={`${props.apiStorageKey}-default-mode`}
              >
                Set as default model
              </Label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const DefaultProviders = () => {
  return (
    <div className="space-y-5">
      <Item
        label="OpenAI"
        icon={<GPTIcon />}
        apiStorageKey="OPENAI"
        models={baseModels.OPENAI}
      />
      <Item
        label="Anthropic"
        icon={<AnthropicIcon />}
        apiStorageKey="ANTHROPIC"
        models={baseModels.ANTHROPIC}
      />
      <Item
        label="Gemini"
        icon={<GeminiIcon />}
        apiStorageKey="GEMINI"
        models={baseModels.GEMINI}
      />
    </div>
  )
}

export default DefaultProviders
