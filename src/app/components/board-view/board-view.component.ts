import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board } from '../../models/board';
import { Theme } from '../../models/theme';
import { Message } from '../../models/message';
import { BoardService } from '../../services/board.service';
import { MessageGridUtils, MESSAGE_GRID_CONFIG } from '../../utils/message-grid.utils';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.scss']
})
export class BoardViewComponent implements OnInit {
  board: Board | null = null;
  theme: Theme | null = null;
  showMessageModal = false;
  messagesPerRow = MESSAGE_GRID_CONFIG.MESSAGES_PER_ROW;
  showGridOverlay = false; // For debugging/admin purposes

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService
  ) { }

  get sortedMessages(): Message[] {
    if (!this.board?.messages) return [];
    return MessageGridUtils.sortMessagesByPosition(this.board.messages);
  }

  get gridStyles() {
    return MessageGridUtils.getGridStyles(this.messagesPerRow);
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  /**
   * Get the grid position (row, col) for a message
   */
  getMessageGridPosition(message: Message): { row: number; col: number } {
    if (message.position === undefined) {
      return { row: -1, col: -1 };
    }
    return MessageGridUtils.getGridPosition(message.position, this.messagesPerRow);
  }

  /**
   * Check if a message is positioned
   */
  isMessagePositioned(message: Message): boolean {
    return message.position !== undefined;
  }

  /**
   * Toggle grid overlay for visual debugging
   */
  toggleGridOverlay(): void {
    this.showGridOverlay = !this.showGridOverlay;
  }

  /**
   * Get empty grid positions for overlay
   */
  get emptyGridPositions(): number[] {
    if (!this.board?.messages) return [];
    
    const maxPosition = Math.max(
      ...this.board.messages
        .map(m => m.position)
        .filter(p => p !== undefined) as number[],
      -1
    );
    
    const totalPositions = Math.ceil((maxPosition + 1) / this.messagesPerRow) * this.messagesPerRow;
    const usedPositions = new Set(
      this.board.messages
        .map(m => m.position)
        .filter(p => p !== undefined)
    );
    
    const emptyPositions: number[] = [];
    for (let i = 0; i < totalPositions; i++) {
      if (!usedPositions.has(i)) {
        emptyPositions.push(i);
      }
    }
    
    return emptyPositions;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const shareLink = params['shareLink'];
      
      if (id) {
        this.boardService.getBoard(id).subscribe({
          next: (board) => {
            this.board = board;
            this.loadTheme();
          },
          error: (error) => {
            console.error('Error loading board:', error);
            this.router.navigate(['/']);
          }
        });
      } else if (shareLink) {
        this.boardService.getBoardByShareLink(shareLink).subscribe({
          next: (board) => {
            this.board = board;
            this.loadTheme();
          },
          error: (error) => {
            console.error('Error loading board by share link:', error);
            this.router.navigate(['/']);
          }
        });
      }
    });
  }

  private loadTheme(): void {
    if (this.board) {
      this.boardService.getTheme(this.board.themeId).subscribe({
        next: (theme) => {
          this.theme = theme;
        },
        error: (error) => {
          console.error('Error loading theme:', error);
        }
      });
    }
  }

  openMessageModal(): void {
    this.showMessageModal = true;
  }

  closeMessageModal(): void {
    this.showMessageModal = false;
  }

  onMessageAdded(): void {
    this.closeMessageModal();
    // Refresh board data
    if (this.board) {
      this.boardService.getBoard(this.board.id).subscribe({
        next: (board) => {
          this.board = board;
        },
        error: (error) => {
          console.error('Error refreshing board:', error);
        }
      });
    }
  }

  editBoard(): void {
    if (this.board) {
      this.router.navigate(['/board', this.board.id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getShareUrl(): string {
    return this.board ? `${window.location.origin}/share/${this.board.shareLink}` : '';
  }

  copyShareLink(): void {
    const shareUrl = this.getShareUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  }

  deleteMessage(messageId: string): void {
    if (this.board && confirm('Are you sure you want to delete this message?')) {
      this.boardService.deleteMessage(this.board.id, messageId).subscribe({
        next: () => {
          // Refresh board data
          if (this.board) {
            this.boardService.getBoard(this.board.id).subscribe({
              next: (board) => {
                this.board = board;
              },
              error: (error) => {
                console.error('Error refreshing board after message deletion:', error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error deleting message:', error);
        }
      });
    }
  }

  printBoard(): void {
    window.print();
  }

  downloadBoard(): void {
    // Simple implementation: open print dialog
    // In a real app, you'd generate a PDF or image
    this.printBoard();
  }
}
