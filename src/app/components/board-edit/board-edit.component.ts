import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardService } from '../../services/board.service';
import { Theme } from '../../models/theme';
import { Board } from '../../models/board';

@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.component.html',
  styleUrls: ['./board-edit.component.scss']
})
export class BoardEditComponent implements OnInit {
  boardForm: FormGroup;
  themes: Theme[] = [];
  selectedTheme: Theme | null = null;
  boardId: string = '';
  board: Board | null = null;

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.boardForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      occasion: ['', [Validators.required]],
      recipientName: ['', [Validators.required]],
      themeId: ['', [Validators.required]],
      isPublic: [true]
    });
  }

  ngOnInit(): void {
    this.themes = this.boardService.getThemes();
    
    this.route.params.subscribe(params => {
      this.boardId = params['id'];
      this.board = this.boardService.getBoard(this.boardId) || null;
      
      if (this.board) {
        this.boardForm.patchValue({
          title: this.board.title,
          description: this.board.description,
          occasion: this.board.occasion,
          recipientName: this.board.recipientName,
          themeId: this.board.themeId,
          isPublic: this.board.isPublic
        });
        
        this.selectedTheme = this.themes.find(t => t.id === this.board!.themeId) || null;
      }
    });
    
    this.boardForm.get('themeId')?.valueChanges.subscribe(themeId => {
      this.selectedTheme = this.themes.find(t => t.id === themeId) || null;
    });
  }

  onSubmit(): void {
    if (this.boardForm.valid && this.board) {
      this.boardService.updateBoard(this.boardId, this.boardForm.value);
      this.router.navigate(['/board', this.boardId]);
    }
  }

  onCancel(): void {
    this.router.navigate(['/board', this.boardId]);
  }
}
