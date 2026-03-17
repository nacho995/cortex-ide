import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiSettingsService } from './ai-settings.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private api = 'http://localhost:8081/api/ai';

  constructor(
    private http: HttpClient,
    private settings: AiSettingsService
  ) {}

  chat(message: string, projectPath?: string): Observable<any> {
    return this.http.post(`${this.api}/chat`, this.withAiConfig({ message, projectPath }));
  }

  edit(instruction: string, projectPath: string): Observable<any> {
    return this.http.post(`${this.api}/edit`, this.withAiConfig({ instruction, projectPath }));
  }

  debate(topic: string): Observable<any> {
    return this.http.post(`${this.api}/debate`, this.withAiConfig({ topic }));
  }

  review(filePath: string, content: string): Observable<any> {
    return this.http.post(`${this.api}/review`, this.withAiConfig({ filePath, content }));
  }

  private withAiConfig(body: Record<string, unknown>) {
    const provider = this.settings.provider();
    const model = this.settings.model();
    const apiKey = this.settings.getApiKey(provider);
    return {
      ...body,
      provider,
      model,
      apiKey,
    };
  }
}
