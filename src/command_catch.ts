import { State } from "./state.js";

export const CATCH_ROLL_MAX = 700;

export async function commandCatch(state: State, name: string) {
  const pokemon = await state.pokeapi.fetchPokemon(name);
  console.log(`Throwing a Pokeball at ${pokemon.name}...`);
  const caught: boolean =
    Math.random() * CATCH_ROLL_MAX > pokemon.base_experience;
  if (caught) {
    console.log(`${pokemon.name} was caught!`);
    state.pokedex[pokemon.name] = pokemon;
  } else {
    console.log(`${pokemon.name} escaped!`);
  }
}
