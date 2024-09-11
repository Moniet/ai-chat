export type StorageKeys = "API_KEYS" | "LAST_SELECTED_MODEL" | "typed-message"

type StorageType = "local" | "sync"

const getVal = async <T = unknown>(
  key: StorageKeys,
  storageType?: StorageType
) => {
  return await chrome.storage[storageType ?? "local"]
    ?.get(key)
    .then((val) => val[key] as T)
    .catch((e) => {
      console.error(e)
      return null
    })
}

const setVal = async (
  key: StorageKeys,
  val: unknown,
  storageType?: StorageType
) => {
  return await chrome.storage[storageType ?? "local"]
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
  changes: { [key: string]: chrome.storage.StorageChange }, // eslint-disable-line
  areaName: "sync" | "local" | "managed" | "session" // eslint-disable-line
) => void

const subscribe = (fn: SubCallback) => chrome.storage.onChanged.addListener(fn)

export const storage = {
  getVal,
  setVal,
  removeVal,
  subscribe
}
