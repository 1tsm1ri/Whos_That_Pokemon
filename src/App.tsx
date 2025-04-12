import { useEffect, useState } from "react";
import { getRandomPokemon } from "./services/pokemonapi";
import "./App.css";
import "./index.css";


function App() {
  const [pokemon, setPokemon] = useState({ name: "", image: "" });
  const [userGuess, setUserGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [hintedName, setHintedName] = useState("");

  const correctSound = new Audio("/sounds/correct.mp3");
  const wrongSound = new Audio("/sounds/wrong.mp3");


  const getPokemon = async () => {
    const res = await getRandomPokemon();
    setPokemon({ 
      name: res.name, 
      image: res.image 
    });
    setUserGuess("");
    setRevealed(false);
    setMessage("");
    setHintCount(0);
    setHintedName("_".repeat(res.name.length));
  };


  const successMessages = [
    "Gotta catch 'em all!",
    "You're super effective!",
    "Ash would be proud!",
    "Trainer instincts never fail!",
    "That Pokémon is yours!",
    "That’s how a true Trainer does it!",
  ];


  const handleGuess = () => {
    if (revealed) return;

    const guessName = userGuess.trim().toLowerCase();
    const correctName = pokemon.name.trim().toLowerCase();

    if (guessName === correctName) {
      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
      setMessage(`Correct! ${randomMessage}`);
      setRevealed(true);
      setScore((prev) => prev + 1);
      correctSound.play();

    } else {
      setMessage(`Wrong! Score reset to 0.`);
      setScore(0);
      wrongSound.play();
    }
  };


  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserGuess(e.target.value);
  };


  const giveHint = () => {
    if (hintCount < 3) {
      let unrevealed = [];
  
      for (let i = 0; i < pokemon.name.length; i++) {
        if (hintedName[i] !== pokemon.name[i]) {
          unrevealed.push(i);
        }
      }

      const randomIndex =
        unrevealed[Math.floor(Math.random() * unrevealed.length)];
  
      const newHint = hintedName
        .split("")
        .map((char, i) => (i === randomIndex ? pokemon.name[i] : char))
        .join("");

      setHintedName(newHint);
      setHintCount(hintCount + 1);
    } else if (hintCount === 3 && !revealed) {
      setRevealed(true);
      setHintCount(hintCount + 1);
      setMessage(`Pokémon revealed! Score -1`);

      if (score > 0) setScore((prev) => prev - 1);
      wrongSound.play();
    }
  };
  

  useEffect(() => {
    getPokemon();
  }, []);


  return (
    <>
      <div className="container">

        <h1>Who's That Pokémon?</h1>
        <p>Score: <strong>{score}</strong></p>

        <img
          src={pokemon.image}
          alt="pokémon"
          className={revealed ? "revealed" : "silhouette"}
        />

        <p>
          {revealed
            ? <>Pokémon: <span>{pokemon.name}</span> </>
            : <>Hint: {hintedName.split("").join(" ")}</>}
        </p>

        <div>
          <input type="text" placeholder="The Pokémon is..." value={userGuess} onChange={handleInput} disabled={revealed}
          />
        </div>

        <div>
          <button className="New" onClick={getPokemon}>New Pokémon</button>
          <button className="Buttom" onClick={handleGuess} disabled={revealed}>Guess Pokémon!</button>
          <button className="Buttom" onClick={giveHint} disabled={revealed}>
            {hintCount < 3 ? `Get Hint (${3 - hintCount} left)` : "Reveal Pokémon"}
          </button>
        </div>

        <p>{message}</p>
      </div>
    </>
  );
}

export default App;
