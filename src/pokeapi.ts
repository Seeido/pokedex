import { Cache } from "./pokecache.js";
import { z } from "zod";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  #cache: Cache;

  constructor(cacheInterval: number) {
    this.#cache = new Cache(cacheInterval);
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL ? pageURL : PokeAPI.baseURL + "/location-area";
    const cacheObj = this.#cache.get(url);
    if (cacheObj) return cacheObj;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = ShallowLocationsSchema.parse(await response.json());
    this.#cache.add(url, result);
    return result;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const url = PokeAPI.baseURL + `/location-area/${locationName}`;
    const cacheObj = this.#cache.get(url);
    if (cacheObj) return cacheObj;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = LocationSchema.parse(await response.json());
    this.#cache.add(url, result);
    return result;
  }
}

const ShallowLocationSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const ShallowLocationsSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(ShallowLocationSchema),
});

export type ShallowLocations = z.infer<typeof ShallowLocationsSchema>;

const PokemonSchema = z.object({
  pokemon: z.object({
    name: z.string(),
    url: z.string(),
  }),
});

const LocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_encounters: z.array(PokemonSchema),
});

export type Location = z.infer<typeof LocationSchema>;
