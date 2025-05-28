import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';
import { Product } from './product.service';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: number;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = `${environment.baseURL}/api/OrderItem`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadCart();
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Cart Service API Error:', {
      url: error.url,
      status: error.status,
      statusText: error.statusText,
      message: error.message,
      error: error.error
    });

    if (error.status === 401) {
      console.log('Unauthorized access, redirecting to login...');
      this.router.navigate(['/auth/login']);
      return throwError(() => new Error('Please login to continue'));
    } else if (error.status === 404) {
       console.error('Cart endpoint not found. Please check the backend API.');
       return throwError(() => new Error('Cart service is currently unavailable. Please try again later.'));
    } else if (error.status === 0) {
      console.error('Network error - Could not connect to the server');
      return throwError(() => new Error('Could not connect to the server. Please check your internet connection.'));
    }

    const errorMessage = error.error?.message || error.message || 'An unknown error occurred in Cart Service';
    return throwError(() => new Error(errorMessage));
  }

  private loadCart(): void {
    if (this.isBrowser && this.getToken()) {
      this.getCart().subscribe({
        next: () => console.log('Cart loaded successfully'),
        error: (err) => console.error('Failed to load cart:', err)
      });
    }
  }

  // Get current user's cart
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(
        tap(cart => this.cartSubject.next(cart)),
        catchError(this.handleError.bind(this))
      );
  }

  // Add item to cart
  addToCart(productId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, 
      { productId, quantity },
      { headers: this.getHeaders() }
    ).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError.bind(this))
    );
  }

  // Update cart item quantity
  updateCartItemQuantity(itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/items/${itemId}`,
      { quantity },
      { headers: this.getHeaders() }
    ).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(this.handleError.bind(this))
    );
  }

  // Remove item from cart
  removeFromCart(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/items/${itemId}`, { headers: this.getHeaders() })
      .pipe(
        tap(cart => this.cartSubject.next(cart)),
        catchError(this.handleError.bind(this))
      );
  }

  // Clear cart
  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.cartSubject.next(null)),
        catchError(this.handleError.bind(this))
      );
  }

  // Get cart total
  getCartTotal(): number {
    const cart = this.cartSubject.value;
    return cart?.totalAmount || 0;
  }

  // Get cart item count
  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    return cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  }
} 