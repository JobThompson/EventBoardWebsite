import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent implements OnInit {
  @Input() boardId!: string;
  @Output() messageAdded = new EventEmitter<void>();

  messageForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService
  ) {
    this.messageForm = this.fb.group({
      authorName: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onSubmit(): void {
    if (this.messageForm.valid) {
      const messageData: any = {
        authorName: this.messageForm.value.authorName,
        content: this.messageForm.value.content
      };

      // Handle file upload (in a real app, you'd upload to a server)
      if (this.selectedFile) {
        messageData.mediaUrl = this.previewUrl;
        messageData.mediaType = this.selectedFile.type.startsWith('image/') ? 'image' : 'video';
      }

      this.boardService.addMessage(this.boardId, messageData).subscribe({
        next: () => {
          this.messageAdded.emit();
          
          // Reset form
          this.messageForm.reset();
          this.selectedFile = null;
          this.previewUrl = null;
        },
        error: (error) => {
          console.error('Error adding message:', error);
          // You could show an error message to the user here
        }
      });
    }
  }
}
