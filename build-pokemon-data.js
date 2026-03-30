const fs = require("node:fs/promises");

const MAX_ID = 1025;
const OUTPUT_FILE = "./pokemon-data.json";
const DELAY_MS = 80;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon ${id}: ${response.status}`);
    }

    const data = await response.json();

    const image = data.sprites?.front_default;
    if (!image) {
        return null;
    }

    const totalStats = data.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    return {
        id: data.id,
        name: data.name,
        image: image,
        total: totalStats
    };
}

async function buildPokemonData() {
    const pokemonList = [];

    for (let id = 1; id <= MAX_ID; id++) {
        try {
            console.log(`Fetching Pokémon ${id}/${MAX_ID}...`);
            const pokemon = await fetchPokemon(id);

            if (pokemon) {
                pokemonList.push(pokemon);
            } else {
                console.log(`Skipping ${id} because it has no front_default sprite.`);
            }
        } catch (error) {
            console.error(`Error on Pokémon ${id}: ${error.message}`);
        }

        await sleep(DELAY_MS);
    }

    await fs.writeFile(
        OUTPUT_FILE,
        JSON.stringify(pokemonList, null, 2),
        "utf8"
    );

    console.log(`Done. Saved ${pokemonList.length} Pokémon to ${OUTPUT_FILE}`);
}

buildPokemonData().catch(error => {
    console.error("Build failed:", error);
    process.exit(1);
});