import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Esto hace que el servicio esté disponible en toda la aplicación
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/users'; // URL base de tu backend

  constructor(private http: HttpClient) {}

  // Método para hacer un POST al endpoint de login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Método para obtener datos con un GET
  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Método para crear un nuevo recurso (ejemplo: un usuario)
  register(resource: any): Observable<any> {
    console.log(resource);
    return this.http.post(`${this.baseUrl}/register`, resource);
  }

  // Método para actualizar un recurso existente
  updateResource(id: string, resource: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/resource/${id}`, resource);
  }

  // Método para eliminar un recurso
  deleteResource(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/resource/${id}`);
  }
}
