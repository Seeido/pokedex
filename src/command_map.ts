import { State } from "./state.js";
import { ShallowLocations } from "./pokeapi.js";

export async function commandMap(state: State) {
  if (state.nextLocationsURL === null) {
    console.log(`you're on the last page`);
    return;
  }
  const response: ShallowLocations = await state.pokeapi.fetchLocations(
    state.nextLocationsURL,
  );
  const locationNames = response.results.map((location) => location.name);
  console.log(locationNames.join("\n"));
  state.nextLocationsURL = response.next;
  state.prevLocationsURL = response.previous;
}
