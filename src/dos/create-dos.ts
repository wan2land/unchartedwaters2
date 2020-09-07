
import { DosFactory, DosRuntime } from 'js-dos'
import { DosKeyEventConsumer } from 'js-dos/dist/typescript/js-dos-ci'

require('js-dos')

const Dos = (window as any).Dos as DosFactory
const DosController = (window as any).DosController as any

export function createDos(canvas: HTMLCanvasElement): Promise<DosRuntime> {
  return new Promise((resolve) => {
    Dos(canvas, {
      wdosboxUrl: '/static/wdosbox.js',
    }).ready((fs, main) => resolve({ fs, main }))
  })
}

export function applyMove(elem: HTMLDivElement, consumer: DosKeyEventConsumer) {
  DosController.Move(elem, consumer)
}
