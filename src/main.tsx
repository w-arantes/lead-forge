import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { ProvidersWrapper } from "@/providers";

import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ProvidersWrapper>
			<App />
		</ProvidersWrapper>
	</StrictMode>,
);
