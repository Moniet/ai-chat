import Layout from "@/components/design-system/layout"
import DefaultProviders from "./DefaultProviders"
import Gutter from "@/components/design-system/gutter"
import ExtensionHeader from "@/components/shared/extension-header"
import { ScrollArea } from "@/components/design-system/scroll-area"
import CustomModelForm from "./CustomModelForm"
import { Separator } from "@/components/design-system/separator"
import { useModels } from "@/hooks/use-models"
import CustomModelDisplay from "./CustomModelDisplay"
import { Button } from "@/components/design-system/button"
import { useNavigate, useNavigation, useNavigationType } from "react-router-dom"

const CaptureApiKeys = () => {
  const customModels = useModels((s) => s.customModels)
  const nav = useNavigate()

  return (
    <Layout>
      <ExtensionHeader />
      <ScrollArea>
        <Gutter>
          <div className="h-8" />
          <h2 className="text-xl font-medium dark:text-slate-100 mb-8 sticky top-0 left-0 bg-slate-900/50 backdrop-blur-md z-10">
            Base Models
          </h2>
          <DefaultProviders />
          <Separator className="my-8" />
          <div className="my-8">
            <div className="mb-8">
              <h2 className="text-xl font-medium dark:text-slate-100 sticky top-0 left-0 bg-slate-900/50 backdrop-blur-md z-10">
                Custom Models
              </h2>
              <p className="max-w-prose w-[70%] mt-2 min-w-[200px]">
                Not sure where to start? Watch{" "}
                <a href="#" className="medium underline">
                  this tutorial
                </a>{" "}
                to learn everything you need to get started
              </p>
            </div>
            <div className="mt-5 space-y-5">
              {customModels?.map((m) => (
                <CustomModelDisplay {...m} />
              ))}
            </div>
            <Separator className="mt-5" />
            <div className="mt-5"></div>
            <CustomModelForm />
          </div>
        </Gutter>
      </ScrollArea>
      <div className="fixed bottom-0 left-0 w-full h-[70px] flex items-center  justify-end bg-slate-800/50 backdrop-blur-sm px-5 z-20">
        <Button onClick={() => nav("/model-selection")}>Next</Button>
      </div>
      <div className="h-[80px] mt-5"></div>
    </Layout>
  )
}

export default CaptureApiKeys
