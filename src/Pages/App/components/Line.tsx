import { FC } from "react";
import { LettersState } from "../App";
interface LineProps {
  guess: string;
  isFinal: boolean;
  shake: boolean;
  keyboardState?: LettersState;
}
const Line: FC<LineProps> = ({ guess, isFinal, shake, keyboardState }) => {
  const tiles = [];
  for (let i = 0; i < 5; i++) {
    const char = guess[i];
    let className = "tile";

    if (isFinal && keyboardState) {
      if (keyboardState.correct.includes(char)) {
        className += " correct";
      } else if (keyboardState.almostCorrect.includes(char)) {
        className += " almost-correct";
      } else if (keyboardState.incorrect.includes(char)) {
        className += " incorrect";
      }
    }

    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }
  return <div className={shake ? "line shake" : "line"}>{tiles}</div>;
};

export default Line;
