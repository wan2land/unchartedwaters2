/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    Dos: (
      canvas: HTMLCanvasElement,
      options: Record<string, unknown>
    ) => { ready: (resolve: (fs: any, main: any) => void) => void };
    DosController: { Move: any };
  }
}

export {};
