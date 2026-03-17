import { TestBed } from '@angular/core/testing';
import { UiPreferencesService } from './ui-preferences.service';

describe('UiPreferencesService', () => {
  const storageKey = 'cortex-ui-preferences';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({});
  });

  it('loads defaults when no saved preferences', () => {
    const service = TestBed.inject(UiPreferencesService);

    expect(service.background()).toBe('default');
    expect(service.matrixRainEnabled()).toBe(false);
  });

  it('persists background and matrix rain', () => {
    const service = TestBed.inject(UiPreferencesService);
    service.setBackground('aurora');
    service.setMatrixRainEnabled(true);

    const raw = localStorage.getItem(storageKey);
    expect(raw).toContain('"background":"aurora"');
    expect(raw).toContain('"matrixRainEnabled":true');
  });

  it('hydrates state from localStorage', () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ background: 'midnight', matrixRainEnabled: true })
    );

    const service = TestBed.inject(UiPreferencesService);
    expect(service.background()).toBe('midnight');
    expect(service.matrixRainEnabled()).toBe(true);
  });
});
