import { Dropbox, DropboxAuth } from "dropbox";
import { useCallback, useEffect, useState } from "preact/hooks";
import { GameProps } from "./Game";

import logo from "../assets/logo.gif";
import { IconDropbox } from "./icon/IconDropbox";

const DBX_CLIENT_ID = "95lb7zut06xyhr8";

interface SplashProps {
  dbx: Dropbox | undefined;
  onChangeDbx: (dbx: Dropbox | undefined) => void;
  onStartGame: (gameProps: GameProps) => void;
}

export function Splash({ dbx, onChangeDbx, onStartGame }: SplashProps) {
  const [isLoadingDbx, setIsLoadingDbx] = useState<boolean>(true);

  const dropboxLogin = useCallback(() => {
    location.href = new DropboxAuth({
      clientId: DBX_CLIENT_ID,
    }).getAuthenticationUrl(location.href.replace(/\/+$/, ""));
  }, []);

  const dropboxLogout = useCallback(() => {
    window.localStorage.removeItem("dbx_access_token");
    onChangeDbx(undefined);
  }, [onChangeDbx]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    const dbxAccessToken =
      searchParams.get("access_token") ||
      window.localStorage.getItem("dbx_access_token") ||
      null;

    if (location.hash) {
      history.replaceState({}, "", location.href.replace(location.hash, ""));
    }

    if (dbxAccessToken) {
      const dbx = new Dropbox({ accessToken: dbxAccessToken });
      dbx
        .usersGetCurrentAccount()
        .then(() => {
          window.localStorage.setItem("dbx_access_token", dbxAccessToken);
          onChangeDbx(dbx);
        })
        .catch(() => {
          dropboxLogout();
        })
        .finally(() => {
          setIsLoadingDbx(false);
        });
    } else {
      setIsLoadingDbx(false);
    }
  }, [dropboxLogout, onChangeDbx]);

  const startGameOriginal = useCallback(() => {
    onStartGame({});
  }, [onStartGame]);
  const startGameJunghwaMod = useCallback(() => {
    onStartGame({
      mod: "mod_junghwa_v3.0",
      saveFile: "CHENGHO.DAT",
    });
  }, [onStartGame]);
  const startGameErnestMod = useCallback(() => {
    onStartGame({
      mod: "mod_ernst_v1.11",
      entry: "PLAY.BAT",
    });
  }, [onStartGame]);

  return (
    <div class="splash">
      <img src={logo} />
      <div class="menu">
        <div class="corner corner-tl" />
        <div class="corner corner-tr" />
        <div class="corner corner-bl" />
        <div class="corner corner-br" />
        <button type="button" class="menu__item" onClick={startGameOriginal}>
          대항해시대2 플레이
        </button>
        <button type="button" class="menu__item" onClick={startGameJunghwaMod}>
          정화편(v3.0) 플레이
        </button>
        <button type="button" class="menu__item" onClick={startGameErnestMod}>
          에르네스트 모드(v1.11) 플레이
        </button>
      </div>
      {!isLoadingDbx && (
        <div class="menu">
          {dbx ? (
            <button
              type="button"
              class="menu__item menu__item--has-icon"
              onClick={dropboxLogout}
            >
              <div className="size-6">
                <IconDropbox />
              </div>
              <span>로그아웃</span>
            </button>
          ) : (
            <button
              type="button"
              class="menu__item menu__item--has-icon"
              onClick={dropboxLogin}
            >
              <div className="size-6">
                <IconDropbox />
              </div>
              <span>로그인</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
