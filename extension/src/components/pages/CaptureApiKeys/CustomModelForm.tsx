import { Button } from "@/components/design-system/button"
import { Checkbox } from "@/components/design-system/checkbox"
import { Input } from "@/components/design-system/input"
import { Label } from "@/components/design-system/label"
import { Separator } from "@/components/design-system/separator"
import { useForm, Controller } from "react-hook-form"
import { FormField, Form } from "@/components/design-system/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useModels, ChatModel } from "@/hooks/use-models"
import { storage } from "@/lib/storage"
import { saveApiKey } from "@/hooks/useApiKeys"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"

const formFields = z.object({
  name: z.string().min(1, "Model name is required"),
  baseUrl: z.string().url("Invalid URL"),
  contextLimit: z.number().optional(),
  costPerToken: z.string().optional(),
  apiKey: z.string(),
  modelId: z.string(),
  defaultChat: z.boolean().optional(),
  defaultVision: z.boolean().optional(),
  capabilities: z
    .array(z.string())
    .min(1, "At least one capability is required")
})

type FormData = z.infer<typeof formFields>

const defaultValues: Partial<FormData> = {
  name: "",
  modelId: "",
  baseUrl: "",
  contextLimit: 4096,
  capabilities: [],
  apiKey: "",
  costPerToken: ""
}

const CustomModelForm = ({ initialData }: { initialData?: ChatModel }) => {
  const { toast } = useToast()
  const form = useForm<FormData>({
    resolver: zodResolver(formFields),
    defaultValues
  })
  const addCustomModel = useModels((s) => s.addCustomModel)
  const defaultModel = useModels((s) => s.defaultModel)
  const defaultVisionModel = useModels((s) => s.defaultVisionModel)
  const setCustomModels = useModels((s) => s.setCustomModels)
  const customModels = useModels((s) => s.customModels)
  const setDefaultChatModel = useModels((s) => s.setDefaultModel)
  const setDefaultVisionModel = useModels((s) => s.setDefaultVisionModel)
  const selectedModels = useModels((s) => s.selectedModels)
  const setSelectedModelList = useModels((s) => s.setSelectedModelList)

  useEffect(() => {
    ;(async () => {
      if (initialData) {
        const apiKeys = await storage.getVal<Record<string, string>>("API_KEYS")
        form.reset({
          apiKey: apiKeys![initialData.modelId as keyof typeof apiKeys],
          ...initialData,
          defaultChat: defaultModel!.id === initialData.id,
          defaultVision: defaultVisionModel?.id === initialData.id
        })
      }
    })()
  }, [])

  const onSubmit = (data: FormData) => {
    // Handle form submission
    saveApiKey(data.modelId, data.apiKey)

    const model: ChatModel = {
      modelId: data.modelId,
      name: data.name,
      baseUrl: data.baseUrl,
      contextLimit: data.contextLimit || 0,
      id: initialData?.id || crypto.randomUUID(),
      capabilities: data.capabilities as any,
      apiStorageKey: data.modelId,
      costPerToken: data.costPerToken
    }

    if (data.defaultChat) {
      setDefaultChatModel(model)
      if (!selectedModels.find((m) => m.id === model.id)) {
        setSelectedModelList([model, ...selectedModels])
      }
    }

    if (data.defaultVision) setDefaultVisionModel(model)

    if (initialData) {
      const index = customModels!.findIndex((m) => m.id === initialData.id)
      setCustomModels([
        ...customModels!.slice(0, index),
        model,
        ...customModels!.slice(index + 1)
      ])
    } else {
      addCustomModel(model)
    }

    if (initialData) {
      toast({
        title: "🥳 Successfully Updated Custom Model"
      })
    } else {
      form.reset(defaultValues)
      toast({
        title: "🥳 Successfully Added Custom Model"
      })
    }
  }

  return (
    <div className="rounded-md border border-slate-700 p-5">
      <Form {...form}>
        <div className="p-2 rounded bg-slate-800/50 mb-2">
          <p className="text-xs">
            <span className="text-destructive">*</span> Must be compatible with{" "}
            <span className="underline">/chats/completions</span> endpoint
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              name="apiKey"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="modelName" className="text-sm">
                    API Key*
                  </Label>
                  <Input
                    id="modelName"
                    placeholder="sk-xxxxxxxxxxxxxxxx"
                    {...field}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="baseUrl"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="baseUrl" className="text-sm">
                    BaseUrl*
                  </Label>
                  <Input id="baseUrl" placeholder="Enter base URL" {...field} />
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="modelID" className="text-sm">
                    Model Id*
                  </Label>
                  <Input
                    id="modelID"
                    placeholder="Enter API Model ID"
                    {...field}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="modelName" className="text-sm">
                    Model Name
                  </Label>
                  <Input
                    id="modelName"
                    placeholder="Enter model name"
                    {...field}
                  />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="contextLimit"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="contextLimit" className="text-sm">
                    Context Limit
                  </Label>
                  <Input id="contextLimit" placeholder="4096" {...field} />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="costPerToken"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="costPerToken" className="text-sm">
                    Cost per token (optional)
                  </Label>
                  <Input id="costPerToken" placeholder="$0.000003" {...field} />
                </div>
              )}
            />
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <Label className="text-sm">Default Model Settings</Label>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="defaultChat"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="default-chat"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="default-chat" className="text-sm">
                      Use as default chat model
                    </Label>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="defaultVision"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="default-vision"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="default-vision" className="text-sm">
                      Use as default vision model
                    </Label>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm">Model Capabilities</Label>
            <Controller
              name="capabilities"
              control={form.control}
              render={({ field }) => (
                <div className="flex space-x-6">
                  {["chat", "vision", "documents"].map((capability) => (
                    <div
                      key={capability}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`capability-${capability}`}
                        checked={field.value.includes(capability)}
                        onCheckedChange={(checked) => {
                          const updatedCapabilities = checked
                            ? [...field.value, capability]
                            : field.value.filter((c) => c !== capability)
                          field.onChange(updatedCapabilities)
                        }}
                      />
                      <Label
                        htmlFor={`capability-${capability}`}
                        className="text-sm"
                      >
                        {capability.charAt(0).toUpperCase() +
                          capability.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
          <div className="pt-4">
            <Button type="submit" size="sm">
              {initialData ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CustomModelForm
