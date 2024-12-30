import ReactDOM from "react-dom/client";
import { App } from "./app/App.tsx";
import { synchronizeDefaultSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { loadThemes } from "@/app/utils.ts";
import { initializeRepertoireStore } from "@/app/zustand/initialize.ts";

synchronizeDefaultSettings();
loadThemes();
initializeRepertoireStore();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
