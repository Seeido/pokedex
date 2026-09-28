import { State } from "./state.js";

export async function commandInspect(state: State, name: string) {
  const pokemon = state.pokedex[name];
  if (!pokemon) {
    console.log("you have not caught that pokemon");
    return;
  }
  const message = `Name: ${pokemon.name}
Height: ${pokemon.height}
Weight: ${pokemon.weight}
Stats:
${pokemon.stats.map(({ base_stat, stat }) => `  -${stat.name}: ${base_stat}`).join("\n")}
Types:
${pokemon.types.map(({ type }) => `  - ${type.name}`).join("\n")}`;
  console.log(message);
}
