/* eslint-disable @typescript-eslint/no-explicit-any */
import { once, load } from "nano-loader";

const loadJsDos = once(() => load("/static/js-dos/js-dos.js"));

export async function createDos(
  canvas: HTMLCanvasElement
): Promise<{ fs: any; main: any }> {
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

export function applyMove(elem: HTMLDivElement, consumer: any) {
  window.DosController.Move(elem, consumer);
}
