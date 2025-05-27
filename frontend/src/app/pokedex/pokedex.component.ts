// pokedex.component.ts
import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { CommonModule } from '@angular/common';

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  game_indices: {
    game_index: number;
  }[];
  cries: {
    latest: string;
  };
}

interface FlavorTextEntry {
  flavor_text: string;
  language: { name: string; url: string };
}

interface SpeciesData {
  flavor_text_entries: FlavorTextEntry[];
}

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css'],
})
export class PokedexComponent {
  currentPokemonIndex: number = 0;
  pokemonList: any[] = [];
  pokemonImage: string = '';
  pokemonCode: string = '';
  pokemonName: string = '';
  pokemonSoundUrl: string = '';
  showDetails: boolean = false;
  pokemonDetails: any;
  isScreenOn: boolean = false;
  showTitle: boolean = false;
  favorites: Set<number> = new Set();
  types: string[] = [];

  constructor(private pokemonService: PokemonService) {}

  turnOnScreen() {
    if (this.isScreenOn) {
      this.isScreenOn = false;
      this.showTitle = false;
      this.showDetails = false;
      this.pokemonDetails = null;
      this.pokemonImage = '';
      this.pokemonName = '';
      this.pokemonCode = '';
    } else {
      this.isScreenOn = true;
      this.showTitle = true;
      this.loadInitialPokemonList();
      this.currentPokemonIndex = 0;

      setTimeout(() => {
        this.showTitle = false;
      }, 2000);
    }
  }

  loadInitialPokemonList() {
    this.pokemonService.getPokemonList().subscribe((data) => {
      this.pokemonList = data.results.map((pokemon: any, index: number) => ({
        ...pokemon,
        id: index + 1,
      }));
      console.log(this.pokemonList);
      if (this.pokemonList.length > 0) {
        this.loadPokemon(this.pokemonList[this.currentPokemonIndex].id);
      }
    });
  }

  loadPokemon(id: number) {
    this.pokemonService.getPokemon(id).subscribe((data: Pokemon) => {
      this.pokemonImage = data.sprites.front_default;
      this.pokemonCode = String(data.game_indices[0]?.game_index ?? 'N/A');
      this.pokemonName = data.name;
      this.pokemonSoundUrl = data.cries?.latest || '';
    });
  }

  changePokemon(direction: number) {
    this.currentPokemonIndex += direction;
    if (this.currentPokemonIndex < 0) {
      this.currentPokemonIndex = 0;
    } else if (this.currentPokemonIndex >= this.pokemonList.length) {
      this.currentPokemonIndex = this.pokemonList.length - 1;
      this.loadMorePokemon();
    }
    this.loadPokemon(this.pokemonList[this.currentPokemonIndex].id);
    this.getPokemonDetails();
  }

  loadMorePokemon() {
    const nextId = this.pokemonList.length + 1;
    const endId = nextId + 20;
    for (let id = nextId; id < endId; id++) {
      this.pokemonService.getPokemon(id).subscribe((pokemon) => {
        this.pokemonList.push({
          name: pokemon.name,
          id,
        });
      });
    }
    console.log(this.pokemonList);
  }

  playSound() {
    if (this.pokemonSoundUrl && this.isScreenOn) {
      const audio = new Audio(this.pokemonSoundUrl);
      audio
        .play()
        .catch((error) => console.error('Error playing sound:', error));
    }
  }

  toggleDetails() {
    if (!this.isScreenOn) {
      return;
    }
    this.showDetails = !this.showDetails;
    if (this.showDetails) {
      this.getPokemonDetails();
    }
  }

  getFormattedPokemonCode(code: string) {
    if (!code) {
      return null;
    }
    return String(code).padStart(3, '0');
  }

  getPokemonDetails() {
    const pokemonId = this.pokemonList[this.currentPokemonIndex]?.id || 1; // Usar el primer Pokémon si el índice no es válido
    this.pokemonService.getPokemon(pokemonId).subscribe((data) => {
      this.pokemonDetails = data;
      this.showTitle = false;

      // Limpiar el array de tipos antes de llenarlo
      this.types = [];

      // Obtener los tipos del Pokémon
      const typeRequests = data.types.map((type: any) =>
        this.pokemonService.getPokemonTypes(type.type.url).toPromise()
      );

      Promise.all(typeRequests).then((typeDataArray) => {
        typeDataArray.forEach((typeData: any) => {
          // Filtrar el nombre en español
          console.log(typeData.names);
          const spanishType = typeData.names
            .find((name: any) => name.language.name === 'es')
            .name.replace(/[áéíóúÁÉÍÓÚ]/g, (match: string) => {
              return {
                á: 'a',
                é: 'e',
                í: 'i',
                ó: 'o',
                ú: 'u',
                Á: 'A',
                É: 'E',
                Í: 'I',
                Ó: 'O',
                Ú: 'U',
              }[match];
            });
          if (spanishType) {
            this.types.push(spanishType);
          }
        });
      });

      // Hacer una llamada para obtener detalles de la especie
      this.pokemonService
        .getPokemonSpecies(data.species.url)
        .subscribe((speciesData) => {
          // Filtrar la descripción en español
          this.pokemonDetails.description =
            speciesData.flavor_text_entries
              .find((entry: FlavorTextEntry) => entry.language.name === 'es')
              ?.flavor_text.replace(/[áéíóúÁÉÍÓÚ]/g, (match: string) => {
                return {
                  á: 'a',
                  é: 'e',
                  í: 'i',
                  ó: 'o',
                  ú: 'u',
                  Á: 'A',
                  É: 'E',
                  Í: 'I',
                  Ó: 'O',
                  Ú: 'U',
                }[match];
              }) || 'No hay descripción disponible';

          console.log(this.pokemonDetails);
        });
    });
  }

  toggleFavorite(pokemonId: number) {
    if (this.favorites.has(pokemonId) && this.isScreenOn) {
      this.favorites.delete(pokemonId);
    } else {
      this.favorites.add(pokemonId);
      console.log(this.favorites);
    }
  }

  isFavorite(pokemonId: number): boolean {
    return this.favorites.has(pokemonId);
  }
}
