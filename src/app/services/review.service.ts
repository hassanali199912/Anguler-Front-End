import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';

export interface Review {
  id: number;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  reviewDate: Date;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = `${environment.baseURL}/api/Review`;

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

  // Create new review
  createReview(review: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get review by ID
  getReview(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get reviews for a product
  getProductReviews(productId: number, page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Review>> {
    return this.http.get<PaginatedResponse<Review>>(
      `${this.apiUrl}/product/${productId}?page=${page}&pageSize=${pageSize}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get user's reviews
  getUserReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Update review
  updateReview(id: number, review: UpdateReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Delete review
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Mark review as helpful
  markReviewHelpful(id: number): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/${id}/helpful`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get average rating for a product
  getProductAverageRating(productId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/product/${productId}/average-rating`, {
      headers: this.getHeaders()
    }).pipe(
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