import { create } from "zustand";

export type ChatMessage = {
  role: "assistant" | "user" | "system";
  content: string;
  date: string;
};

export type ChatHistoryMeta = {
  id: string;
  name: string;
  lastUpdated: number;
};

type Store = {
  messages: ChatMessage[];
  isGenerating: boolean;
  historyList: ChatHistoryMeta[];
  currentChatId: string | null;
  setMessage: (message: ChatMessage) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  updateLastMessage: (message: ChatMessage) => void;
  createNewChat: (name?: string, forceNew?: boolean) => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
  fetchHistoryList: () => Promise<void>;
  deleteHistory: (chatId: string) => Promise<void>;
  setChatName: (newName: string) => Promise<void>;
};

const DB_NAME = "ai-chat-db";
const STORE_NAME = "chats";
const META_STORE = "chats-meta";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = function () {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME))
        db.createObjectStore(STORE_NAME);
      if (!db.objectStoreNames.contains(META_STORE))
        db.createObjectStore(META_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveChat(
  id: string,
  messages: ChatMessage[],
  meta: ChatHistoryMeta,
) {
  const db = await getDB();
  await Promise.all([
    new Promise<void>((res, rej) => {
      const tx = db.transaction([STORE_NAME], "readwrite");
      tx.objectStore(STORE_NAME).put(messages, id);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    }),
    new Promise<void>((res, rej) => {
      const tx = db.transaction([META_STORE], "readwrite");
      tx.objectStore(META_STORE).put(meta, id);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    }),
  ]);
}

async function loadChat(id: string): Promise<ChatMessage[]> {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction([STORE_NAME]);
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => res(req.result || []);
    req.onerror = () => rej(req.error);
  });
}

async function loadHistoryList(): Promise<ChatHistoryMeta[]> {
  const db = await getDB();
  return new Promise((res, rej) => {
    const tx = db.transaction([META_STORE]);
    const store = tx.objectStore(META_STORE);
    const req = store.getAll();
    req.onsuccess = () => res(req.result || []);
    req.onerror = () => rej(req.error);
  });
}

async function removeChat(id: string) {
  const db = await getDB();
  await Promise.all([
    new Promise<void>((res) => {
      const tx = db.transaction([STORE_NAME], "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => res();
    }),
    new Promise<void>((res) => {
      const tx = db.transaction([META_STORE], "readwrite");
      tx.objectStore(META_STORE).delete(id);
      tx.oncomplete = () => res();
    }),
  ]);
}

function getTodayDateString() {
  const now = new Date();
  // Make it UTC to avoid timezone issues
  return now.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

import { aiChat } from "@/lib/aiChat";
import { useModels } from "@/hooks/use-models";

async function generateChatNameLLM(initialMessage: string): Promise<string> {
  try {
    // For non-hook usage outside React, get the Zustand state directly:
    const model = useModels.getState().currentModel;
    if (!model) {
      throw new Error("No model selected");
    }
    const prompt = [
      {
        role: "system",
        content:
          "You generate concise, relevant chat session titles. Respond ONLY with a title, no explanations.",
      },
      { role: "user", content: initialMessage },
    ];

    const controller = new AbortController();
    const signal = controller.signal;
    const stream = await aiChat(
      model,
      {
        messages: prompt,
        max_tokens: 16,
        temperature: 0.5,
      },
      signal,
    );

    let title = "";
    for await (const chunk of stream) {
      title += chunk;
    }
    return (
      title.trim() || "Chat: " + initialMessage.split(" ").slice(0, 6).join(" ")
    );
  } catch (err) {
    return (
      "Chat: " +
      initialMessage
        .split(" ")
        .slice(0, 6)
        .join(" ")
        .replace(/[^\w\s]/gi, "")
        .slice(0, 30)
    );
  }
}

export const useMessages = create<Store>()((set, get) => ({
  messages: [],
  isGenerating: false,
  historyList: [],
  currentChatId: null,

  setMessage: (message: ChatMessage) => {
    let triggerLLM = false;
    let initialMessage = "";

    set((state) => {
      const newMessages = [...state.messages, message];
      if (state.currentChatId) {
        saveChat(state.currentChatId, newMessages, {
          id: state.currentChatId,
          name:
            state.historyList.find((h) => h.id === state.currentChatId)?.name ||
            "Chat",
          lastUpdated: Date.now(),
        });

        // If this is the first user message, trigger chat name generation by LLM
        if (newMessages.length === 1 && message.role === "user") {
          triggerLLM = true;
          initialMessage = message.content;
        }
      }
      return { messages: newMessages };
    });

    if (triggerLLM && initialMessage) {
      generateChatNameLLM(initialMessage).then((llmName) => {
        get().setChatName(llmName);
      });
    }
  },

  updateLastMessage: (message: ChatMessage) => {
    set((state) => {
      if (state.messages.length === 0) return {};
      const newMessages = state.messages
        .slice(0, state.messages.length - 1)
        .concat(Object.assign({}, state.messages.at(-1)!, message));
      if (state.currentChatId) {
        saveChat(state.currentChatId, newMessages, {
          id: state.currentChatId,
          name:
            state.historyList.find((h) => h.id === state.currentChatId)?.name ||
            "Chat",
          lastUpdated: Date.now(),
        });
      }
      return { messages: newMessages };
    });
  },

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  // Only one chat auto-created per day
  createNewChat: async (name = "Chat", forceNew = false) => {
    await get().fetchHistoryList();
    const today = getTodayDateString();
    const state = get();

    // If not forced and one exists for today, just load it
    if (!forceNew) {
      const todayChat = state.historyList.find((h) => {
        // Assume id or name encodes date, else store a custom field in meta
        // Try: name includes today OR existing meta id generated today
        return (
          h.id.startsWith("chat-") &&
          new Date(Number(h.id.replace("chat-", "")))
            .toISOString()
            .slice(0, 10) === today
        );
      });
      if (todayChat) {
        await get().loadChat(todayChat.id);
        return;
      }
    }

    // Otherwise, create a new one
    const id = "chat-" + Date.now();
    const meta = { id, name, lastUpdated: Date.now() };
    await saveChat(id, [], meta);
    await get().fetchHistoryList();
    set({ messages: [], currentChatId: id });
  },

  loadChat: async (chatId: string) => {
    const msgs = await loadChat(chatId);
    set({ messages: msgs, currentChatId: chatId });
  },

  fetchHistoryList: async () => {
    const hist = await loadHistoryList();
    // Sort by lastUpdated descending
    const sortedHist = hist.sort((a, b) => b.lastUpdated - a.lastUpdated);
    set({ historyList: sortedHist });
  },

  deleteHistory: async (chatId) => {
    await removeChat(chatId);
    await get().fetchHistoryList();
    set((state) =>
      state.currentChatId === chatId
        ? { messages: [], currentChatId: null }
        : {},
    );
  },

  // Update chat name in meta and persistent storage
  setChatName: async (newName: string) => {
    const { currentChatId, historyList, messages } = get();
    if (currentChatId) {
      const meta = historyList.find((h) => h.id === currentChatId);
      if (meta) {
        // Ensure name is always a string
        const safeName =
          typeof newName === "string" ? newName : String(newName);
        const updatedMeta = {
          ...meta,
          name: safeName,
          lastUpdated: Date.now(),
        };
        await saveChat(currentChatId, messages, updatedMeta);
        await get().fetchHistoryList();
        // Triggers a re-render via set
        set({ historyList: [...get().historyList] });
      }
    }
  },
}));
