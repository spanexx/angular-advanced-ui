export interface ChatAttachment {
  type: 'image' | 'file';
  url: string;
  name: string;
}

export interface ChatReaction {
  emoji: string;
  users: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  avatarUrl?: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: ChatAttachment[];
  reactions?: ChatReaction[];
  pinned?: boolean;
  replyTo?: ChatMessage;
}
