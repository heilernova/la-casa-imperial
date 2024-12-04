import { inject, Injectable } from '@angular/core';
import { Session } from './session.model';
import { ApiSession } from '@la-casa-imperial/schemas/auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionService { 
  private readonly _http: HttpClient = inject(HttpClient);
  private _currentSession: Session | null = null;

  public get isLoggedIn(): boolean {
    return this._currentSession ? true : false;
  }

  public init(): boolean {
    const localStorageDataSession = localStorage.getItem("session");
    if (!localStorageDataSession) return false;
  
    try {
      const sessionInfo: ApiSession | null = JSON.parse(atob(localStorageDataSession));
      if (!sessionInfo) return false;
  
      const session = new Session(sessionInfo, this._http);
      if (session.validated()) {
        this._currentSession = session;
        return true;
      }
    } catch (error) {
      console.error("Error al cargar la sesión:", error);
      localStorage.removeItem("session");
      return false;
    }
  
    return false;
  }

  public singIn(credentials: { username: string, password: string }): Promise<Session> {
    return new Promise((resolve, reject) => {
      this._http.post<ApiSession>("sign-in", credentials).subscribe({
        next: res => {
          const session = new Session(res, this._http);
          if (session.validated()){
            localStorage.setItem("session", btoa(JSON.stringify(res)));
            this._currentSession = session;
            resolve(this._currentSession);
          } else {
            reject(new Error("Error al cargar la sesión"));
          }
        },
        error: err => {
          reject(err);
        }
      })
    })
  }
  

  public getCurrentSession(): Session | null {
    return this._currentSession;
  }

  public logout(): void {
    this._currentSession = null;
    localStorage.removeItem("session");
  }
}
