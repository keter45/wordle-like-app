import { useEffect, useState } from "react";
import "./App.css";
import Line from "./components/Line";
import confetti from "canvas-confetti";
import Keyboard from "./components/Keyboard";

function App() {
  const [solution, setSolution] = useState("");
  const [avaliableChamps, setAvaliableChamps] = useState<string[]>();
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [invalidAnimation, setInvalidAnimation] = useState(false);
  const [keyboardState, setKeyboardState] = useState<LettersState>({
    correct: [],
    incorrect: [],
    almostCorrect: [],
  });

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

          const path = require(`../../../public/voicelines/${solution}.mp3`);
          const audio = new Audio(path);
          audio.volume = 0.5;
          audio.play();
        }
        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        const uniqueLetters = handleKeyboardState(newGuesses, solution);
        setKeyboardState(uniqueLetters);
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
    <div className="app">
      <div className="container">
        <h1>Wordle League of Legends</h1>
        {guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex((val) => val == null);
          return (
            <Line
              guess={isCurrentGuess ? currentGuess : guess ?? ""}
              isFinal={!isCurrentGuess && guess !== null}
              shake={isCurrentGuess ? invalidAnimation : false}
              solution={solution}
              key={i}
            />
          );
        })}
      </div>
      <Keyboard keyboardState={keyboardState} solution={solution} />
    </div>
  );
}
export interface LettersState {
  correct: string[];
  almostCorrect: string[];
  incorrect: string[];
}

const handleKeyboardState = (newGuesses: string[], solution: string) => {
  const wordList = newGuesses.filter((word) => word !== null);
  const usedLettersList: string[] = [];
  const obj: LettersState = {
    correct: [],
    almostCorrect: [],
    incorrect: [],
  };

  wordList.forEach((word) => {
    word.split("").forEach((char, index) => {
      if (char === solution[index]) {
        obj.correct = [...obj.correct, ...new Set(char)];
      } else if (solution.includes(char)) {
        obj.almostCorrect = [...obj.almostCorrect, ...new Set(char)];
      } else {
        obj.incorrect = [...obj.incorrect, ...new Set(char)];
      }
      usedLettersList.push(char);
    });
  });

  return obj;
};
export default App;
