import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { BoardService } from './board.service';
import { ApiService } from './api.service';
import { Board } from '../models/board';
import { Message } from '../models/message';
import { Theme } from '../models/theme';

describe('BoardService', () => {
  let service: BoardService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockBoard: Board = {
    id: '1',
    title: 'Test Board',
    description: 'Test Description',
    occasion: 'birthday',
    recipientName: 'John Doe',
    createdAt: new Date(),
    createdBy: 'Jane Doe',
    themeId: 'birthday',
    shareLink: 'abc123',
    isPublic: true,
    messages: []
  };

  const mockTheme: Theme = {
    id: 'birthday',
    name: 'Birthday Party',
    backgroundColor: '#FFF5E6',
    primaryColor: '#FF6B9D',
    secondaryColor: '#C44569',
    textColor: '#333333',
    fontFamily: 'Comic Sans MS, cursive'
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', [
      'getBoards', 'getBoard', 'createBoard', 'updateBoard', 'deleteBoard',
      'getBoardByShareLink', 'createMessage', 'deleteMessage',
      'getThemes', 'getTheme'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BoardService,
        { provide: ApiService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(BoardService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load boards on initialization', () => {
    apiServiceSpy.getBoards.and.returnValue(of([mockBoard]));
    apiServiceSpy.getThemes.and.returnValue(of([mockTheme]));
    
    service = new BoardService(apiServiceSpy);
    
    expect(apiServiceSpy.getBoards).toHaveBeenCalled();
    expect(service.getAllBoards()).toEqual([mockBoard]);
  });

  it('should create a board', () => {
    const newBoardData = {
      title: 'New Board',
      description: 'New Description',
      occasion: 'birthday',
      recipientName: 'John Doe',
      createdBy: 'Jane Doe',
      themeId: 'birthday',
      isPublic: true
    };

    apiServiceSpy.createBoard.and.returnValue(of(mockBoard));

    service.createBoard(newBoardData).subscribe(board => {
      expect(board).toEqual(mockBoard);
    });

    expect(apiServiceSpy.createBoard).toHaveBeenCalledWith(newBoardData);
  });

  it('should handle API errors gracefully', () => {
    apiServiceSpy.getBoards.and.returnValue(throwError(() => new Error('API Error')));
    apiServiceSpy.getThemes.and.returnValue(of([mockTheme]));
    
    service = new BoardService(apiServiceSpy);
    
    expect(service.getAllBoards()).toEqual([]);
  });

  it('should get board from cache if available', () => {
    apiServiceSpy.getBoards.and.returnValue(of([mockBoard]));
    apiServiceSpy.getThemes.and.returnValue(of([mockTheme]));
    
    service = new BoardService(apiServiceSpy);
    
    service.getBoard('1').subscribe(board => {
      expect(board).toEqual(mockBoard);
    });
    
    // Should not call API again since board is in cache
    expect(apiServiceSpy.getBoard).not.toHaveBeenCalled();
  });

  it('should fetch board from API if not in cache', () => {
    apiServiceSpy.getBoards.and.returnValue(of([]));
    apiServiceSpy.getThemes.and.returnValue(of([mockTheme]));
    apiServiceSpy.getBoard.and.returnValue(of(mockBoard));
    
    service = new BoardService(apiServiceSpy);
    
    service.getBoard('1').subscribe(board => {
      expect(board).toEqual(mockBoard);
    });
    
    expect(apiServiceSpy.getBoard).toHaveBeenCalledWith('1');
  });
});
