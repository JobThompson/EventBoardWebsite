import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Board } from '../models/board';
import { Message } from '../models/message';
import { Theme } from '../models/theme';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Board endpoints
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.baseUrl}/boards`)
      .pipe(catchError(this.handleError));
  }

  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.baseUrl}/boards/${id}`)
      .pipe(catchError(this.handleError));
  }

  getBoardByShareLink(shareLink: string): Observable<Board> {
    return this.http.get<Board>(`${this.baseUrl}/boards/share/${shareLink}`)
      .pipe(catchError(this.handleError));
  }

  createBoard(board: Omit<Board, 'id' | 'createdAt' | 'shareLink' | 'messages'>): Observable<Board> {
    return this.http.post<Board>(`${this.baseUrl}/boards`, board, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateBoard(id: string, updates: Partial<Board>): Observable<Board> {
    return this.http.put<Board>(`${this.baseUrl}/boards/${id}`, updates, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteBoard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/boards/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Message endpoints
  getMessages(boardId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/boards/${boardId}/messages`)
      .pipe(catchError(this.handleError));
  }

  createMessage(boardId: string, message: Omit<Message, 'id' | 'createdAt' | 'boardId'>): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/boards/${boardId}/messages`, message, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteMessage(boardId: string, messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/boards/${boardId}/messages/${messageId}`)
      .pipe(catchError(this.handleError));
  }

  // Theme endpoints
  getThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(`${this.baseUrl}/themes`)
      .pipe(catchError(this.handleError));
  }

  getTheme(id: string): Observable<Theme> {
    return this.http.get<Theme>(`${this.baseUrl}/themes/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}