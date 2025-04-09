import { useEffect, useState } from "react";
import { getRandomPokemon } from "./services/pokemonapi";
import "./App.css";

function App() {
  const [pokemon, setPokemon] = useState({ name: "", image: "" });
  const [userGuess, setUserGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  const correctSound = new Audio("/sounds/correct.mp3");
  const wrongSound = new Audio("/sounds/wrong.mp3");

  const getPokemon = async () => {
    const res = await getRandomPokemon();
    setPokemon ({ 
      name: res.name, 
      image: res.image 
    });
    setUserGuess("");
    setRevealed(false);
    setMessage("");
  };

  const handleGuess = () => {
    if (revealed) return;

    const guessName = userGuess.trim().toLowerCase();
    const correctName = pokemon.name.trim().toLowerCase();

    if (guessName === correctName) {
      setMessage(`Correct! It's ${pokemon.name}`);
      setRevealed(true);
      setScore((prev) => prev + 1);
      correctSound.play();
      
    } else {
      setMessage("Wrong! Score reset to 0.");
      setScore(0);
      wrongSound.play();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserGuess(e.target.value);
  };

  useEffect(() => {
    getPokemon();
  }, []);

  return (
    <>
      <h1>Who's That Pokémon?</h1>
      <p>Score: <strong>{score}</strong></p>

      <img
        src={pokemon.image}
        alt="pokémon"
        className={revealed ? "revealed" : "silhouette"}
      />

      <div>
        <input
          type="text"
          placeholder="The Pokémon is..."
          value={userGuess}
          onChange={handleInput}
        />
      </div>

      <div>
        <button className="New" onClick={getPokemon}>New Pokémon</button>
        <button className="Guess" onClick={handleGuess} disabled={revealed}>Guess Pokémon!</button>
      </div>

      <p>{message}</p>
    </>
  );
}

export default App;