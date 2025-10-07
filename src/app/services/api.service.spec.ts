import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Board } from '../models/board';
import { Message } from '../models/message';
import { Theme } from '../models/theme';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch boards', () => {
    const mockBoards: Board[] = [
      {
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
      }
    ];

    service.getBoards().subscribe(boards => {
      expect(boards).toEqual(mockBoards);
    });

    const req = httpMock.expectOne('https://your-api-endpoint.com/api/boards');
    expect(req.request.method).toBe('GET');
    req.flush(mockBoards);
  });

  it('should create a board', () => {
    const newBoard = {
      title: 'New Board',
      description: 'New Description',
      occasion: 'birthday',
      recipientName: 'John Doe',
      createdBy: 'Jane Doe',
      themeId: 'birthday',
      isPublic: true
    };

    const mockResponse: Board = {
      ...newBoard,
      id: '1',
      createdAt: new Date(),
      shareLink: 'abc123',
      messages: []
    };

    service.createBoard(newBoard).subscribe(board => {
      expect(board).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://your-api-endpoint.com/api/boards');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newBoard);
    req.flush(mockResponse);
  });

  it('should handle errors', () => {
    service.getBoards().subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('https://your-api-endpoint.com/api/boards');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});