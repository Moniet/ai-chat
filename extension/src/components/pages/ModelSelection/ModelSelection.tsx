import Gutter from "@/components/design-system/gutter"
import Layout from "@/components/design-system/layout"
import { useModels } from "@/hooks/use-models"
import { Reorder } from "framer-motion"
import { PropsWithChildren, useMemo } from "react"
import ModelDisplaytem from "./ModelDisplayItem"
import { baseModels } from "@/lib/baseModels"
import ExtensionHeader from "@/components/shared/extension-header"
import { ScrollArea } from "@/components/design-system/scroll-area"
import { StarsIcon } from "lucide-react"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/design-system/button"

const Grid = ({ children }: PropsWithChildren) => {
  return <div className="grid grid-cols-1 sm:grid-cols-2">{children}</div>
}

const ModelSelection = () => {
  const selectedModels = useModels((s) => s.selectedModels)
  const customModels = useModels((s) => s.customModels)
  const setSelectedModels = useModels((s) => s.setSelectedModelList)
  const values = selectedModels.map((m) => m.id)
  const groupedById = useMemo(
    () => Object.fromEntries(selectedModels.map((m) => [m.id, m])),
    [selectedModels]
  )
  const nav = useNavigate()

  return (
    <Layout>
      <ExtensionHeader />
      <ScrollArea>
        <Gutter>
          <h2 className="text-xl font-medium mb-8 mt-12">Selected Models</h2>

          <div className="p-3 w-full bg-zinc-600 mb-2 rounded-md grid grid-cols-[3fr_0.5fr_0.5fr] gap-3 font-medium">
            <p>Model Name</p>
            <p>Default</p>
            <p>Selected</p>
          </div>

          <Reorder.Group
            values={values}
            onReorder={(newOrder) =>
              setSelectedModels(newOrder.map((m) => groupedById[m]))
            }
          >
            <div className="flex flex-col gap-2">
              {selectedModels.map((m) => (
                <Reorder.Item key={m.id} value={m.id} className="rounded-md">
                  <ModelDisplaytem {...m} />
                </Reorder.Item>
              ))}
            </div>
          </Reorder.Group>

          <h2 className="text-xl font-medium mb-8 mt-12">Default models</h2>
          <div className="flex flex-col gap-2">
            {baseModels["OPENAI"].map((m) => (
              <ModelDisplaytem {...m} key={m.id} />
            ))}
            {baseModels["ANTHROPIC"].map((m) => (
              <ModelDisplaytem {...m} key={m.id} />
            ))}
            {baseModels["GEMINI"].map((m) => (
              <ModelDisplaytem {...m} key={m.id} />
            ))}
          </div>

          <h2 className="text-xl font-medium mb-8 mt-12">Custom models</h2>
          <div className="flex flex-col gap-2">
            {customModels?.map((m) => (
              <ModelDisplaytem {...m} key={m.id} />
            ))}
            {!customModels?.length && (
              <div className="w-full rounded-md p-5 bg-slate-800/50 text-center">
                <p className="font-light text-base w-fit flex items-center tracking-wide">
                  A whole lotta nothing{" "}
                  <StarsIcon className="size-4 ml-2" strokeWidth={1.5} />
                </p>
              </div>
            )}
          </div>
        </Gutter>
        <div className="fixed bottom-0 left-0 w-full h-[70px] flex items-center  justify-end bg-slate-800/50 backdrop-blur-sm px-5 z-20">
          <Button onClick={() => nav("/chat")}>Finish Setup</Button>
        </div>
        <div className="h-[80px] mt-5"></div>
      </ScrollArea>
    </Layout>
  )
}

export default ModelSelection
