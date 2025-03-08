import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private LOGIN_URL = environment.LOGIN_URL;
  private SIGNUP_URL = environment.SIGNUP_URL;
  accessToken = signal<string | null>(null); // signal for storing access token

  login(credentials: {email: string, password: string}): Observable<Object>{
    return this.http.post<{data: {tokens: {accessToken: string}}}>(this.LOGIN_URL, credentials, {withCredentials: true}).pipe(
      tap(response => {
        this.accessToken.set(response.data.tokens.accessToken);
        console.log(this.accessToken())
      })
    );
  }

  signUp(credentials: {username: string, email: string, password: string}): Observable<Object>{
    return this.http.post(this.SIGNUP_URL, credentials);
  }
}
