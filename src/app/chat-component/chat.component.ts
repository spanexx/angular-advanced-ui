import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { ChatMessage, ChatAttachment, ChatReaction } from './chat.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EMOJIS } from './emoji-data';

@Component({
  selector: 'lib-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages$: Observable<ChatMessage[]> = this.chatService.messages$;
  groupedMessages$ = this.messages$.pipe(
    map(messages => {
      const groups: { [date: string]: ChatMessage[] } = {};
      messages.forEach(msg => {
        const date = new Date(msg.timestamp).toISOString().split('T')[0];
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
      });
      return Object.entries(groups).map(([date, msgs]) => ({ date, msgs }));
    })
  );
  input = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  emojis = EMOJIS;
  showEmojiPicker = false;
  avatarUrl = 'https://api.dicebear.com/7.x/identicon/svg?seed=Me';
  typing = false;
  typingTimeout: any;
  replyToMessage: ChatMessage | null = null;
  pinnedMessages$: Observable<ChatMessage[]> = this.messages$.pipe(
    map(messages => messages.filter(m => m.pinned))
  );

  constructor(private chatService: ChatService) {}

  send() {
    if (this.input.trim() || this.selectedFile) {
      const replyTo = this.replyToMessage;
      if (this.selectedFile) {
        this.chatService.uploadFile(this.selectedFile).subscribe((att: ChatAttachment) => {
          this.chatService.sendMessage(
            this.input,
            'Me',
            this.avatarUrl,
            [att],
            undefined,
            replyTo || undefined
          );
          this.input = '';
          this.selectedFile = null;
          this.previewUrl = null;
          this.replyToMessage = null;
        });
      } else {
        this.chatService.sendMessage(this.input, 'Me', this.avatarUrl, undefined, undefined, replyTo || undefined);
        this.input = '';
        this.replyToMessage = null;
      }
    }
  }

  onInput() {
    this.typing = true;
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => this.typing = false, 1200);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      // Optionally preview image
      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.previewUrl = null;
      }
    }
  }

  addEmoji(emoji: string) {
    this.input += emoji;
    this.showEmojiPicker = false;
    this.onInput();
  }

  setReplyTo(msg: ChatMessage) {
    this.replyToMessage = msg;
  }

  clearReplyTo() {
    this.replyToMessage = null;
  }

  addReaction(msg: ChatMessage, emoji: string) {
    this.chatService.addReaction(msg, emoji, 'Me');
  }

  pinMessage(msg: ChatMessage) {
    this.chatService.pinMessage(msg);
  }

  unpinMessage(msg: ChatMessage) {
    this.chatService.unpinMessage(msg);
  }

  // ...existing code...
}
