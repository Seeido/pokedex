# Pokedex CLI

> **Guided learning project** from Boot.dev's *Build a Pokedex* course, built to practice working with HTTP, REST APIs, caching, and async TypeScript. Not a product.  
> See [Design Notes](#design-notes) for what I learned and where I went beyond the course.

A Pokedex REPL in your terminal, powered by [PokeAPI](https://pokeapi.co/).

It allows you to:

* Page forward and back through location areas (`map`, `mapb`)
* Explore an area to see which Pokémon live there (`explore <area>`)
* Try to catch a Pokémon (`catch <pokemon>`)
* Inspect Pokémon you've caught (`inspect <pokemon>`)
* List your caught Pokémon (`pokedex`)

### Installation

```bash
git clone https://github.com/Seeido/pokedex.git
cd ./pokedex
npm install
npm run build
```

### Usage

Run from the project directory:
```bash
npm start
```

## Design Notes
- **Shared state object.** All commands share one signature, `(state: State) => Promise<void>`, and receive the readline interface, the command registry, the API client, and pagination URLs through it instead of importing globals. Dependencies stay explicit, and commands are easy to test with a fake state.
- **Centralized error handling.** Errors propagate up through awaited calls and are caught in one place, the REPL's line handler, which prints them and keeps the prompt alive. Lower layers don't catch-and-rethrow.
- **Generic, self-contained cache.** `Cache` is generic over the stored value and knows nothing about Pokémon. It wraps values internally with a timestamp and reaps expired entries on an interval. `PokeAPI` owns an instance and uses request URLs as keys.
- **Runtime validation with Zod (beyond the course).** `response.json()` is untyped at runtime, so API responses are validated with Zod schemas before being cached, and the TypeScript types are inferred from those schemas. Bad data fails loudly at the boundary instead of somewhere downstream.
- **Pagination edge case.** `null` from the API means "no more pages," so the initial "not started yet" state uses a separate value. I chose the simpler option and documented it rather than restructuring.
- **Catch probability.** Catch chance falls linearly with base experience: Math.random() * 700 > base_experience, which works out to 1 - baseExp / 700. The ceiling of 700 sits just above the highest base experience in PokeAPI (~608), so weak Pokémon are near-certain catches (~95%), mid-tier ones like Mewtwo are about a coin flip, and the strongest take several tries (~13%) but are never impossible.
