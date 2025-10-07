import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Board } from '../../models/board';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  boards: Board[] = [];

  constructor(
    private boardService: BoardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.boardService.boards$.subscribe(boards => {
      this.boards = boards;
    });
  }

  viewBoard(board: Board): void {
    this.router.navigate(['/board', board.id]);
  }

  editBoard(board: Board): void {
    this.router.navigate(['/board', board.id, 'edit']);
  }

  deleteBoard(board: Board): void {
    if (confirm(`Are you sure you want to delete "${board.title}"?`)) {
      this.boardService.deleteBoard(board.id);
    }
  }

  createBoard(): void {
    this.router.navigate(['/create']);
  }

  getShareUrl(board: Board): string {
    return `${window.location.origin}/share/${board.shareLink}`;
  }

  copyShareLink(board: Board): void {
    const shareUrl = this.getShareUrl(board);
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  }
}
