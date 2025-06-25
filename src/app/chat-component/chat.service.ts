import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ChatMessage, ChatAttachment, ChatReaction } from './chat.model';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  private baseUrl = environment.apiUrl + '/chat';

  constructor(private http: HttpClient) {
    this.fetchMessages();
  }

  fetchMessages() {
    this.http.get<ChatMessage[]>(this.baseUrl)
      .subscribe(messages => this.messagesSubject.next(messages));
  }

  sendMessage(text: string, sender: string, avatarUrl?: string, attachments?: ChatAttachment[], reactions?: ChatReaction[], replyTo?: ChatMessage, pinned?: boolean) {
    const payload: any = {
      text,
      sender,
      avatarUrl,
      attachments: attachments || [],
      reactions: reactions || [],
      replyTo: replyTo || null,
      pinned: !!pinned
    };
    this.http.post<ChatMessage>(this.baseUrl, payload)
      .pipe(
        tap(msg => {
          const updated = [...this.messagesSubject.value, msg];
          this.messagesSubject.next(updated);
        })
      ).subscribe();
  }

  addReaction(msg: ChatMessage, emoji: string, user: string) {
    // Local update for demo; in real app, send to backend
    const messages = this.messagesSubject.value.map(m => {
      if (m.id === msg.id) {
        let reactions = m.reactions || [];
        let found = reactions.find(r => r.emoji === emoji);
        if (found) {
          if (!found.users.includes(user)) found.users.push(user);
        } else {
          reactions = [...reactions, { emoji, users: [user] }];
        }
        return { ...m, reactions };
      }
      return m;
    });
    this.messagesSubject.next(messages);
  }

  pinMessage(msg: ChatMessage) {
    const messages = this.messagesSubject.value.map(m => m.id === msg.id ? { ...m, pinned: true } : m);
    this.messagesSubject.next(messages);
  }

  unpinMessage(msg: ChatMessage) {
    const messages = this.messagesSubject.value.map(m => m.id === msg.id ? { ...m, pinned: false } : m);
    this.messagesSubject.next(messages);
  }

  uploadFile(file: File): Observable<ChatAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    // For demo, just return a mock observable
    return new Observable<ChatAttachment>(observer => {
      setTimeout(() => {
        observer.next({
          type: file.type.startsWith('image') ? 'image' : 'file',
          url: URL.createObjectURL(file),
          name: file.name
        });
        observer.complete();
      }, 500);
    });
  }
}
