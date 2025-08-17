import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ProvidersWrapper } from "@/providers";
import { App } from "./App.tsx";

import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ProvidersWrapper>
			<App />
		</ProvidersWrapper>
	</StrictMode>,
);
