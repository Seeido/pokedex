import { State } from "./state.js";
import { ShallowLocations } from "./pokeapi.js";

export async function commandMapb(state: State) {
  if (!state.prevLocationsURL) {
    console.log(`you're on the first page`);
    return;
  }
  const response: ShallowLocations = await state.pokeapi.fetchLocations(
    state.prevLocationsURL,
  );
  const locationNames = response.results.map((location) => location.name);
  console.log(locationNames.join("\n"));
  state.nextLocationsURL = response.next;
  state.prevLocationsURL = response.previous;
}
