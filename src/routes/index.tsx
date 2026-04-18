import { createFileRoute } from "@tanstack/react-router";
import App from "../App.jsx";

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [
      { title: "CipherStack — Cascade Encryption Builder" },
      { name: "description", content: "A node-based cascade encryption pipeline builder for security researchers." },
    ],
  }),
});
