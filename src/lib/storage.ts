const KEYS = {
  apiKey: "sm.apiKey",
  modelId: "sm.modelId",
  theme: "theme",
} as const;

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
};
