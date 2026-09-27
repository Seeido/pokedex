import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  #cache: Cache;

  constructor(cacheInterval: number) {
    this.#cache = new Cache(cacheInterval);
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    let url = pageURL ? pageURL : PokeAPI.baseURL + "/location-area";
    const cacheObj = this.#cache.get(url);
    if (cacheObj) return cacheObj;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    this.#cache.add(url, result);
    return result;
  }

  //   async fetchLocation(locationName: string): Promise<Location> {
  //     // implement this
  //   }
}

export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ShallowLocation[];
};

export type ShallowLocation = {
  name: string;
  url: string;
};

export type Location = {};
