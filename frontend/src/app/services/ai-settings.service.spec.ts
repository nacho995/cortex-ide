import { TestBed } from '@angular/core/testing';
import { AiProvider, AiSettingsService } from './ai-settings.service';

describe('AiSettingsService', () => {
  const storageKey = 'cortex-ai-settings';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    TestBed.configureTestingModule({});
  });

  it('starts with provider and model defaults', () => {
    const service = TestBed.inject(AiSettingsService);

    expect(service.provider()).toBe('gemini');
    expect(service.model()).toBe('gemini-2.5-pro');
  });

  it('updates model list when provider changes', () => {
    const service = TestBed.inject(AiSettingsService);
    service.setProvider('anthropic');

    expect(service.provider()).toBe('anthropic');
    expect(service.model()).toBe('claude-3.7-sonnet');
    expect(service.currentModels().length).toBeGreaterThan(0);
  });

  it('stores and retrieves provider keys', () => {
    const service = TestBed.inject(AiSettingsService);
    const provider: AiProvider = 'codex';
    service.setApiKey(provider, 'abc-123');

    expect(service.getApiKey(provider)).toBe('abc-123');
    expect(localStorage.getItem(storageKey)).toContain('"codex":"abc-123"');
  });
});
