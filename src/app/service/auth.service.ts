import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.url; // Cambia esto por la URL de tu API

  constructor(private http: HttpClient) { }

  login(email: string, password: string, keepLoggedIn: boolean): Observable<any> {
    // La API debe manejar la lógica para determinar la duración del token basándose en `keepLoggedIn`
    return this.http.post(`${this.baseUrl}/login`, { email, password, keepLoggedIn });
  }

  recover(email: string): Observable<any> {
    // Envía un email al usuario con instrucciones/token para recuperar su contraseña
    return this.http.post(`${this.baseUrl}/recover`, { email });
  }

  logout(): Observable<any> {
    // Lógica para cerrar sesión; podría implicar invalidar el token en el servidor
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.baseUrl}/logout`, {}, { headers });
  }

  getUserRoles(): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/user/roles`, { headers });
  }
  checkingRole(rol: string): Observable<any> {
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/${rol}/checking-role/${rol}`, { headers });
  }
}
