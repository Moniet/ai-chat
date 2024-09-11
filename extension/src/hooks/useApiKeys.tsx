import { storage } from "@/lib/storage"
import useSWR from "swr"
import { API_KEYS } from "../types/api-keys"

const getApiKeys = () => storage.getVal<API_KEYS>("API_KEYS")

export const useApiKeys = () => {
  const { data: apiKeys, isLoading } = useSWR(getApiKeys)

  return {
    apiKeys,
    isLoading
  }
}
