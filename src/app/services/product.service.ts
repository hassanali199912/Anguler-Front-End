import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { IProduct } from '../interfaces/iproduct';
// Define interfaces for type safety
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrl: string;
    category: string;
  stockQuantity: number;
  // Add other properties as needed
}


export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.baseURL}/api/Product`;
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
    console.log('Current token:', token ? 'Token exists' : 'No token found');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', {
      url: error.url,
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      error: error.error
    });

    if (error.status === 401) {
      console.log('Unauthorized access, redirecting to login...');
      localStorage.removeItem('token'); // Clear invalid token
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('Please login to continue'));
    }

    if (error.status === 0) {
      console.error('Network error - Could not connect to the server');
      return throwError(() => new Error('Could not connect to the server. Please check your internet connection.'));
    }

    const errorMessage = error.error?.message || error.message || 'An unknown error occurred';
    return throwError(() => new Error(errorMessage));
  }

  // Get all products
  getAllProducts():Observable<any>
  {
    return this.http.get(`${environment.baseURL}/api/Product`);
  }

  // Get product by ID
  getProductById(id: number): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Create new product
  createProduct(product: Omit<IProduct, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Update existing product
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Get products by category
  getProductsByCategory(categoryId: number, page: number = 1, pageSize: number = 100): Observable<Product[]> {
    console.log('Fetching products for category:', categoryId);
    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiUrl}/category/${categoryId}?page=${page}&pageSize=${pageSize}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        console.log('Category Products API Response:', {
          categoryId,
          totalItems: response.items?.length || 0
        });
      }),
      map(response => response.items || []),
      catchError(this.handleError.bind(this))
    );
  }

  // Search products
  searchProducts(query: string, page: number = 1, pageSize: number = 100): Observable<Product[]> {
    return this.http.get<PaginatedResponse<Product>>(
      `${this.apiUrl}/search?query=${query}&page=${page}&pageSize=${pageSize}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.items || []),
      catchError(this.handleError.bind(this))
    );
  }
}
