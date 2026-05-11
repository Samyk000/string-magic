const KEYS = {
  apiKey: "sm.apiKey",
  modelId: "sm.modelId",
  theme: "theme",
  history: "sm.history",
} as const;

export type HistoryItem = {
  id: string;
  jd: string;
  result: any; // GenerateResult
  createdAt: number;
};

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export const storage = {
  getApiKey(): string {
    return safe(() => localStorage.getItem(KEYS.apiKey) ?? "", "");
  },
  setApiKey(v: string) {
    safe(() => localStorage.setItem(KEYS.apiKey, v), undefined);
  },
  clearApiKey() {
    safe(() => localStorage.removeItem(KEYS.apiKey), undefined);
  },
  getModelId(): string {
    return safe(() => localStorage.getItem(KEYS.modelId) ?? "", "");
  },
  setModelId(v: string) {
    safe(() => localStorage.setItem(KEYS.modelId, v), undefined);
  },
  getHistory(): HistoryItem[] {
    return safe(() => {
      const raw = localStorage.getItem(KEYS.history);
      if (!raw) return [];
      return JSON.parse(raw);
    }, []);
  },
  saveHistory(item: HistoryItem) {
    safe(() => {
      const hist = storage.getHistory();
      const updated = [item, ...hist].slice(0, 50); // Keep last 50
      localStorage.setItem(KEYS.history, JSON.stringify(updated));
    }, undefined);
  },
  deleteHistory(id: string) {
    safe(() => {
      const hist = storage.getHistory();
      const updated = hist.filter((h) => h.id !== id);
      localStorage.setItem(KEYS.history, JSON.stringify(updated));
    }, undefined);
  },
  clearHistory() {
    safe(() => localStorage.removeItem(KEYS.history), undefined);
  }
};
