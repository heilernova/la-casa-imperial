import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SessionService } from '../authentication/session.service';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  const router = inject(Router);
  const currentSession = session.getCurrentSession();
  const url = `${environment.API_URL_BASE}/${req.url}`;
  let headers = req.headers;

  if (currentSession){
    headers = headers.append("X-App-Token", currentSession.token);
  }
  
  return next(req.clone({ url, headers })).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse){
        if (err.status == 401){
          session.logout();
          router.navigate(["/login"]);
        }
      }
      return throwError(() => err);
    })
  );
};
