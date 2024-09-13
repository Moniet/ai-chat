import { Input } from "@/components/design-system/input"
import { Label } from "@/components/design-system/label"
import { ChatModel, useModels } from "@/hooks/use-models"
import { CaretDownIcon } from "@radix-ui/react-icons"
import { BotIcon, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import CustomModelForm from "./CustomModelForm"

import { useApiKeys } from "@/hooks/useApiKeys"
import ConfirmDeleteButton from "@/components/design-system/confirm-delete-button"
import { storage } from "@/lib/storage"
import useSWR from "swr"

const fetchApiKey = (modelId: string) =>
  (storage.getVal("API_KEYS") as any)[modelId]

const CustomModelDisplay = (props: ChatModel) => {
  const { name } = props
  const [showMore, setShowMore] = useState(false)
  const [shouldReveal, setShouldReveal] = useState(false)
  const { data: apiKey } = useSWR<string>("api-key", fetchApiKey)
  const customModels = useModels((s) => s.customModels)
  const setCustomModels = useModels((s) => s.setCustomModels)

  const deleteModel = () =>
    setCustomModels(customModels!.filter((m) => m.id !== props.id))

  console.log({
    apiKey
  })

  return (
    <div className="w-full rounded-lg relative border border-slate-700  overflow-hidden">
      <div className="flex items-center text-lg border-b border-b-slate-700 p-3">
        <div className="size-5 mr-2" role="img">
          <BotIcon className="size-5" />
        </div>
        {name}
      </div>
      <div className="flex flex-col max-sm:space-y-5">
        <div className="flex justify-start ml-5 pb-5 !mt-0">
          <button
            onClick={() => setShowMore((b) => !b)}
            className={`flex items-center gap-1 text-slate-400 mt-5`}
          >
            {"Edit Model Details"}{" "}
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
            <CustomModelForm initialData={props} />
          </div>
        )}
      </div>
      <div className="px-5 mb-5">
        <ConfirmDeleteButton onConfirm={deleteModel} />
      </div>
    </div>
  )
}

export default CustomModelDisplay
