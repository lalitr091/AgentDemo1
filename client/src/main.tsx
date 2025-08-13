import { createRoot } from "react-dom/client";
import { makeServer } from "./lib/mirage";
import App from "./App";
import "./index.css";

// Start MirageJS in development
if (import.meta.env.MODE === "development" || import.meta.env.MODE === "production") {
  makeServer();
}

createRoot(document.getElementById("root")!).render(<App />);
