import { CogIcon, SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";

const ExtensionHeader = () => {
  const { theme, setTheme } = useTheme();
  const nav = useNavigate();

  return (
    <header>
      <nav className="flex w-full py-3 px-5 justify-between h-[60px] border-b dark:border-slate-800 items-center">
        <div className="size-[40px] flex text-slate-400 p-1">
          <img src="/aiiko-logo.png" className="w-full h-full m-auto" />
        </div>
        <div className="flex gap-1 items-center">
          <button
            aria-label="Settings"
            className="p-2 flex rounded-md hover:bg-slate-800 transition-colors duration-200"
            onClick={() => nav("/capture-keys")}
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
      </nav>
    </header>
  );
};

export default ExtensionHeader;
