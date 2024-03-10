import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {

  constructor(private http: HttpClient) { }
  baseUrl = environment.url;

  create(entity: T, endpoint: string): Observable<T> {
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, entity, { headers } ).pipe(
      catchError(error => {
        console.error('Error al crear:', error);
        return throwError(() => new Error('Error, no es posible crear.'));
      })
    );
  }

  read(endpoint: string, params?: any): Observable<T[]> {
    let queryParams = new HttpParams({ fromObject: params });
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<T[]>(`${this.baseUrl}${endpoint}`, { params: queryParams , headers }).pipe(
      catchError(error => {
        console.error('Error al leer:', error);
        return throwError(() => new Error('Error en consulta.'));
      })
    );
  }

  update(entity: T, endpoint: string): Observable<T> {
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, entity, {headers}).pipe(
      catchError(error => {
        console.error('Error al actualizar..:', error);
        return throwError(() => new Error('Error al actualizar.'));
      })
    );
  }

  delete(endpoint: string): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.baseUrl}${endpoint}`, {headers}).pipe(
      catchError(error => {
        console.error('Error al borrar:', error);
        return throwError(() => new Error('Error al borrar.'));
      })
    );
  }

  uploadImage(file: Blob, endpoint: string): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // No establecer el 'Content-Type' a 'multipart/form-data' aquí
      // Angular lo establecerá automáticamente con el boundary correcto
    });
    const formData: FormData = new FormData();
    formData.append('image', file, 'imagen.png');

    return this.http.post<any>(`${this.baseUrl}${endpoint}`, formData, { headers }).pipe(
      catchError(error => {
        console.error('Error al subir imagen:', error);
        return throwError(() => new Error('Error al subir imagen.'));
      })
    );
  }
}
