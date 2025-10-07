import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../models/board';
import { Message } from '../models/message';
import { Theme } from '../models/theme';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly BOARDS_KEY = 'eventboards';
  private readonly THEMES_KEY = 'themes';
  
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  public boards$ = this.boardsSubject.asObservable();
  
  private defaultThemes: Theme[] = [
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

  constructor(private storageService: StorageService) {
    this.initializeThemes();
    this.loadBoards();
  }

  private initializeThemes(): void {
    const storedThemes = this.storageService.getItem<Theme[]>(this.THEMES_KEY);
    if (!storedThemes) {
      this.storageService.setItem(this.THEMES_KEY, this.defaultThemes);
    }
  }

  private loadBoards(): void {
    const boards = this.storageService.getItem<Board[]>(this.BOARDS_KEY) || [];
    this.boardsSubject.next(boards);
  }

  private saveBoards(boards: Board[]): void {
    this.storageService.setItem(this.BOARDS_KEY, boards);
    this.boardsSubject.next(boards);
  }

  getAllBoards(): Board[] {
    return this.boardsSubject.value;
  }

  getBoard(id: string): Board | undefined {
    return this.boardsSubject.value.find(board => board.id === id);
  }

  createBoard(board: Omit<Board, 'id' | 'createdAt' | 'shareLink' | 'messages'>): Board {
    const newBoard: Board = {
      ...board,
      id: this.generateId(),
      createdAt: new Date(),
      shareLink: this.generateShareLink(),
      messages: []
    };
    
    const boards = [...this.boardsSubject.value, newBoard];
    this.saveBoards(boards);
    return newBoard;
  }

  updateBoard(id: string, updates: Partial<Board>): void {
    const boards = this.boardsSubject.value.map(board =>
      board.id === id ? { ...board, ...updates } : board
    );
    this.saveBoards(boards);
  }

  deleteBoard(id: string): void {
    const boards = this.boardsSubject.value.filter(board => board.id !== id);
    this.saveBoards(boards);
  }

  addMessage(boardId: string, message: Omit<Message, 'id' | 'createdAt' | 'boardId'>): void {
    const newMessage: Message = {
      ...message,
      id: this.generateId(),
      boardId: boardId,
      createdAt: new Date()
    };

    const boards = this.boardsSubject.value.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          messages: [...board.messages, newMessage]
        };
      }
      return board;
    });
    
    this.saveBoards(boards);
  }

  deleteMessage(boardId: string, messageId: string): void {
    const boards = this.boardsSubject.value.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          messages: board.messages.filter(m => m.id !== messageId)
        };
      }
      return board;
    });
    
    this.saveBoards(boards);
  }

  getThemes(): Theme[] {
    return this.storageService.getItem<Theme[]>(this.THEMES_KEY) || this.defaultThemes;
  }

  getTheme(id: string): Theme | undefined {
    return this.getThemes().find(theme => theme.id === id);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateShareLink(): string {
    return this.generateId();
  }

  getBoardByShareLink(shareLink: string): Board | undefined {
    return this.boardsSubject.value.find(board => board.shareLink === shareLink);
  }
}
