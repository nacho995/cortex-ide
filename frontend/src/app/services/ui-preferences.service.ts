import { Injectable, signal } from '@angular/core';

export type BackgroundMode = 'default' | 'midnight' | 'aurora';

interface UiPreferencesState {
  background: BackgroundMode;
  matrixRainEnabled: boolean;
}

const STORAGE_KEY = 'cortex-ui-preferences';
const DEFAULT_STATE: UiPreferencesState = {
  background: 'default',
  matrixRainEnabled: false,
};

@Injectable({ providedIn: 'root' })
export class UiPreferencesService {
  private readonly state = signal<UiPreferencesState>(this.load());

  background = signal<BackgroundMode>(this.state().background);
  matrixRainEnabled = signal<boolean>(this.state().matrixRainEnabled);

  setBackground(background: BackgroundMode) {
    this.background.set(background);
    this.sync();
  }

  setMatrixRainEnabled(enabled: boolean) {
    this.matrixRainEnabled.set(enabled);
    this.sync();
  }

  private sync() {
    const nextState: UiPreferencesState = {
      background: this.background(),
      matrixRainEnabled: this.matrixRainEnabled(),
    };
    this.state.set(nextState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  private load(): UiPreferencesState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    try {
      const parsed = JSON.parse(raw) as Partial<UiPreferencesState>;
      return {
        background: this.isBackgroundMode(parsed.background) ? parsed.background : 'default',
        matrixRainEnabled: Boolean(parsed.matrixRainEnabled),
      };
    } catch {
      return DEFAULT_STATE;
    }
  }

  private isBackgroundMode(value: unknown): value is BackgroundMode {
    return value === 'default' || value === 'midnight' || value === 'aurora';
  }
}
