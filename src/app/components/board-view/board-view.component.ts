import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board } from '../../models/board';
import { Theme } from '../../models/theme';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.scss']
})
export class BoardViewComponent implements OnInit {
  board: Board | null = null;
  theme: Theme | null = null;
  showMessageModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const shareLink = params['shareLink'];
      
      if (id) {
        this.board = this.boardService.getBoard(id) || null;
      } else if (shareLink) {
        this.board = this.boardService.getBoardByShareLink(shareLink) || null;
      }
      
      if (this.board) {
        this.theme = this.boardService.getTheme(this.board.themeId) || null;
      }
    });
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
      this.board = this.boardService.getBoard(this.board.id) || null;
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
      this.boardService.deleteMessage(this.board.id, messageId);
      this.board = this.boardService.getBoard(this.board.id) || null;
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
