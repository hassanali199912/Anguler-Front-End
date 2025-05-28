import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: string;
  orderDate: Date;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export interface CreateOrderRequest {
  shippingAddress: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = `${environment.baseURL}/api/Order`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.router.navigate(['/auth/login']);
    }
    return throwError(() => error);
  }

  // Get all orders for the current user
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Get order by ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Create new order
  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Cancel order
  cancelOrder(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cancel`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Update order status (admin only)
  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { status }, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  // Get order history (admin only)
  getAllOrders(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Order>> {
    return this.http.get<PaginatedResponse<Order>>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }
}

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
} 