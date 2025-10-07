export interface Message {
  id: string;
  boardId: string;
  authorName: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
  position?: number; // Single number for grid position
}
