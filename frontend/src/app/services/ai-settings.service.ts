import { Injectable, computed, signal } from '@angular/core';

export type AiProvider = 'gemini' | 'codex' | 'anthropic';

interface AiSettingsState {
  provider: AiProvider;
  model: string;
  apiKeys: Record<AiProvider, string>;
}

const STORAGE_KEY = 'cortex-ai-settings';

const PROVIDER_MODELS: Record<AiProvider, string[]> = {
  gemini: ['gemini-2.5-pro', 'gemini-2.0-flash'],
  codex: ['gpt-5-codex', 'gpt-5-mini'],
  anthropic: ['claude-3.7-sonnet', 'claude-3.5-haiku'],
};

const DEFAULT_STATE: AiSettingsState = {
  provider: 'gemini',
  model: PROVIDER_MODELS.gemini[0],
  apiKeys: {
    gemini: '',
    codex: '',
    anthropic: '',
  },
};

@Injectable({ providedIn: 'root' })
export class AiSettingsService {
  private readonly state = signal<AiSettingsState>(this.load());

  provider = computed(() => this.state().provider);
  model = computed(() => this.state().model);
  currentModels = computed(() => PROVIDER_MODELS[this.provider()]);

  setProvider(provider: AiProvider) {
    this.state.update((s) => ({
      ...s,
      provider,
      model: PROVIDER_MODELS[provider][0],
    }));
    this.persist();
  }

  setModel(model: string) {
    if (!this.currentModels().includes(model)) return;
    this.state.update((s) => ({ ...s, model }));
    this.persist();
  }

  setApiKey(provider: AiProvider, apiKey: string) {
    this.state.update((s) => ({
      ...s,
      apiKeys: {
        ...s.apiKeys,
        [provider]: apiKey.trim(),
      },
    }));
    this.persist();
  }

  getApiKey(provider: AiProvider) {
    return this.state().apiKeys[provider];
  }

  getAllApiKeys() {
    return this.state().apiKeys;
  }

  private load(): AiSettingsState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    try {
      const parsed = JSON.parse(raw) as Partial<AiSettingsState>;
      const provider = this.isProvider(parsed.provider) ? parsed.provider : DEFAULT_STATE.provider;
      const model = this.isValidModel(provider, parsed.model) ? parsed.model : PROVIDER_MODELS[provider][0];
      const apiKeys = {
        ...DEFAULT_STATE.apiKeys,
        ...(parsed.apiKeys ?? {}),
      };

      return { provider, model, apiKeys };
    } catch {
      return DEFAULT_STATE;
    }
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
  }

  private isProvider(value: unknown): value is AiProvider {
    return value === 'gemini' || value === 'codex' || value === 'anthropic';
  }

  private isValidModel(provider: AiProvider, model: unknown): model is string {
    return typeof model === 'string' && PROVIDER_MODELS[provider].includes(model);
  }
}
