import axios from 'axios';
import { Pokemon } from '../interfaces/pokemon.ts';

export const getRandomPokemon = async (): Promise<Pokemon> => {
    const id = Math.floor(Math.random() * 151) + 1;

    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = response.data;

    const pokemon: Pokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
    };

    return pokemon;
};


