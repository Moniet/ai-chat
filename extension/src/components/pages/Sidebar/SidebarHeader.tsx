import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/design-system/select"
import { useSidebar } from "./use-sidebar"
import { CogIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

const SidebarHeader = () => {
  const models = useSidebar((s) => s.modelList)
  const currentModel = useSidebar((s) => s.currentModel)
  // const setModel = useSidebar(s => s.se)
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex h-[70px] sticky top-0 left-0 items-center w-full p-5 justify-between dark:border-b dark:border-b-slate-800">
      <Select value={currentModel.value} onValueChange={(e) => {}}>
        <SelectTrigger className="w-fit min-w-[120px] ">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="w-fit dark:bg-slate-800">
          {models.map((model) => (
            <SelectItem value={model.value} key={model.id}>
              <span className="!text-xs">{model.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-1">
        <button
          aria-label="Settings"
          className="p-2 flex rounded-md hover:bg-slate-800 transition-colors duration-200"
        >
          <CogIcon className="size-5 text-slate-300 m-auto" />
        </button>
        <button
          aria-label="Toggle Theme"
          className="p-2 flex rounded-md hover:bg-slate-800 transition-colors duration-200"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <SunIcon className="size-5 text-slate-300 m-auto" />
          ) : (
            <MoonIcon className="size-5 text-slate-300 m-auto" />
          )}
        </button>
      </div>
    </div>
  )
}

export default SidebarHeader
