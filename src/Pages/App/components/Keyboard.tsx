import { FC } from "react";
import { LettersState } from "../App";
interface KeyboardProps {
  keyboardState?: LettersState;
  solution: string;
}

const keyboardLineList: string[][] = [];
keyboardLineList.push("qwertyuiop".split(""));
keyboardLineList.push("asdfghjkl".split(""));
keyboardLineList.push("⌫zxcvbnm↲".split(""));

const Keyboard: FC<KeyboardProps> = ({ keyboardState, solution }) => {
  const rows = keyboardLineList.map((row, i) => {
    const rowList: any = [];

    const btn = row.map((letter, index) => {
      let className = "game-btn";

      if (i === 2 && (index === 0 || index === row.length - 1)) {
        className += " wide-btn";
      }

      if (keyboardState) {
        if (keyboardState.correct.includes(letter)) {
          className += " correct";
        } else if (keyboardState.almostCorrect.includes(letter)) {
          className += " almost-correct";
        } else if (keyboardState.incorrect.includes(letter)) {
          className += " incorrect";
        }
      }

      return (
        <div
          className={className}
          key={letter}
          onClick={() => {
            handleClick(letter);
          }}
        >
          {letter}
        </div>
      );
    });

    rowList.push(btn);
    return rowList;
  });
  return (
    <div className="game-keyboard">
      <small className="center">Use your keyboard or this virtual</small>
      {rows.map((row, i) => (
        <div className="row" key={"row" + i}>
          {row}
        </div>
      ))}
    </div>
  );
};
const handleClick = (letter: string) => {
  if (letter === "⌫") {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
    return;
  }
  if (letter === "↲") {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    return;
  }
  window.dispatchEvent(new KeyboardEvent("keydown", { key: letter }));
};
export default Keyboard;
