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

;(async () => {
  blockAddEventListener(document, ['keydown', 'keyup', 'keypress'])

  const canvas = document.getElementById('canvas') as HTMLCanvasElement

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
    console.log('keydown', e.key, e.code, e.keyCode, e.which)
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

  detectFileChange(fs, SAVE_FILE_PATH, () => {
    console.log('file saved!')
    db.save(SAVE_FILE_PATH, (fs as any).fs.readFile(SAVE_FILE_PATH))
  })
})()
