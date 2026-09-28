import { State } from "./state.js";

export async function commandPokedex(state: State) {
  if (Object.keys(state.pokedex).length < 1) {
    console.log(`You haven't caught any Pokemon`);
    return;
  }
  const message = `Your Pokedex:
${Object.values(state.pokedex)
  .map((pokemon) => ` - ${pokemon.name}`)
  .join("\n")}`;
  console.log(message);
}
