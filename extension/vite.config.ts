import { defineConfig, Plugin } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

//@ts-ignore
import { crx } from "@crxjs/vite-plugin"
import manifest from "./manifest.json"

const viteManifestHackIssue846: Plugin & {
  renderCrxManifest: (manifest: any, bundle: any) => void //eslint-disable-line
} = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  name: "manifestHackIssue846",
  renderCrxManifest(_manifest, bundle) {
    bundle["manifest.json"] = bundle[".vite/manifest.json"]
    bundle["manifest.json"].fileName = "manifest.json"
    delete bundle[".vite/manifest.json"]
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteManifestHackIssue846,
    react(),
    crx({ manifest: manifest as any })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      input: {}
    }
  }
})
