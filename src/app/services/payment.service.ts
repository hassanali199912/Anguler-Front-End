import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentDate: Date;
  currency: string;
}

export enum PaymentStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded'
}

export enum PaymentMethod {
  CreditCard = 'CreditCard',
  PayPal = 'PayPal',
  BankTransfer = 'BankTransfer'
}

export interface PaymentRequest {
  orderId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  cardDetails?: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.baseURL}/api/Payment`;

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

  // Process payment
  processPayment(paymentRequest: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/process`, paymentRequest, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get payment by ID
  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get payments by order ID
  getOrderPayments(orderId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/order/${orderId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get user's payment history
  getUserPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/user`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Refund payment
  refundPayment(paymentId: number, reason: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/${paymentId}/refund`, { reason }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Verify payment status
  verifyPayment(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${paymentId}/verify`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
} 