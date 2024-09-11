import { Skeleton } from "@/components/design-system/skeleton"
import { Toaster } from "@/components/design-system/toaster"
import { storage } from "@/lib/storage"
import { API_KEYS } from "@/types/api-keys"
import { useEffect, useState } from "react"
import CaptureKeys from "./CaptureKeys"
import * as ReactDOM from "react-dom"

import "@/index.css"
import { createRoot } from "react-dom/client"

const Popup = () => {
  const [hasKey, setHasKeys] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const apiKeys = await storage.getVal<API_KEYS>("API_KEYS")
      const hasSomeKeys = Object.values(apiKeys ?? {}).some(Boolean)
      setHasKeys(hasSomeKeys)
      setIsLoading(false)
    })()
  }, [])

  return (
    <>
      <div className="flex flex-col gap-2 w-[300px] p-5 dark:bg-slate-900 bg-slate-50">
        {isLoading && (
          <div className="space-y-5">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        )}

        {!hasKey && <CaptureKeys />}
      </div>

      <Toaster />
    </>
  )
}

export default Popup
