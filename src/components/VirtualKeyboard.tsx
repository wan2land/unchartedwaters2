import { useMemo } from "preact/hooks";
import { Key } from "./Key.tsx";

const enum KeyCode {
  // Original Keypad
  Digit0 = 48,
  Digit1 = 49,
  Digit2 = 50,
  Digit3 = 51,
  Digit4 = 52,
  Digit5 = 53,
  Digit6 = 54,
  Digit7 = 55,
  Digit8 = 56,
  Digit9 = 57,

  Numpad0 = 96,
  Numpad1 = 97,
  Numpad2 = 98,
  Numpad3 = 99,
  Numpad4 = 100,
  Numpad5 = 101,
  Numpad6 = 102,
  Numpad7 = 103,
  Numpad8 = 104,
  Numpad9 = 105,

  NumpadAdd = 107,
  NumpadSubtract = 109,
  NumpadMultiply = 106,
  NumpadDivide = 111,
  NumpadEqual = 187,
  NumpadEnter = 13,

  NumpadDecimal = 110, // .

  PageUp = 33,
  PageDown = 34,

  Enter = 13, // Enter
  Space = 32, // Space

  ArrowLeft = 100,
  ArrowUp = 104,
  ArrowRight = 102,
  ArrowDown = 98,

  Escape = 27, // Escape
}

function handlePrevent(event: MouseEvent) {
  event.preventDefault();
}

export interface VirtualKeyboardProps {
  onKeyUp?: (code: number) => void;
  onKeyDown?: (code: number) => void;
}

export function VirtualKeyboard({ onKeyUp, onKeyDown }: VirtualKeyboardProps) {
  return useMemo(
    () => (
      <div
        class="keyboard"
        onContextMenu={handlePrevent}
        onContextMenuCapture={handlePrevent}
      >
        <div class="col">
          <div class="line">
            <Key
              label="ESC"
              onKeyDown={() => onKeyDown?.(KeyCode.Escape)}
              onKeyUp={() => onKeyUp?.(KeyCode.Escape)}
            />
          </div>
        </div>
        <div class="col">
          <div class="line">
            <Key
              label="/"
              sublabel="Q"
              description="Menu 4"
              onKeyDown={() => onKeyDown?.(KeyCode.NumpadDivide)}
              onKeyUp={() => onKeyUp?.(KeyCode.NumpadDivide)}
            />
            <Key
              label="*"
              sublabel="W"
              description="Menu 3"
              onKeyDown={() => onKeyDown?.(KeyCode.NumpadMultiply)}
              onKeyUp={() => onKeyUp?.(KeyCode.NumpadMultiply)}
            />
            <Key
              label="-"
              sublabel="E"
              description="Menu 2"
              onKeyDown={() => onKeyDown?.(KeyCode.NumpadSubtract)}
              onKeyUp={() => onKeyUp?.(KeyCode.NumpadSubtract)}
            />
          </div>
          <div class="line">
            <Key
              label="7"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit7)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit7)}
            />
            <Key
              label="8"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit8)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit8)}
            />
            <Key
              label="9"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit9)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit9)}
            />
          </div>
          <div class="line">
            <Key
              label="4"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit4)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit4)}
            />
            <Key
              label="5"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit5)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit5)}
            />
            <Key
              label="6"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit6)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit6)}
            />
          </div>
          <div class="line">
            <Key
              label="1"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit1)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit1)}
            />
            <Key
              label="2"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit2)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit2)}
            />
            <Key
              label="3"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit3)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit3)}
            />
          </div>
          <div class="line">
            <Key
              label="0"
              onKeyDown={() => onKeyDown?.(KeyCode.Digit0)}
              onKeyUp={() => onKeyUp?.(KeyCode.Digit0)}
            />
            <Key
              label={
                <>
                  Page
                  <br />
                  Up
                </>
              }
              onKeyDown={() => onKeyDown?.(KeyCode.PageUp)}
              onKeyUp={() => onKeyUp?.(KeyCode.PageUp)}
            />
            <Key
              label={
                <>
                  Page
                  <br />
                  Down
                </>
              }
              onKeyDown={() => onKeyDown?.(KeyCode.PageDown)}
              onKeyUp={() => onKeyUp?.(KeyCode.PageDown)}
            />
          </div>
        </div>
        <div class="col">
          <div class="line">
            <Key
              label="+"
              sublabel="R"
              description="Menu 1"
              onKeyDown={() => onKeyDown?.(KeyCode.NumpadAdd)}
              onKeyUp={() => onKeyUp?.(KeyCode.NumpadAdd)}
            />
          </div>
          <div class="line">
            <Key
              label="="
              onKeyDown={() => onKeyDown?.(KeyCode.NumpadEqual)}
              onKeyUp={() => onKeyUp?.(KeyCode.NumpadEqual)}
            />
          </div>
          <div class="line">
            <Key
              class="key-row-3"
              label="Enter"
              onKeyDown={() => onKeyDown?.(KeyCode.Enter)}
              onKeyUp={() => onKeyUp?.(KeyCode.Enter)}
            />
          </div>
        </div>
      </div>
    ),
    [onKeyUp, onKeyDown]
  );
}
