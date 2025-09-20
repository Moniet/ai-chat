import { Button } from "@/components/design-system/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/design-system/popover"
import { useEffect } from "react"
import { Check, SlidersHorizontal } from "lucide-react"
import { Label } from "@/components/design-system/label"
import { Slider } from "@/components/design-system/slider"
import {
  defaultModelSettings,
  ModelSettings,
  useModels
} from "@/hooks/use-models"
import { Input } from "@/components/design-system/input"
import { useToast } from "@/hooks/use-toast"

const SavedModelSettings = () => {
  return (
    <div className="flex gap-2 items-center">
      <Check className="size-4" />
      Saved Default Model Settings
    </div>
  )
}

const ModelSettingsPopover = () => {
  const { toast } = useToast()
  const setModelSettings = useModels((s) => s.setModelSettings)
  const setDefaultModelSettings = useModels((s) => s.setDefaultModelSetting)
  const modelSettings = useModels((s) => s.modelSettings)
  const defaultModelSetting = useModels((s) => s.defaultModelSetting)
  const settings = modelSettings

  function saveAsDefault() {
    setDefaultModelSettings(modelSettings)
    toast({
      title: (<SavedModelSettings />) as any
    })
  }

  function resetSettings() {
    setModelSettings(defaultModelSetting ?? defaultModelSettings)
  }

  const setModelSettingsValue = (key: keyof ModelSettings) => (val: any) =>
    setModelSettings({ [key]: val })

  useEffect(() => {
    if (defaultModelSetting) setModelSettings(defaultModelSetting)
  }, [defaultModelSetting]) //eslint-disable-line

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant={"ghost"}>
          <SlidersHorizontal className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4 min-w-[400px]">
        <div className="font-medium text-base">Model Settings</div>

        <div className="grid gap-3 grid-cols-[1fr_3fr_0.5fr] items-center">
          <Label>Temperature</Label>
          <Slider
            min={0}
            defaultValue={[settings.temperature]}
            max={1}
            step={0.1}
            value={[settings.temperature]}
            onValueChange={setModelSettingsValue("temperature")}
          />
          <div className="text-center p-1 bg-slate-800 border rounded">
            {settings.temperature}
          </div>
        </div>
        <div className="grid gap-3 grid-cols-[1fr_3fr_0.5fr] items-center">
          <Label>Top K</Label>
          <Slider
            value={[settings.topK]}
            min={1}
            max={100}
            step={1}
            onValueChange={setModelSettingsValue("topK")}
          />
          <div className="text-center p-1 bg-slate-800 border rounded">
            {settings.topK}
          </div>
        </div>
        <div className="grid gap-3 grid-cols-[1fr_3fr_0.5fr] items-center">
          <Label>Top P</Label>
          <Slider
            value={[settings.topP]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={setModelSettingsValue("topP")}
          />
          <div className="text-center p-1 bg-slate-800 border rounded">
            {settings.topP}
          </div>
        </div>
        <div className="grid gap-3 grid-cols-[1fr_3fr_0.5fr] items-center">
          <Label>Freq. Penalty</Label>
          <Slider
            step={0.1}
            value={[settings.frequencyPenalty]}
            min={-2}
            max={2}
            onValueChange={setModelSettingsValue("frequencyPenalty")}
          />
          <div className="text-center p-1 bg-slate-800 border rounded">
            {settings.frequencyPenalty}
          </div>
        </div>
        <div className="grid gap-3 grid-cols-[1fr_3fr_0.5fr] items-center">
          <Label>Pres. Penalty</Label>
          <Slider
            step={0.1}
            value={[settings.presencePenalty]}
            min={-2}
            max={2}
            onValueChange={setModelSettingsValue("presencePenalty")}
          />
          <div className="text-center p-1 bg-slate-800 border rounded">
            {settings.presencePenalty}
          </div>
        </div>
        <div className="grid gap-3 grid-cols-[1fr_3fr] items-center">
          <Label>Max Tokens</Label>
          <Input
            value={settings.contextLimit}
            onChange={setModelSettingsValue("contextLimit")}
          />
        </div>

        <div className="flex gap-2">
          <Button size={"sm"} className="w-full" onClick={saveAsDefault}>
            Save as default
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            className="w-full"
            onClick={resetSettings}
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ModelSettingsPopover
