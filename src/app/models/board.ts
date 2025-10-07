export interface Board {
  id: string;
  title: string;
  description: string;
  occasion: string;
  recipientName: string;
  createdAt: Date;
  createdBy: string;
  themeId: string;
  shareLink: string;
  isPublic: boolean;
  messages: Message[];
}

import { Message } from './message';
