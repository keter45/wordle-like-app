import { FC } from "react";
interface LineProps {
  guess: string;
  isFinal: boolean;
  solution: string;
  shake: boolean;
}
const Line: FC<LineProps> = ({ guess, isFinal, solution, shake }) => {
  const tiles = [];
  for (let i = 0; i < 5; i++) {
    const char = guess[i];
    let className = "tile";

    if (isFinal) {
      if (char === solution[i]) {
        className += " corret";
      } else if (solution.includes(char)) {
        className += " almost-corret";
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
