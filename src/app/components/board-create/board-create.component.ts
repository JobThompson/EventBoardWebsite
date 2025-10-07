import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardService } from '../../services/board.service';
import { Theme } from '../../models/theme';

@Component({
  selector: 'app-board-create',
  templateUrl: './board-create.component.html',
  styleUrls: ['./board-create.component.scss']
})
export class BoardCreateComponent implements OnInit {
  boardForm: FormGroup;
  themes: Theme[] = [];
  selectedTheme: Theme | null = null;

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    private router: Router
  ) {
    this.boardForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      occasion: ['birthday', [Validators.required]],
      recipientName: ['', [Validators.required]],
      createdBy: ['', [Validators.required]],
      themeId: ['birthday', [Validators.required]],
      isPublic: [true]
    });
  }

  ngOnInit(): void {
    this.themes = this.boardService.getThemes();
    this.selectedTheme = this.themes[0];
    
    this.boardForm.get('themeId')?.valueChanges.subscribe(themeId => {
      this.selectedTheme = this.themes.find(t => t.id === themeId) || null;
    });
  }

  onSubmit(): void {
    if (this.boardForm.valid) {
      const board = this.boardService.createBoard(this.boardForm.value);
      this.router.navigate(['/board', board.id]);
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
