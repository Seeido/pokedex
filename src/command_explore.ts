import { State } from "./state.js";
import { Location } from "./pokeapi.js";

export async function commandExplore(state: State, location: string) {
  const response: Location = await state.pokeapi.fetchLocation(location);
  const pokemons = response.pokemon_encounters.map(
    (pokemonObj) => pokemonObj.pokemon.name,
  );
  if (pokemons.length < 1) {
    console.log("No Pokemon found!");
    return;
  }
  console.log(`Found Pokemon:\n-${pokemons.join("\n-")}`);
}
