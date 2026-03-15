import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  extension?: string;
}

export interface FileContent {
  content: string;
  language: string;
  path: string;
}

@Injectable({ providedIn: 'root' })
export class FileService {
  private api = 'http://localhost:8081/api/files';

  constructor(private http: HttpClient) {}

  getTree(path: string): Observable<FileNode> {
    return this.http.get<FileNode>(`${this.api}/tree`, { params: { path } });
  }

  readFile(path: string): Observable<FileContent> {
    return this.http.get<FileContent>(`${this.api}/read`, { params: { path } });
  }

  writeFile(path: string, content: string): Observable<any> {
    return this.http.post(`${this.api}/write`, { path, content });
  }

  createFile(path: string, type: string = 'file'): Observable<any> {
    return this.http.post(`${this.api}/create`, { path, type });
  }

  deleteFile(path: string): Observable<any> {
    return this.http.delete(`${this.api}/delete`, { params: { path } });
  }

  renameFile(oldPath: string, newPath: string): Observable<any> {
    return this.http.post(`${this.api}/rename`, { oldPath, newPath });
  }
}
