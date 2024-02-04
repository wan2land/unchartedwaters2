import { Dropbox } from "dropbox";
import { useState } from "preact/hooks";
import { Game, GameProps } from "./Game";

import { Splash } from "./Splash";

export function App() {
  const [gameProps, setGameProps] = useState<GameProps>();
  const [dbx, setDbx] = useState<Dropbox>();

  return (
    <div class="app">
      {gameProps ? (
        <Game {...gameProps} dbx={dbx} />
      ) : (
        <Splash dbx={dbx} onChangeDbx={setDbx} onStartGame={setGameProps} />
      )}

      <div class="app__version">v{APP_VERSION}</div>
    </div>
  );
}
