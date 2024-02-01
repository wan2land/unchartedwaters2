import { useEffect, useState, useRef, useCallback } from "preact/hooks";
import { Dropbox } from "dropbox";
import fileDialog from "file-dialog";
import { saveAs } from "file-saver";
import nipple from "nipplejs";

import { createDos } from "../dos/create-dos";
import {
  blockAddEventListener,
  restoreAddEventListener,
  getBlockedHandler,
  createKeyboardEvent,
  EventHandler,
} from "../event";
import {
  createIdbFileSystem,
  IdbFileSystem,
} from "../fs/create-idb-file-system";
import { detectFileChange } from "../fs/detect-file-change";
import { VirtualKeyboard } from "./VirtualKeyboard.tsx";

const JOYSTICK_MAPS = [
  105, // ArrowRightUp
  104, // ArrowUp
  103, // ArrowLeftUp
  100, // ArrowLeft
  97, // ArrowLeftDown
  98, // ArrowDown
  99, // ArrowRightDown
  102, // ArrowRight
];

const KEY_ALIAS: Record<string, number> = {
  KeyR: 107, // +
  KeyE: 109, // -
  KeyW: 106, // *
  KeyQ: 111, // /

  // Special
  ArrowLeftDown: 97,
  ArrowRightDown: 99,
  ArrowLeftUp: 103,
  ArrowRightUp: 105,
};
export interface GameProps {
  mod?: string; // water2
  entry?: string;
  saveFile?: string;
  dbx?: Dropbox;
}

export function Game({
  mod = "water2",
  entry = "KOEI.COM",
  saveFile = "KOUKAI2.DAT",
  dbx,
}: GameProps) {
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);

  const [joystickCode, setJoystickCode] = useState<number | null>(null);
  const joystickCodeBefore = useRef<number | null>(null);

  const [enabledToggleFullscreen, setEnabledToggleFullscreen] = useState(false);
  const [enabledToggleKeyboard, setEnabledToggleKeyboard] = useState(true);

  const screen = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const mobileController = useRef<HTMLDivElement>(null);

  const isClearExit = useRef(false);
  const keydownHandlers = useRef<EventHandler[]>([]);
  const keyupHandlers = useRef<EventHandler[]>([]);

  const [toastMessage, setToastMessage] = useState<string | undefined>();
  const [innerToastMessage, setInnerToastMessage] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (toastMessage) {
      setInnerToastMessage(toastMessage);
      const timeout = setTimeout(() => {
        setToastMessage(undefined);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  const database = useRef<IdbFileSystem>();

  const handleResize = useCallback(() => {
    const { width: screenWidth, height: screenHeight } =
      screen.current!.getBoundingClientRect();
    if (screenWidth / 640 > screenHeight / 480) {
      setWidth(~~((screenHeight * 640) / 480));
      setHeight(screenHeight);
    } else {
      setWidth(screenWidth);
      setHeight(~~((screenWidth * 480) / 640));
    }
  }, []);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (isClearExit.current) {
      return;
    }
    e.preventDefault();
    return (e.returnValue =
      "페이지를 벗어나면 저장하지 않은 내용이 날아갈 수 있습니다.");
  }, []);

  const handleFullScreenChange = useCallback(() => {
    setEnabledToggleFullscreen(!!window.document.fullscreenElement);
  }, []);

  const handleKeyDown = useCallback((code: number) => {
    const event = createKeyboardEvent("keydown", code);
    keydownHandlers.current.forEach((handler) => handler(event));
  }, []);

  const handleKeyUp = useCallback((code: number) => {
    const event = createKeyboardEvent("keyup", code);
    keyupHandlers.current.forEach((handler) => handler(event));
  }, []);

  const handleDocumentKeyDown = useCallback(
    (e: KeyboardEvent) => {
      handleKeyDown(KEY_ALIAS[e.code] ?? e.keyCode);
    },
    [handleKeyDown]
  );

  const handleDocumentKeyUp = useCallback(
    (e: KeyboardEvent) => {
      handleKeyUp(KEY_ALIAS[e.code] ?? e.keyCode);
    },
    [handleKeyUp]
  );

  useEffect(() => {
    if (joystickCode === joystickCodeBefore.current) {
      return;
    }
    if (joystickCodeBefore.current) {
      handleKeyUp(joystickCodeBefore.current);
    }
    if (joystickCode) {
      handleKeyDown(joystickCode);
    }
    joystickCodeBefore.current = joystickCode;
  }, [joystickCode]);

  useEffect(() => {
    handleResize();

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    window.addEventListener("resize", handleResize);
    window.addEventListener("beforeunload", handleBeforeUnload);

    start();

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
      document.removeEventListener("keyup", handleDocumentKeyUp);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const start = useCallback(async () => {
    const joystick = nipple.create({
      zone: mobileController.current!,
    });
    blockAddEventListener(document, ["keydown", "keyup", "keypress"]);
    const db = (database.current = await createIdbFileSystem(mod, 1));
    const { fs, main } = await createDos(canvas.current!);
    await fs.extract(`/static/game/${mod}.zip`);
    const saveFileBody = await db.load<Uint8Array>(saveFile);
    if (saveFileBody) {
      // Overwrite Save File
      (fs as any).fs.writeFile(saveFile, saveFileBody);
    }
    await main(["-c", entry]);
    keydownHandlers.current = getBlockedHandler(document, "keydown");
    keyupHandlers.current = getBlockedHandler(document, "keyup");
    restoreAddEventListener(document);

    document.addEventListener("keydown", handleDocumentKeyDown);
    document.addEventListener("keyup", handleDocumentKeyUp);

    joystick.on("move", (e, data) => {
      if (data.force > 0.3) {
        setJoystickCode(
          JOYSTICK_MAPS[(Math.floor((data.angle.degree - 22.5) / 45) + 8) % 8]
        );
      } else {
        setJoystickCode(null);
      }
    });

    joystick.on("end", () => {
      setJoystickCode(null);
    });

    detectFileChange(fs, saveFile, () => {
      db.save(saveFile, (fs as any).fs.readFile(saveFile));
      setToastMessage("세이브 파일이 브라우저에 저장되었습니다.");
      isClearExit.current = true;
      setTimeout(() => {
        isClearExit.current = false;
      }, 5000);
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    const doc = window.document;
    if (!doc.fullscreenElement) {
      doc.documentElement.requestFullscreen();
    } else {
      doc.exitFullscreen();
    }
  }, []);
  const downloadSaveFile = useCallback(async () => {
    if (!database.current) {
      return;
    }
    const data = await database.current.load<Uint8Array>(saveFile);
    if (!data) {
      setToastMessage("🚫 세이브 파일을 찾을 수 없습니다.");
      return;
    }

    const url = URL.createObjectURL(
      new Blob([data], {
        type: "application/octet-stream",
      })
    );
    saveAs(url, saveFile);
  }, []);
  const uploadSaveFile = useCallback(async () => {
    if (!database.current) {
      return;
    }
    const files = await fileDialog();
    if (!files[0]) {
      return;
    }
    database.current.save(
      saveFile,
      new Uint8Array(await files[0].arrayBuffer())
    );
    setToastMessage(
      "세이브 파일이 브라우저에 저장되었습니다.\n새로고침 후 파일을 불러 올 수 있습니다."
    );
  }, []);

  const syncSaveFileToDropbox = useCallback(async () => {
    if (!dbx) {
      setToastMessage("🚫 드롭박스 로그인이 필요합니다.");
      return;
    }
    if (!database.current) {
      return;
    }
    const data = await database.current.load<Uint8Array>(saveFile);
    if (!data) {
      return;
    }
    try {
      await dbx.filesGetMetadata({
        path: `/${mod}/${saveFile}`,
      });
      if (
        !confirm(
          "세이브 파일을 드롭박스에 저정합니다.\n이미 저장된 세이브파일이 삭제될 수도 있습니다.\n계속 진행하시겠습니까?"
        )
      ) {
        return;
      }
    } catch (e) {
      // safe
    }
    try {
      await dbx.filesUpload({
        path: `/${mod}/${saveFile}`,
        contents: data,
        mode: { ".tag": "overwrite" },
      });
      setToastMessage("세이브 파일이 드롭박스에 저장되었습니다.");
    } catch (e) {
      setToastMessage("🚫 세이브파일을 드롭박스에 저장하는데 실패했습니다.");
      console.log(e);
    }
  }, [dbx, mod, saveFile]);

  const syncSaveFileFromDropbox = useCallback(async () => {
    if (!dbx) {
      setToastMessage("🚫 드롭박스 로그인이 필요합니다.");
      return;
    }
    if (!database.current) {
      return;
    }
    try {
      const response = await dbx.filesDownload({
        path: `/${mod}/${saveFile}`,
      });
      if (
        !confirm(
          "세이브 파일을 드롭박스에서 불러옵니다.\n현재 컴퓨터에서 진행중인 세이브파일이 삭제될 수도 있습니다.\n계속 진행하시겠습니까?"
        )
      ) {
        return;
      }
      const fileBlob = (response.result as any).fileBlob as Blob;
      const data = new Uint8Array(await fileBlob.arrayBuffer());
      database.current.save(saveFile, data);
      setToastMessage(
        "세이브 파일을 드롭박스에서 성공적으로 불러왔습니다.<br />새로고침 후 파일을 불러 올 수 있습니다."
      );
    } catch (e) {
      setToastMessage("🚫 세이브파일을 드롭박스에서 불러오는데 실패했습니다.");
      console.log(e);
    }
  }, [dbx, mod, saveFile]);

  const toggleKeyboard = useCallback(() => {
    setEnabledToggleKeyboard(!enabledToggleKeyboard);
  }, [enabledToggleKeyboard]);

  const ignoreStopAndPrevent = useCallback((e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  return (
    <div class="game">
      <div class="tools">
        <div class="top">
          <a
            class="tool-item tool-fullscreen icon"
            title="전체화면"
            onClick={toggleFullscreen}
          >
            {enabledToggleFullscreen ? (
              <svg version="1.1" viewBox="0 0 128 128">
                <path
                  d="M128,12.463c0,-0.735 -0.284,-1.384 -0.848,-1.95l-9.665,-9.664c-0.565,-0.565 -1.213,-0.848 -1.949,-0.848c-0.735,0 -1.383,0.283 -1.948,0.848l-28.146,28.143l-12.204,-12.206c-1.073,-1.074 -2.347,-1.611 -3.816,-1.611c-1.468,0 -2.74,0.537 -3.814,1.611c-1.073,1.074 -1.61,2.345 -1.61,3.814l0,37.976c0,1.47 0.537,2.741 1.61,3.815c1.074,1.074 2.345,1.611 3.814,1.611l37.975,0c1.47,0 2.744,-0.537 3.817,-1.611c1.072,-1.074 1.611,-2.345 1.611,-3.815c0,-1.469 -0.538,-2.741 -1.611,-3.814l-12.207,-12.207l28.144,-28.143c0.563,-0.564 0.847,-1.214 0.847,-1.949Z"
                  style="fill-rule:nonzero;"
                />
                <path
                  d="M58.574,64.003l-37.975,0c-1.469,0 -2.741,0.537 -3.815,1.611c-1.073,1.072 -1.611,2.345 -1.611,3.814c0,1.469 0.538,2.741 1.611,3.814l12.207,12.207l-28.143,28.142c-0.566,0.565 -0.848,1.216 -0.848,1.949c0,0.736 0.282,1.386 0.848,1.951l9.662,9.663c0.566,0.564 1.216,0.845 1.95,0.845c0.735,0 1.385,-0.28 1.95,-0.845l28.143,-28.144l12.206,12.206c1.073,1.073 2.345,1.611 3.814,1.611c1.47,0 2.742,-0.538 3.815,-1.611c1.074,-1.072 1.611,-2.345 1.611,-3.815l0,-37.975c0,-1.469 -0.537,-2.741 -1.61,-3.812c-1.073,-1.074 -2.345,-1.611 -3.815,-1.611Z"
                  style="fill-rule:nonzero;"
                />
              </svg>
            ) : (
              <svg version="1.1" viewBox="0 0 128 128">
                <path
                  d="M52.585,65.916c-0.556,-0.555 -1.195,-0.833 -1.917,-0.833c-0.722,0 -1.362,0.277 -1.917,0.833l-27.667,27.667l-12,-12.002c-1.055,-1.053 -2.304,-1.582 -3.75,-1.582c-1.445,0 -2.695,0.529 -3.751,1.582c-1.055,1.057 -1.583,2.308 -1.583,3.752l0,37.334c0,1.445 0.528,2.694 1.583,3.75c1.057,1.055 2.307,1.583 3.751,1.583l37.334,0c1.445,0 2.694,-0.528 3.75,-1.583c1.055,-1.056 1.583,-2.305 1.583,-3.75c0,-1.444 -0.528,-2.695 -1.583,-3.752l-12,-11.997l27.667,-27.669c0.555,-0.555 0.833,-1.193 0.833,-1.916c0,-0.723 -0.278,-1.36 -0.833,-1.918l-9.5,-9.499Z"
                  style="fill-rule:nonzero;"
                />
                <path
                  d="M126.418,1.583c-1.055,-1.056 -2.305,-1.583 -3.75,-1.583l-37.334,0c-1.444,0 -2.693,0.527 -3.75,1.583c-1.054,1.055 -1.582,2.305 -1.582,3.75c0,1.445 0.528,2.695 1.582,3.75l11.999,12l-27.667,27.667c-0.555,0.556 -0.833,1.194 -0.833,1.917c0,0.722 0.278,1.361 0.833,1.916l9.502,9.501c0.555,0.555 1.192,0.832 1.915,0.832c0.723,0 1.361,-0.277 1.916,-0.832l27.669,-27.667l11.997,11.999c1.057,1.055 2.308,1.584 3.752,1.584c1.445,0 2.694,-0.529 3.75,-1.584c1.055,-1.055 1.582,-2.305 1.582,-3.75l0,-37.334c0.001,-1.446 -0.523,-2.693 -1.581,-3.749Z"
                  style="fill-rule:nonzero;"
                />
              </svg>
            )}
          </a>
          <a
            class="tool-item tool-save icon"
            title="세이브 파일 저장하기"
            onClick={downloadSaveFile}
          >
            <svg version="1.1" viewBox="0 0 128 128">
              <path d="M126.333,35.332c-1.111,-2.665 -2.445,-4.777 -4.001,-6.332l-23.333,-23.334c-1.555,-1.554 -3.666,-2.888 -6.333,-4c-2.665,-1.111 -5.11,-1.666 -7.332,-1.666l-77.334,0c-2.221,0 -4.111,0.777 -5.666,2.333c-1.556,1.555 -2.333,3.444 -2.333,5.667l0,112c0,2.224 0.777,4.113 2.333,5.668c1.555,1.554 3.445,2.332 5.666,2.332l112.001,0c2.223,0 4.112,-0.778 5.667,-2.332c1.554,-1.555 2.331,-3.444 2.331,-5.668l0,-77.333c0,-2.223 -0.555,-4.667 -1.666,-7.335Zm-72.999,-22c0,-0.722 0.264,-1.346 0.792,-1.874c0.528,-0.527 1.153,-0.791 1.875,-0.791l16.001,0c0.72,0 1.345,0.263 1.873,0.791c0.529,0.528 0.793,1.152 0.793,1.874l0,26.667c0,0.724 -0.266,1.348 -0.793,1.876c-0.528,0.526 -1.153,0.791 -1.873,0.791l-16.001,0c-0.722,0 -1.348,-0.264 -1.875,-0.791c-0.528,-0.529 -0.792,-1.152 -0.792,-1.876l0,-26.667Zm42.668,104.002l-64.002,0l0,-32.001l64.002,0l0,32.001Zm21.334,0l-10.67,0l0,-34.668c0,-2.223 -0.778,-4.111 -2.333,-5.667c-1.555,-1.555 -3.444,-2.333 -5.665,-2.333l-69.334,0c-2.223,0 -4.112,0.778 -5.668,2.333c-1.555,1.555 -2.333,3.444 -2.333,5.667l0,34.668l-10.666,0l0,-106.668l10.666,0l0,34.667c0,2.223 0.777,4.111 2.333,5.667c1.556,1.555 3.445,2.333 5.667,2.333l48.002,0c2.221,0 4.112,-0.778 5.666,-2.333c1.554,-1.555 2.333,-3.444 2.333,-5.667l0,-34.667c0.833,0 1.915,0.277 3.25,0.833c1.335,0.555 2.279,1.11 2.834,1.666l23.418,23.417c0.556,0.556 1.111,1.515 1.666,2.876c0.558,1.361 0.834,2.431 0.834,3.209l0,74.667Z" />
            </svg>
          </a>
          <a
            class="tool-item tool-load icon"
            title="세이브 파일 불러오기"
            onClick={uploadSaveFile}
          >
            <svg version="1.1" viewBox="0 0 128 128">
              <path d="M126.994,66.077c-0.982,-2.056 -2.482,-3.632 -4.491,-4.726c-2.012,-1.095 -4.224,-1.642 -6.638,-1.642l-12.874,0l0,-10.729c0,-4.112 -1.476,-7.644 -4.426,-10.594c-2.951,-2.951 -6.482,-4.425 -10.594,-4.425l-36.476,0l0,-2.146c0,-4.112 -1.475,-7.644 -4.425,-10.593c-2.95,-2.951 -6.482,-4.426 -10.594,-4.426l-21.457,0c-4.112,0 -7.644,1.475 -10.594,4.426c-2.95,2.949 -4.425,6.481 -4.425,10.593l0,64.37c0,4.112 1.475,7.643 4.425,10.593c2.95,2.951 6.482,4.426 10.594,4.426l72.954,0c2.993,0 6.122,-0.771 9.387,-2.314c3.263,-1.541 5.854,-3.498 7.776,-5.867l19.781,-24.339c2.056,-2.592 3.083,-5.273 3.083,-8.046c0.001,-1.61 -0.334,-3.128 -1.006,-4.561Zm-118.411,-34.261c0,-1.787 0.625,-3.307 1.877,-4.559c1.251,-1.251 2.771,-1.877 4.56,-1.877l21.457,0c1.788,0 3.307,0.625 4.559,1.877c1.251,1.252 1.877,2.772 1.877,4.559l0,4.292c0,1.788 0.627,3.308 1.878,4.559c1.251,1.251 2.771,1.878 4.559,1.878l38.621,0c1.788,0 3.309,0.626 4.561,1.877c1.25,1.251 1.876,2.771 1.876,4.559l0,10.729l-51.495,0c-3.039,0 -6.169,0.771 -9.388,2.313c-3.218,1.542 -5.811,3.498 -7.778,5.868l-17.164,21.12l0,-57.195Zm109.628,41.438l-19.713,24.339c-1.116,1.386 -2.704,2.57 -4.761,3.552c-2.056,0.984 -3.978,1.476 -5.766,1.476l-72.952,0c-2.369,0 -3.553,-0.783 -3.553,-2.347c0,-0.715 0.402,-1.609 1.207,-2.683l19.713,-24.339c1.162,-1.386 2.759,-2.559 4.794,-3.52c2.033,-0.961 3.944,-1.442 5.733,-1.442l72.952,0c2.369,0 3.553,0.783 3.553,2.347c0,0.762 -0.401,1.633 -1.207,2.617Z" />
            </svg>
          </a>
          {dbx && (
            <>
              <a
                class="tool-item tool-save icon"
                title="세이브 드롭박스에 저장하기"
                onClick={syncSaveFileToDropbox}
              >
                <svg version="1.1" viewBox="0 0 128 128">
                  <path d="M122.431,69.432c-3.712,-4.644 -8.455,-7.654 -14.234,-9.033c1.824,-2.755 2.733,-5.822 2.733,-9.199c0,-4.712 -1.667,-8.734 -4.999,-12.067c-3.333,-3.333 -7.355,-5 -12.066,-5c-4.223,0 -7.911,1.378 -11.066,4.134c-2.621,-6.4 -6.811,-11.533 -12.566,-15.399c-5.755,-3.868 -12.1,-5.801 -19.034,-5.801c-9.422,0 -17.466,3.334 -24.133,10.001c-6.667,6.665 -10,14.71 -10,24.132c0,0.578 0.045,1.534 0.133,2.867c-5.244,2.444 -9.421,6.111 -12.533,10.999c-3.111,4.89 -4.666,10.222 -4.666,16.001c0,8.222 2.923,15.254 8.767,21.099c5.844,5.846 12.877,8.767 21.099,8.767l72.534,0c7.066,0 13.099,-2.501 18.099,-7.5c5,-4.999 7.501,-11.032 7.501,-18.1c-0.001,-5.956 -1.857,-11.255 -5.569,-15.901Zm-37.733,-1.799c-0.424,0.422 -0.922,0.632 -1.499,0.632l-14.933,0l0,23.468c0,0.577 -0.211,1.077 -0.633,1.499c-0.424,0.423 -0.923,0.633 -1.499,0.633l-12.802,0c-0.578,0 -1.078,-0.21 -1.5,-0.633c-0.421,-0.422 -0.633,-0.922 -0.633,-1.499l0,-23.468l-14.934,0c-0.621,0 -1.133,-0.199 -1.532,-0.598c-0.4,-0.4 -0.6,-0.912 -0.6,-1.533c0,-0.534 0.222,-1.068 0.666,-1.601l23.4,-23.399c0.4,-0.4 0.911,-0.6 1.533,-0.6c0.623,0 1.134,0.2 1.534,0.6l23.466,23.466c0.401,0.399 0.599,0.911 0.599,1.534c-0.001,0.576 -0.211,1.078 -0.633,1.499Z" />
                </svg>
              </a>
              <a
                class="tool-item tool-load icon"
                title="세이브 드롭박스에서 불러오기"
                onClick={syncSaveFileFromDropbox}
              >
                <svg version="1.1" viewBox="0 0 128 128">
                  <path d="M122.431,69.432c-3.712,-4.644 -8.455,-7.654 -14.234,-9.033c1.824,-2.755 2.733,-5.822 2.733,-9.199c0,-4.712 -1.667,-8.734 -4.999,-12.067c-3.333,-3.333 -7.355,-5 -12.066,-5c-4.223,0 -7.911,1.378 -11.066,4.134c-2.621,-6.4 -6.811,-11.533 -12.566,-15.399c-5.755,-3.868 -12.1,-5.801 -19.034,-5.801c-9.422,0 -17.466,3.334 -24.133,10.001c-6.667,6.665 -10,14.71 -10,24.132c0,0.578 0.045,1.534 0.133,2.867c-5.244,2.444 -9.421,6.111 -12.533,10.999c-3.111,4.89 -4.666,10.222 -4.666,16.001c0,8.222 2.923,15.254 8.767,21.099c5.844,5.846 12.877,8.767 21.099,8.767l72.534,0c7.066,0 13.099,-2.501 18.099,-7.5c5,-4.999 7.501,-11.032 7.501,-18.1c-0.001,-5.956 -1.857,-11.255 -5.569,-15.901Zm-37.764,2.567l-23.401,23.402c-0.399,0.398 -0.911,0.599 -1.533,0.599c-0.622,0 -1.134,-0.201 -1.534,-0.599l-23.466,-23.468c-0.4,-0.399 -0.599,-0.911 -0.599,-1.533c0,-0.578 0.21,-1.078 0.632,-1.5c0.423,-0.422 0.922,-0.633 1.5,-0.633l14.933,0l0,-23.466c0,-0.578 0.212,-1.078 0.633,-1.501c0.423,-0.421 0.923,-0.632 1.5,-0.632l12.802,0c0.578,0 1.076,0.21 1.5,0.632c0.421,0.423 0.632,0.923 0.632,1.501l0,23.466l14.934,0c0.622,0 1.133,0.2 1.532,0.599c0.4,0.4 0.598,0.911 0.598,1.534c0,0.535 -0.22,1.066 -0.663,1.599Z" />
                </svg>
              </a>
            </>
          )}
        </div>
        <div class="bottom">
          <a
            class="tool-item tool-keyboard icon"
            // :class="{ disabled: !enabledToggleKeyboard }"
            onClick={toggleKeyboard}
          >
            <svg version="1.1" viewBox="0 0 128 128">
              <path d="M125.5,28.1c-1.667,-1.667 -3.679,-2.501 -6.034,-2.501l-110.933,0c-2.355,0 -4.366,0.834 -6.033,2.501c-1.666,1.667 -2.5,3.678 -2.5,6.033l0,59.733c0,2.356 0.834,4.366 2.5,6.033c1.667,1.667 3.678,2.502 6.033,2.502l110.933,0c2.355,0 4.367,-0.835 6.034,-2.502c1.666,-1.667 2.5,-3.677 2.5,-6.033l0,-59.733c0,-2.355 -0.834,-4.366 -2.5,-6.033Zm-6.034,65.766l-110.933,0l0,-59.733l110.933,0l0,59.733Z" />
              <path d="M18.133,85.332l6.4,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.71 -0.355,-1.067 -1.067,-1.067l-6.4,0c-0.711,0 -1.067,0.357 -1.067,1.067l0,6.399c0,0.711 0.356,1.067 1.067,1.067Z" />
              <path d="M18.133,68.267l14.933,0c0.711,0 1.068,-0.357 1.068,-1.068l0,-6.4c0,-0.711 -0.357,-1.066 -1.068,-1.066l-14.933,0c-0.711,0 -1.067,0.355 -1.067,1.066l0,6.4c0,0.711 0.356,1.068 1.067,1.068Z" />
              <path d="M18.133,51.199l6.4,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.355,-1.066 -1.067,-1.067l-6.4,0c-0.711,0 -1.067,0.356 -1.067,1.067l0,6.399c0,0.711 0.356,1.067 1.067,1.067Z" />
              <path d="M92.801,76.799l-57.6,0c-0.712,0 -1.067,0.357 -1.067,1.068l0,6.399c0,0.709 0.355,1.067 1.067,1.067l57.597,0c0.712,0 1.068,-0.356 1.068,-1.067l0,-6.399c0,-0.711 -0.356,-1.068 -1.065,-1.068Z" />
              <path d="M42.667,67.199c0,0.711 0.355,1.068 1.066,1.068l6.4,0c0.711,0 1.066,-0.357 1.066,-1.068l0,-6.4c0,-0.711 -0.354,-1.066 -1.066,-1.066l-6.4,0c-0.711,0 -1.066,0.355 -1.066,1.066l0,6.4Z" />
              <path d="M35.201,51.199l6.399,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.356,-1.066 -1.067,-1.067l-6.399,0c-0.712,0 -1.067,0.356 -1.067,1.067l0,6.399c0,0.711 0.356,1.067 1.067,1.067Z" />
              <path d="M59.733,67.199c0,0.711 0.356,1.068 1.066,1.068l6.4,0c0.711,0 1.068,-0.357 1.068,-1.068l0,-6.4c0,-0.711 -0.357,-1.066 -1.068,-1.066l-6.4,0c-0.71,0 -1.066,0.355 -1.066,1.066l0,6.4Z" />
              <path d="M52.266,51.199l6.4,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.355,-1.066 -1.067,-1.067l-6.4,0c-0.711,0 -1.067,0.356 -1.067,1.067l0,6.399c0,0.711 0.356,1.067 1.067,1.067Z" />
              <path d="M76.8,67.199c0,0.711 0.356,1.068 1.065,1.068l6.401,0c0.711,0 1.066,-0.357 1.066,-1.068l0,-6.4c0,-0.711 -0.355,-1.066 -1.066,-1.066l-6.401,0c-0.709,0 -1.065,0.355 -1.065,1.066l0,6.4Z" />
              <path d="M109.866,76.799l-6.399,0c-0.712,0 -1.068,0.357 -1.068,1.068l0,6.399c0,0.709 0.356,1.067 1.068,1.067l6.399,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.355,-1.068 -1.067,-1.068Z" />
              <path d="M69.333,51.199l6.401,0c0.711,0 1.066,-0.356 1.066,-1.067l0,-6.399c0,-0.711 -0.355,-1.066 -1.066,-1.067l-6.401,0c-0.711,0 -1.066,0.356 -1.066,1.067l0,6.399c0,0.711 0.355,1.067 1.066,1.067Z" />
              <path d="M86.4,51.199l6.399,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.356,-1.066 -1.067,-1.067l-6.399,0c-0.711,0 -1.068,0.356 -1.068,1.067l0,6.399c0,0.711 0.357,1.067 1.068,1.067Z" />
              <path d="M93.866,67.199c0,0.711 0.355,1.068 1.066,1.068l14.933,0c0.712,0 1.068,-0.357 1.068,-1.068l0,-23.466c0,-0.711 -0.355,-1.066 -1.068,-1.067l-6.399,0c-0.711,0 -1.067,0.356 -1.067,1.067l0,16l-7.467,0c-0.711,0 -1.066,0.355 -1.066,1.066l0,6.4l0,0Z" />
            </svg>
          </a>
        </div>
      </div>

      <div
        class="screen"
        style={{
          "--screen-width": `${width}px`,
          "--screen-height": `${height}px`,
        }}
        ref={screen}
      >
        <div class="canvas-container">
          <canvas ref={canvas}></canvas>
        </div>
        <div
          class="event-blocker joystick"
          ref={mobileController}
          onTouchStart={ignoreStopAndPrevent}
          onTouchEnd={ignoreStopAndPrevent}
          onTouchMove={ignoreStopAndPrevent}
        ></div>
        {enabledToggleKeyboard && (
          <VirtualKeyboard onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
        )}
      </div>

      <div class={`message ${toastMessage ? "active" : ""}`}>
        {innerToastMessage}
      </div>
    </div>
  );
}
