import './index.css'

import { createDos } from './dos/create-dos'
import { detectFileChange } from './fs/detect-file-change'
import { createIdbFileSystem } from './fs/create-idb-file-system'
import { blockAddEventListener, restoreAddEventListener, getBlockedHandler } from './event'


const SAVE_FILE_PATH = 'KOUKAI2.DAT'

const KEY_MAPS: Record<string, number> = {
  Digit1: 111, // /
  Digit2: 106, // *
  Digit3: 109, // -
  Digit4: 107, // +

  Escape: 27, // Escape

  ArrowUp: 104, // RightDigit8
  ArrowDown: 98, // RightDigit2
  ArrowLeft: 100, // RightDigit4
  ArrowRight: 102, // RightDigit6

  KeyQ: 101, // RightDigit5
  Enter: 13, // Enter
  Space: 32, // Space
}

function createKeyboardEvent(type: string, keyCode: number) {
  const event = document.createEvent('KeyboardEvent')
  Object.defineProperties(event, {
    type: { get: () => type },
    keyCode: { get: () => keyCode },
    which: { get: () => keyCode },
  })
  return event
}

async function fadeOut(elem: HTMLElement) {
  elem.classList.add('fade-out-start')
  await new Promise((resolve) => setTimeout(resolve, 0))
  elem.classList.add('fade-out-end')
  await new Promise((resolve) => setTimeout(resolve, 500))
  elem.classList.remove('fade-out-start')
  elem.classList.remove('fade-out-end')
  elem.classList.add('hidden')
}

;(async () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const $messageSaveFile = document.getElementById('message-savefile')
  const $buttonHelp = document.getElementById('button-help')
  const $modalHelp = document.getElementById('modal-help')
  const $modalHelpClose = document.getElementById('modal-help-close')

  $buttonHelp.addEventListener('click', () => {
    $modalHelp.classList.remove('hidden')
  })
  $modalHelpClose.addEventListener('click', () => {
    fadeOut($modalHelp)
  })


  blockAddEventListener(document, ['keydown', 'keyup', 'keypress'])


  const db = await createIdbFileSystem('water2', 1)
  const { fs, main } = await createDos(canvas)

  await fs.extract('/static/water2.zip')
  
  const saveFileBody = await db.load<Uint8Array>(SAVE_FILE_PATH)
  if (saveFileBody) {
    // Overwrite Save File
    ;(fs as any).fs.writeFile(SAVE_FILE_PATH, saveFileBody)
  }

  const ci = await main(['-c', 'KOEI.COM'])

  const keydownHandlers = getBlockedHandler(document, 'keydown')
  const keyupHandlers = getBlockedHandler(document, 'keyup')

  restoreAddEventListener(document)

  document.addEventListener('keydown', (e) => {
    if (KEY_MAPS[e.code]) {
      const event = createKeyboardEvent('keydown', KEY_MAPS[e.code])
      keydownHandlers.forEach(handler => handler(event))
    }
  })
  document.addEventListener('keyup', (e) => {
    if (KEY_MAPS[e.code]) {
      const event = createKeyboardEvent('keyup', KEY_MAPS[e.code])
      keyupHandlers.forEach(handler => handler(event))
    }
  })

  detectFileChange(fs, SAVE_FILE_PATH, async () => {
    db.save(SAVE_FILE_PATH, (fs as any).fs.readFile(SAVE_FILE_PATH))

    $messageSaveFile.classList.remove('hidden')
    await new Promise((resolve) => setTimeout(resolve, 500))
    fadeOut($messageSaveFile)
  })
})()
