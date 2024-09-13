import { storage } from "@/lib/storage"
import useSWR from "swr"
import { API_KEYS } from "../types/api-keys"

const getApiKeys = () => storage.getVal<API_KEYS>("API_KEYS")

type UseApiKeyProps = {
  apiStorageKey?: string
}

export const saveApiKey = async (key: string, value: string) => {
  const apiKeys = (await storage.getVal("API_KEYS")) ?? []
  storage.setVal("API_KEYS", {
    ...apiKeys,
    [key]: value
  })
}

export const useApiKeys = ({ apiStorageKey }: UseApiKeyProps) => {
  const { data: apiKeys, isLoading } = useSWR(getApiKeys)

  return {
    apiKeys:
      apiKeys && apiStorageKey ? (apiKeys[apiStorageKey] as string) : apiKeys,
    isLoading
  }
}
