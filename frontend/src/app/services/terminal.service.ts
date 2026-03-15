import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TerminalService {
  private api = 'http://localhost:8081/api/terminal';

  constructor(private http: HttpClient) {}

  execute(command: string, cwd?: string): Observable<{ output: string }> {
    return this.http.post<{ output: string }>(`${this.api}/execute`, { command, cwd });
  }

  kill(): Observable<any> {
    return this.http.post(`${this.api}/kill`, {});
  }
}
