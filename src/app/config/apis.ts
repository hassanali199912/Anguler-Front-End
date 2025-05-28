import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp?: number;
  roles?: string;
}

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
    return next(request);
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return next(request);
  }

  // Validate token expiration
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const expirationTime = decodedToken.exp ? decodedToken.exp * 1000 : 0;
    
    if (Date.now() >= expirationTime) {
      console.log('Token expired, clearing storage');
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
      return throwError(() => new Error('Session expired. Please login again.'));
    }
  } catch (error) {
    console.error('Error validating token:', error);
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
    return throwError(() => new Error('Invalid session. Please login again.'));
  }

  // Clone the request and add the authorization header
  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // Handle the response and any errors
  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Unauthorized access, clearing token');
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
      return throwError(() => error);
    })
  );
};
