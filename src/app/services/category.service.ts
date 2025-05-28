import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ICategory } from '../interfaces/icategory';
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}


export interface ApiResponse<T> {
  status: boolean;
  massage: string;
  statusCode: number;
  data: T;
  validation: any;
  dateTime: string;
}


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = `${environment.baseURL}/api/Category`;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.router.navigate(['/auth/login']);
    }
    return throwError(() => error);
  }

  // Get all categories with pagination
getCategories(page: number = 1, pageSize: number = 10): Observable<ApiResponse<Category[]>> {
  return this.http.get<ApiResponse<Category[]>>(
    `${this.apiUrl}?page=${page}&pageSize=${pageSize}`,
    { headers: this.getHeaders() }
  ).pipe(
    catchError(this.handleError.bind(this))
  );
}


  // Get category by ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Create new category
 createCategory(category: Omit<ICategory, 'id'>): Observable<Category> {
    console.log(category);
    return this.http.post<Category>(this.apiUrl, category, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Update category
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Delete category
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }
}
