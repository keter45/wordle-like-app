import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [solution, setSolution] = useState("");
  useEffect(() => {
    const fetchChamp = async () => {
      const response = await fetch(
        "http://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion.json"
      );
      const { data } = await response.json();
      const names = Object.keys(data).filter(
        (champ: string) => champ.length === 5
      );
      console.log(names);
      const randomChamp = names[Math.floor(Math.random() * names.length)];
      setSolution(randomChamp);
    };
    fetchChamp();
  }, []);

  return <div>{}</div>;
}

export default App;
