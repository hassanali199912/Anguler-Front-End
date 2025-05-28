import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';

export interface Video {
  id: number;
  productId: number;
  url: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  uploadDate: Date;
  views: number;
  isFeatured: boolean;
}

export interface CreateVideoRequest {
  productId: number;
  title: string;
  description: string;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly apiUrl = `${environment.baseURL}/api/Video`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.router.navigate(['/auth/login']);
    }
    return throwError(() => error);
  }

  // Upload video
  uploadVideo(request: CreateVideoRequest): Observable<Video> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('productId', request.productId.toString());
    formData.append('title', request.title);
    formData.append('description', request.description);

    return this.http.post<Video>(`${this.apiUrl}/upload`, formData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get video by ID
  getVideo(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get videos for a product
  getProductVideos(productId: number): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}/product/${productId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Update video details
  updateVideo(id: number, updates: Partial<Video>): Observable<Video> {
    return this.http.put<Video>(`${this.apiUrl}/${id}`, updates, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Delete video
  deleteVideo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Mark video as featured
  setFeatured(id: number, isFeatured: boolean): Observable<Video> {
    return this.http.put<Video>(`${this.apiUrl}/${id}/featured`, { isFeatured }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Increment video views
  incrementViews(id: number): Observable<Video> {
    return this.http.post<Video>(`${this.apiUrl}/${id}/view`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get featured videos
  getFeaturedVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiUrl}/featured`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
} 