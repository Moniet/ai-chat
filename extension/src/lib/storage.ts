import { StateStorage } from "zustand/middleware"

export type StorageKeys = "API_KEYS" | "LAST_SELECTED_MODEL" | "typed-message"

type StorageType = "local" | "sync"

export const storageWrapper: StateStorage = {
  //for zustand persis()
  getItem: async function (name: string) {
    return await storage.getVal<string>(name as any)
  },
  setItem: async function (name: string, value: string) {
    return storage.setVal(name as any, value)
  },
  removeItem: async function (name: string) {
    return await storage.removeVal(name as any)
  }
}

async function getVal<T = unknown>(
  key: StorageKeys,
  storageType: StorageType = "local"
) {
  try {
    const data = await globalThis.chrome.storage[storageType ?? "local"].get(
      key
    )
    return data?.[key] as T
  } catch (e) {
    console.error(e)
    return null
  }
}

async function setVal(
  key: StorageKeys,
  val: unknown,
  storageType?: StorageType
) {
  return await globalThis.chrome.storage[storageType ?? "local"]
    .set({
      [key]: val
    })
    .catch((e) => {
      console.error(e)
      return null
    })
}

const removeVal = async (key: StorageKeys) => {
  return await chrome.storage.local.remove(key).catch((e) => {
    console.error(e)
    return null
  })
}

type SubCallback = (
  changes: { [key: string]: chrome.storage.StorageChange },  
  areaName: "sync" | "local" | "managed" | "session"  
) => void

const subscribe = (fn: SubCallback) => chrome.storage.onChanged.addListener(fn)

export const storage = {
  getVal,
  setVal,
  removeVal,
  subscribe
}
