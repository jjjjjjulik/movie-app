import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api.themoviedb.org/3';
  private apiKey = '8a701f184202b480bd359829ea7c74cb';
  private username = 'IngaLekhman';
  private password = 'Inga2015'; 
  private sessionId: string | null = null;

  constructor(private http: HttpClient) { }

  // Get the request token
  private getRequestToken(): Observable<string> {
    const url = `${this.apiUrl}/authentication/token/new?api_key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
        map(response => response.request_token),
        catchError(this.handleError)
    );
  }

  // Validate the request token with the user's credentials
  private validateRequestToken(requestToken: string): Observable<void> {
    const url = `${this.apiUrl}/authentication/token/validate_with_login?api_key=${this.apiKey}`;
    const body = {
        username: this.username,
        password: this.password,
        request_token: requestToken
    };
    return this.http.post<any>(url, body).pipe(
        map(() => { }),
        catchError(this.handleError)
    );
  }

  // Create a session ID
  private createSession(requestToken: string): Observable<string> {
    const url = `${this.apiUrl}/authentication/session/new?api_key=${this.apiKey}`;
    const body = { request_token: requestToken };
    return this.http.post<any>(url, body).pipe(
        map(response => response.session_id),
        catchError(this.handleError)
    );
  }

  // Get account details to retrieve accountId
  private getAccountId(sessionId: string): Observable<number> {
    const url = `${this.apiUrl}/account?api_key=${this.apiKey}&session_id=${sessionId}`;
    return this.http.get<any>(url).pipe(
        map(response => response.id),
        catchError(this.handleError)
    );
  }

  // Public method to get accountId and sessionId
  public authenticateAndGetAccountInfo(): Observable<{accountId: number, sessionId: string}> {
    return this.getRequestToken().pipe(
        switchMap(requestToken => this.validateRequestToken(requestToken).pipe(
            switchMap(() => this.createSession(requestToken)),
            switchMap(sessionId => this.getAccountId(sessionId).pipe(
                map(accountId => ({ accountId, sessionId }))
            ))
        ))
    );
  }

  public setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  public getSessionId(): string | null {
    return this.sessionId;
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
