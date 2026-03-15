import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GitService {
  private api = 'http://localhost:8081/api/git';

  constructor(private http: HttpClient) {}

  getStatus(path: string): Observable<any> {
    return this.http.get(`${this.api}/status`, { params: { path } });
  }

  getDiff(path: string): Observable<{ diff: string }> {
    return this.http.get<{ diff: string }>(`${this.api}/diff`, { params: { path } });
  }

  commit(path: string, message: string): Observable<any> {
    return this.http.post(`${this.api}/commit`, { path, message });
  }

  undo(path: string): Observable<any> {
    return this.http.post(`${this.api}/undo`, { path });
  }
}
