import type { DosRuntime } from "js-dos";
import type { DosKeyEventConsumer } from "js-dos/dist/typescript/js-dos-ci";
import { once, load } from "nano-loader";

const loadJsDos = once(() => load("/static/js-dos/js-dos.js"));

export async function createDos(
  canvas: HTMLCanvasElement
): Promise<DosRuntime> {
  await loadJsDos();

  return await new Promise((resolve) => {
    window
      .Dos(canvas, {
        wdosboxUrl: "/static/js-dos/wdosbox.js",
        cycles: 10000,
      })
      .ready((fs, main) => resolve({ fs, main }));
  });
}

export function applyMove(elem: HTMLDivElement, consumer: DosKeyEventConsumer) {
  window.DosController.Move(elem, consumer);
}
