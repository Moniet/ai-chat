import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/design-system/select";
import {
  CogIcon,
  MoonIcon,
  SlidersHorizontal,
  SunIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useModels } from "@/hooks/use-models";
import { baseModels } from "@/lib/baseModels";
import { useEffect } from "react";
import ModelSettingsPopover from "./Chat/ModelSettingsPopover";
import { useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/use-messages";

const SidebarHeader = () => {
  const models = useModels((s) => s.selectedModels);
  const currentModel = useModels((s) => s.currentModel);
  const defaultModel = useModels((s) => s.defaultModel);
  const setCurrentModel = useModels((s) => s.setCurrentModel);
  const { theme, setTheme } = useTheme();
  const nav = useNavigate();

  // Chat history (from useMessages)
  const {
    historyList,
    fetchHistoryList,
    currentChatId,
    createNewChat,
    loadChat,
    deleteHistory,
  } = useMessages();

  // Initialize: set up chat history dropdown
  useEffect(() => {
    setCurrentModel(defaultModel ?? baseModels.OPENAI[0]);
    fetchHistoryList();
    // eslint-disable-next-line
  }, []);

  // If there is no chat at all, create one on initial load
  useEffect(() => {
    if (!currentChatId && historyList.length === 0) {
      createNewChat(`Chat ${new Date().toLocaleTimeString()}`);
    }
    // eslint-disable-next-line
  }, [historyList, currentChatId]);

  return (
    <div className="flex h-[50px] sticky top-0 left-0 items-center w-full p-5 justify-between dark:border-b dark:border-b-slate-800">
      <div className="flex items-center gap-3">
        {/* CHAT HISTORY SELECT */}
        <Select
          value={currentChatId || ""}
          onValueChange={(val) => loadChat(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chat" />
          </SelectTrigger>
          <SelectContent>
            {historyList.map((h) => (
              <SelectItem value={h.id} key={h.id}>
                <div className="flex items-center gap-1">
                  <span className="!text-xs">
                    {h.name || new Date(h.lastUpdated).toLocaleTimeString()}
                  </span>
                  <button
                    className="ml-2 p-2 hover:bg-white/10"
                    title="Delete chat"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistory(h.id);
                    }}
                  >
                    <Trash2 className="size-3 text-red-400 pointer-events-none" />
                  </button>
                </div>
              </SelectItem>
            ))}
            <div className="flex px-2 py-1">
              <button
                className="flex items-center text-xs mt-1 text-blue-500"
                onClick={async (e) => {
                  e.stopPropagation();
                  await createNewChat(
                    `Chat ${new Date().toLocaleTimeString()}`,
                  );
                  await fetchHistoryList();
                }}
              >
                <Plus className="size-3 mr-1" />
                New chat
              </button>
            </div>
          </SelectContent>
        </Select>

        {/* MODEL SELECT */}
        <Select
          value={currentModel.id ?? baseModels.OPENAI[0].id}
          onValueChange={(val) => {
            setCurrentModel(models.find((m) => m.id === val)!);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent className="w-fit dark:bg-slate-800">
            {models.map((model) => (
              <SelectItem value={model.id} key={model.id}>
                <span className="!text-xs">{model.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          <ModelSettingsPopover />
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
