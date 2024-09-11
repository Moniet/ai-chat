import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/design-system/alert"
import { Input } from "@/components/design-system/input"
import { Label } from "@/components/design-system/label"
import { useToast } from "@/hooks/use-toast"
import { storage } from "@/lib/storage"
import { API_KEYS } from "@/types/api-keys"
import { FormEventHandler, useState } from "react"

const CaptureKeys = () => {
  const [apiKeys, setApiKeys] = useState<API_KEYS>({
    FIREWORKS: "",
    OPENAI: "",
    ANTHROPIC: "",
    GEMINI: "",
    MISTRAL: ""
  })

  const { toast } = useToast()

  useState(() => {
    storage.setVal("API_KEYS", apiKeys)
  })

  const handleChange: FormEventHandler = (e) => {
    const target = e.target as HTMLInputElement

    setApiKeys({
      ...apiKeys,
      [target.name]: target.value
    })
  }

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const isValid = Object.values(apiKeys).some(Boolean)
    if (!isValid)
      return toast({
        title: "API Key Not Entered",
        description: "Please enter an API Key to get started",
        variant: "destructive"
      })
  }

  return (
    <div>
      <Alert variant={"destructive"}>
        <AlertTitle>Please Provide Your API KEY</AlertTitle>
        <AlertDescription>
          Please provide your OpenAi/Gemini/Anthropic API Key to get starte
        </AlertDescription>
      </Alert>

      <form
        className="space-y-5"
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        <div className="flex gap-3">
          <Label>OpenAi API Key</Label>
          <Input name={"OPENAI"} type="text" placeholder="sk_XXXX" />
        </div>
        <div className="flex gap-3">
          <Label>Gemini API Key</Label>
          <Input name={"GEMINI"} type="text" placeholder="sk_XXXX" />
        </div>
        <div className="flex gap-3">
          <Label>Anthropic API Key</Label>
          <Input name={"ANTHROPIC"} type="text" placeholder="sk_XXXX" />
        </div>
        <div className="flex gap-3">
          <Label>Mistral API Key</Label>
          <Input name={"FIREWORKS"} type="text" placeholder="sk_XXXX" />
        </div>
      </form>
    </div>
  )
}

export default CaptureKeys
