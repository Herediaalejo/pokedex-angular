// pokemon.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  // Obtener datos de un Pokémon por su ID
  getPokemon(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${id}`);
  }

  // Obtener una lista de Pokémon con un límite opcional
  getPokemonList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon`);
  }

  // Obtener detalles de un Pokémon por su nombre
  getPokemonDetails(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${name}`);
  }

  getPokemonSpecies(url: string): Observable<any> {
    return this.http.get(url);
  }

  getPokemonTypes(url: string): Observable<any> {
    return this.http.get(url);
  }
}
