import Layout from "@/components/design-system/layout"
import { Switch } from "@/components/design-system/switch"
import { useModels } from "@/hooks/use-models"
import { ChatModel } from "@/hooks/use-models"

const ModelDisplayItem = (props: ChatModel) => {
  const { id, name } = props
  const selectedModels = useModels((s) => s.selectedModels)
  const setSelectedModels = useModels((s) => s.setSelectedModelList)
  const defaultModel = useModels((s) => s.defaultModel)
  const setDefaultModel = useModels((s) => s.setDefaultModel)

  return (
    <div className="p-3 rounded-md bg-slate-800/50 grid grid-cols-[3fr_0.5fr_0.5fr] gap-3">
      <p className="text-base font-medium">{name}</p>
      <Switch
        checked={defaultModel?.id === id}
        onCheckedChange={(checked) => {
          if (checked) setDefaultModel(props)
        }}
      />
      <Switch
        checked={!!selectedModels.find((m) => m.id === id)}
        onCheckedChange={(checked) => {
          if (checked) setSelectedModels([props, ...selectedModels])
          else setSelectedModels(selectedModels.filter((m) => m.id !== id))
        }}
      />
    </div>
  )
}

export default ModelDisplayItem
