import { FC } from "react";
interface LineProps {
  guess: string;
  isFinal: boolean;
  shake: boolean;
  solution: string;
}
const Line: FC<LineProps> = ({ guess, isFinal, shake, solution }) => {
  const tiles = [];
  for (let i = 0; i < 5; i++) {
    const char = guess[i];
    let className = "tile";

    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " almost-correct";
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
