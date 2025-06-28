import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

export interface RegisterRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';
  private _currentUser: any = null;

  get currentUser() {
    return this._currentUser;
  }

  set currentUser(user: any) {
    this._currentUser = user;
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('current_user');
    }
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {
    // Load user from localStorage if available
    const user = localStorage.getItem('current_user');
    if (user) {
      this._currentUser = JSON.parse(user);
    }
  }

  register(payload: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(payload: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
      tap(res => {
        if (res && res.accessToken) {
          this.tokenService.setTokens(res.accessToken, res.refreshToken);
        }
        if (res && res.user) {
          this.currentUser = res.user;
        }
      })
    );
  }

  logout() {
    this.tokenService.clearTokens();
    this.currentUser = null;
  }

  getUserId(): string | null {
    return this._currentUser?._id || null;
  }
}
