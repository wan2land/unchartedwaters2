import type { DosFactory } from "js-dos";

declare global {
  interface Window {
    Dos: DosFactory;
    DosController: { Move };
  }
}
