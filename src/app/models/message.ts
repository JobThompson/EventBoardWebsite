export interface Message {
  id: string;
  boardId: string;
  authorName: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: Date;
  position?: { x: number; y: number };
}
