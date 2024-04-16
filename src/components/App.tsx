import { Dropbox } from "dropbox";
import { useState } from "preact/hooks";
import { Game, GameConfig } from "./Game";

import { Splash } from "./Splash";

export function App() {
  const [gameConfig, setGameConfig] = useState<GameConfig>();
  const [dbx, setDbx] = useState<Dropbox>();

  return (
    <div class="app">
      {gameConfig ? (
        <Game config={gameConfig} dbx={dbx} />
      ) : (
        <Splash dbx={dbx} onChangeDbx={setDbx} onStartGame={setGameConfig} />
      )}

      <div class="app__version">v{APP_VERSION}</div>
    </div>
  );
}
