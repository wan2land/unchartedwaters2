import { DosFS } from 'js-dos/dist/typescript/js-dos-fs'
import { debounce } from '../utils'

export function detectFileChange(fs: DosFS, path: string, handler: () => any) {
  let lastModified = null as number | null
  let debouncedHandler = debounce(handler, 350)
  setInterval(() => {
    try {
      const modified = (fs as any).fs.stat(path).mtime.getTime() as number
      if (lastModified !== modified) {
        if (lastModified) {
          debouncedHandler()
        }
        lastModified = modified
      }
    } catch (e) {
      lastModified = -1
    }
  }, 300)
}
