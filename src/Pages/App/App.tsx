import { useEffect, useState } from "react";
import "./App.css";
import Line from "./components/Line";
import confetti from "canvas-confetti";

function App() {
  const [solution, setSolution] = useState("");
  const [avaliableChamps, setAvaliableChamps] = useState<string[]>();
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [invalidAnimation, setInvalidAnimation] = useState(false);

  // setInitial Values
  useEffect(() => {
    const fetchChamp = async () => {
      const response = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion.json"
      );
      const { data } = await response.json();
      const names = Object.keys(data).filter(
        (champ: string) => champ.length === 5
      );
      setAvaliableChamps(names.map((n) => n.toLowerCase()));
      const randomChamp =
        names[Math.floor(Math.random() * names.length)].toLowerCase();
      setSolution(randomChamp);
    };
    fetchChamp();
  }, []);

  // handle key event
  useEffect(() => {
    const handleType = (event: KeyboardEvent) => {
      if (isGameOver) {
        return;
      }

      if (event.key === "Enter" && currentGuess.length === 5) {
        const isValid = avaliableChamps?.includes(currentGuess);
        if (!isValid) {
          setAnimation();
          return;
        }
        const isCorrect = solution === currentGuess;
        if (isCorrect) {
          setIsGameOver(isCorrect);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");
      }
      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= 5) {
        return;
      }
      const isLetter = event.key.match(/^[a-z]{1}$/);
      if (isLetter) {
        setCurrentGuess(currentGuess + event.key);
      }
    };

    window.addEventListener("keydown", handleType);
    return () => window.removeEventListener("keydown", handleType);
  });

  function setAnimation() {
    setInvalidAnimation(true);
    setTimeout(() => setInvalidAnimation(false), 500);
  }
  return (
    <div className="container">
      <h1>Wordly League of Legends</h1>
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex((val) => val == null);
        return (
          <Line
            guess={isCurrentGuess ? currentGuess : guess ?? ""}
            isFinal={!isCurrentGuess && guess !== null}
            solution={solution}
            shake={isCurrentGuess ? invalidAnimation : false}
            key={i}
          />
        );
      })}
    </div>
  );
}

export default App;
