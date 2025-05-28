import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';

export interface Image {
  id: number;
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadDate: Date;
  productId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly apiUrl = `${environment.baseURL}/api/Image`;

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

  // Upload single image
  uploadImage(file: File, productId?: number): Observable<Image> {
    const formData = new FormData();
    formData.append('file', file);
    if (productId) {
      formData.append('productId', productId.toString());
    }

    return this.http.post<Image>(`${this.apiUrl}/upload`, formData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Upload multiple images
  uploadMultipleImages(files: File[], productId?: number): Observable<Image[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    if (productId) {
      formData.append('productId', productId.toString());
    }

    return this.http.post<Image[]>(`${this.apiUrl}/upload-multiple`, formData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get image by ID
  getImage(id: number): Observable<Image> {
    return this.http.get<Image>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Get images by product ID
  getProductImages(productId: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/product/${productId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Delete image
  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Update image (e.g., change product association)
  updateImage(id: number, productId: number): Observable<Image> {
    return this.http.put<Image>(`${this.apiUrl}/${id}`, { productId }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError.bind(this))
    );
  }
} 