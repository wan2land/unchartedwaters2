declare global {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  interface Window {
    Dos: (
      canvas: HTMLCanvasElement,
      options: Record<string, unknown>
    ) => { ready: (resolve: (fs: any, main: any) => void) => void };
    DosController: { Move: any };
  }
}

export {};
