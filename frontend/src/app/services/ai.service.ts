import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private api = 'http://localhost:8081/api/ai';

  constructor(private http: HttpClient) {}

  chat(message: string, projectPath?: string): Observable<any> {
    return this.http.post(`${this.api}/chat`, { message, projectPath });
  }

  edit(instruction: string, projectPath: string): Observable<any> {
    return this.http.post(`${this.api}/edit`, { instruction, projectPath });
  }

  debate(topic: string): Observable<any> {
    return this.http.post(`${this.api}/debate`, { topic });
  }

  review(filePath: string, content: string): Observable<any> {
    return this.http.post(`${this.api}/review`, { filePath, content });
  }
}
