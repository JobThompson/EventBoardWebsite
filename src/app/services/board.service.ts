import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Board } from '../models/board';
import { Message } from '../models/message';
import { Theme } from '../models/theme';
import { ApiService } from './api.service';
import { MessageGridUtils } from '../utils/message-grid.utils';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  public boards$ = this.boardsSubject.asObservable();
  
  private themesSubject = new BehaviorSubject<Theme[]>([]);
  public themes$ = this.themesSubject.asObservable();
  
  constructor(private apiService: ApiService) {
    this.loadBoards();
    this.loadThemes();
  }

  private loadBoards(): void {
    this.apiService.getBoards().subscribe({
      next: (boards) => {
        // Sort messages by position for each board
        const boardsWithSortedMessages = boards.map(board => ({
          ...board,
          messages: MessageGridUtils.sortMessagesByPosition(board.messages)
        }));
        this.boardsSubject.next(boardsWithSortedMessages);
      },
      error: (error) => {
        console.error('Error loading boards:', error);
        this.boardsSubject.next([]);
      }
    });
  }

  private loadThemes(): void {
    this.apiService.getThemes().subscribe({
      next: (themes) => this.themesSubject.next(themes),
      error: (error) => {
        console.error('Error loading themes:', error);
        // Fallback to default themes if API fails
        this.themesSubject.next(this.getDefaultThemes());
      }
    });
  }

  private getDefaultThemes(): Theme[] {
    return [
      {
        id: 'birthday',
        name: 'Birthday Party',
        backgroundColor: '#FFF5E6',
        primaryColor: '#FF6B9D',
        secondaryColor: '#C44569',
        textColor: '#333333',
        fontFamily: 'Comic Sans MS, cursive'
      },
      {
        id: 'farewell',
        name: 'Farewell',
        backgroundColor: '#E8F4F8',
        primaryColor: '#4A90E2',
        secondaryColor: '#2E5C8A',
        textColor: '#2C3E50',
        fontFamily: 'Georgia, serif'
      },
      {
        id: 'appreciation',
        name: 'Team Appreciation',
        backgroundColor: '#FFF8DC',
        primaryColor: '#F39C12',
        secondaryColor: '#E67E22',
        textColor: '#34495E',
        fontFamily: 'Verdana, sans-serif'
      },
      {
        id: 'celebration',
        name: 'Celebration',
        backgroundColor: '#F0E6FF',
        primaryColor: '#9B59B6',
        secondaryColor: '#8E44AD',
        textColor: '#2C3E50',
        fontFamily: 'Trebuchet MS, sans-serif'
      }
    ];
  }

  getAllBoards(): Board[] {
    return this.boardsSubject.value;
  }

  getBoard(id: string): Observable<Board> {
    // First try to get from cache
    const cachedBoard = this.boardsSubject.value.find(board => board.id === id);
    if (cachedBoard) {
      return of(cachedBoard);
    }
    
    // If not in cache, fetch from API
    return this.apiService.getBoard(id).pipe(
      tap(board => {
        // Update cache with the fetched board
        const boards = [...this.boardsSubject.value];
        const existingIndex = boards.findIndex(b => b.id === id);
        if (existingIndex >= 0) {
          boards[existingIndex] = board;
        } else {
          boards.push(board);
        }
        this.boardsSubject.next(boards);
      }),
      catchError(error => {
        console.error('Error fetching board:', error);
        return throwError(() => error);
      })
    );
  }

  createBoard(board: Omit<Board, 'id' | 'createdAt' | 'shareLink' | 'messages'>): Observable<Board> {
    return this.apiService.createBoard(board).pipe(
      tap(newBoard => {
        // Update local cache
        const boards = [...this.boardsSubject.value, newBoard];
        this.boardsSubject.next(boards);
      }),
      catchError(error => {
        console.error('Error creating board:', error);
        return throwError(() => error);
      })
    );
  }

  updateBoard(id: string, updates: Partial<Board>): Observable<Board> {
    return this.apiService.updateBoard(id, updates).pipe(
      tap(updatedBoard => {
        // Update local cache
        const boards = this.boardsSubject.value.map(board =>
          board.id === id ? updatedBoard : board
        );
        this.boardsSubject.next(boards);
      }),
      catchError(error => {
        console.error('Error updating board:', error);
        return throwError(() => error);
      })
    );
  }

  deleteBoard(id: string): Observable<void> {
    return this.apiService.deleteBoard(id).pipe(
      tap(() => {
        // Update local cache
        const boards = this.boardsSubject.value.filter(board => board.id !== id);
        this.boardsSubject.next(boards);
      }),
      catchError(error => {
        console.error('Error deleting board:', error);
        return throwError(() => error);
      })
    );
  }

  addMessage(boardId: string, message: Omit<Message, 'id' | 'createdAt' | 'boardId'>): Observable<Message> {
    // Find the board to get existing messages for position calculation
    const board = this.boardsSubject.value.find(b => b.id === boardId);
    const existingMessages = board?.messages || [];
    
    // Assign position if not provided
    const messageWithPosition = {
      ...message,
      position: message.position ?? MessageGridUtils.getNextPosition(existingMessages)
    };

    return this.apiService.createMessage(boardId, messageWithPosition).pipe(
      tap(newMessage => {
        // Update local cache
        const boards = this.boardsSubject.value.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              messages: MessageGridUtils.sortMessagesByPosition([...board.messages, newMessage])
            };
          }
          return board;
        });
        this.boardsSubject.next(boards);
      }),
      catchError(error => {
        console.error('Error adding message:', error);
        return throwError(() => error);
      })
    );
  }

  deleteMessage(boardId: string, messageId: string): Observable<void> {
    return this.apiService.deleteMessage(boardId, messageId).pipe(
      tap(() => {
        // Update local cache
        const boards = this.boardsSubject.value.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              messages: board.messages.filter(m => m.id !== messageId)
            };
          }
          return board;
        });
        this.boardsSubject.next(boards);
      }),
      catchError(error => {
        console.error('Error deleting message:', error);
        return throwError(() => error);
      })
    );
  }

  getThemes(): Theme[] {
    return this.themesSubject.value;
  }

  getTheme(id: string): Observable<Theme> {
    // First try to get from cache
    const cachedTheme = this.themesSubject.value.find(theme => theme.id === id);
    if (cachedTheme) {
      return of(cachedTheme);
    }
    
    // If not in cache, fetch from API
    return this.apiService.getTheme(id).pipe(
      tap(theme => {
        // Update cache with the fetched theme
        const themes = [...this.themesSubject.value];
        const existingIndex = themes.findIndex(t => t.id === id);
        if (existingIndex >= 0) {
          themes[existingIndex] = theme;
        } else {
          themes.push(theme);
        }
        this.themesSubject.next(themes);
      }),
      catchError(error => {
        console.error('Error fetching theme:', error);
        return throwError(() => error);
      })
    );
  }

  getBoardByShareLink(shareLink: string): Observable<Board> {
    // First try to get from cache
    const cachedBoard = this.boardsSubject.value.find(board => board.shareLink === shareLink);
    if (cachedBoard) {
      return of(cachedBoard);
    }
    
    // If not in cache, fetch from API
    return this.apiService.getBoardByShareLink(shareLink).pipe(
      tap(board => {
        // Update cache with the fetched board
        const boards = [...this.boardsSubject.value];
        const existingIndex = boards.findIndex(b => b.id === board.id);
        if (existingIndex >= 0) {
          boards[existingIndex] = board;
        } else {
          boards.push(board);
        }
        this.boardsSubject.next(boards);
      }),
      catchError(error => {
        console.error('Error fetching board by share link:', error);
        return throwError(() => error);
      })
    );
  }

  // Refresh methods to force reload from API
  refreshBoards(): Observable<Board[]> {
    return this.apiService.getBoards().pipe(
      tap(boards => this.boardsSubject.next(boards)),
      catchError(error => {
        console.error('Error refreshing boards:', error);
        return throwError(() => error);
      })
    );
  }

  refreshThemes(): Observable<Theme[]> {
    return this.apiService.getThemes().pipe(
      tap(themes => this.themesSubject.next(themes)),
      catchError(error => {
        console.error('Error refreshing themes:', error);
        return throwError(() => error);
      })
    );
  }
}
