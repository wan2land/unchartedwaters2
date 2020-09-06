import './index.css'

import { createDos } from './dos/create-dos'
import { detectFileChange } from './fs/detect-file-change'
import { createIdbFileSystem } from './fs/create-idb-file-system'


const SAVE_FILE_PATH = 'KOUKAI2.DAT'

;(async () => {

  const db = await createIdbFileSystem('water2', 1)
  const { fs, main } = await createDos(document.getElementById('canvas') as HTMLCanvasElement)

  await fs.extract('/static/water2.zip')
  
  const saveFileBody = await db.load<Uint8Array>(SAVE_FILE_PATH)
  if (saveFileBody) {
    // Overwrite Save File
    ;(fs as any).fs.writeFile(SAVE_FILE_PATH, saveFileBody)
  }

  const ci = await main(['-c', 'KOEI.COM'])

  detectFileChange(fs, SAVE_FILE_PATH, () => {
    console.log('file saved!')
    db.save(SAVE_FILE_PATH, (fs as any).fs.readFile(SAVE_FILE_PATH))
  })
})()
