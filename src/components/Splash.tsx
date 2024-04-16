import { Dropbox, DropboxAuth } from "dropbox";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { GameConfig } from "./Game";

import logo from "../assets/logo.gif";
import { IconDropbox } from "./icon/IconDropbox";
import { IconGithub } from "./icon/IconGithub";

const DBX_CLIENT_ID = "95lb7zut06xyhr8";

/**
 * name: 모드 이름
 * version: 모드 버전
 * mod: 모드 압축 파일 이름, 확장자 제외, `zip -vrj` 명령어로 생성하세요.
 * entry: 실행 파일 이름 (기본값 `KOEI.COM`)
 * saveFile: 세이브 파일 이름 (기본값 `KOUKAI2.DAT`)
 */
const modSettings: {
  name: string;
  version: string;
  help?: string;
  config?: GameConfig;
  parts?: { name: string; config: GameConfig }[];
}[] = [
  {
    name: "버그/번역 교정판",
    version: "v1.08",
    config: {
      mod: "mod_correction_v1.08",
      gameFile: "mod_correction_v1.08.zip",
      saveFile: undefined,
    },
  },
  {
    name: "정화편 (기본판)",
    version: "v3.0",
    config: {
      mod: "mod_junghwa_v3.0",
      gameFile: "mod_junghwa_v3.0.zip",
      saveFile: "CHENGHO.DAT",
    },
  },
  {
    name: "에르네스트 모드",
    version: "v1.11",
    config: {
      mod: "mod_ernst_v1.11",
      gameFile: "mod_ernst_v1.11.zip",
      entry: "PLAY.BAT",
    },
  },
  {
    name: "밀란다 / 살바도르편",
    version: "v161126",
    help: "밀란다 / 살바도르편은 세이브파일이 호환됩니다.",
    parts: [
      {
        name: "- 밀란다 패치1",
        config: {
          mod: "mod_eojeon_161126",
          gameFile: "mod_eojeon_161126_p1.zip",
        },
      },
      {
        name: "- 밀란다 패치2",
        config: {
          mod: "mod_eojeon_161126",
          gameFile: "mod_eojeon_161126_p2.zip",
        },
      },
    ],
  },
];

interface SplashProps {
  dbx: Dropbox | undefined;
  onChangeDbx: (dbx: Dropbox | undefined) => void;
  onStartGame: (gameConfig: GameConfig) => void;
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

  const gameMenuComponents = useMemo(() => {
    return (
      <>
        <button
          type="button"
          class="menu__item"
          onClick={() => onStartGame({})}
        >
          <span>대항해시대2 실행</span>
        </button>
        {modSettings.map(({ name, version, config, help, parts }, modIndex) =>
          config ? (
            <button
              key={modIndex}
              type="button"
              class="menu__item"
              onClick={() => onStartGame(config)}
            >
              <span>{name} 실행</span>
              <span class="italic">{version}</span>
            </button>
          ) : parts ? (
            <div key={modIndex}>
              <div class="menu__title">
                <span>{name}</span>
                <span class="italic">{version}</span>
              </div>
              {help ? <div class="menu__help">{help}</div> : null}
              {parts.map(({ name, config }, partIndex) => (
                <button
                  key={partIndex}
                  type="button"
                  class="menu__item__item"
                  onClick={() => onStartGame(config)}
                >
                  <span>{name} 실행</span>
                </button>
              ))}
            </div>
          ) : null,
        )}
      </>
    );
  }, [onStartGame]);

  return (
    <div class="splash">
      <img src={logo} class="px-4" />
      <div class="menu">
        <div class="corner corner-tl" />
        <div class="corner corner-tr" />
        <div class="corner corner-bl" />
        <div class="corner corner-br" />
        {gameMenuComponents}
      </div>
      <div class="menu">
        {isLoadingDbx ? (
          <div class="menu__item">
            <div class="menu__item__icon size-4">
              <IconDropbox />
            </div>
            <span class="w-[80px]">&nbsp;</span>
          </div>
        ) : dbx ? (
          <button type="button" class="menu__item" onClick={dropboxLogout}>
            <div class="menu__item__icon size-4 fill-blue-500">
              <IconDropbox />
            </div>
            <span>드롭박스 로그아웃</span>
          </button>
        ) : (
          <button type="button" class="menu__item" onClick={dropboxLogin}>
            <div class="menu__item__icon size-4">
              <IconDropbox />
            </div>
            <span>드롭박스 로그인</span>
          </button>
        )}
        <a
          type="button"
          class="menu__item"
          href="https://github.com/wan2land/unchartedwater2"
          target="_blank"
          rel="noreferrer"
        >
          <div class="menu__item__icon size-4">
            <IconGithub />
          </div>
          <span>소스코드 / 버그 리포트</span>
        </a>
      </div>
    </div>
  );
}
