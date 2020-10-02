
export interface IdbFileSystem {
  save(key: string, data: any): Promise<void>
  load<T>(key: string): Promise<T | null>
}

export async function createIdbFileSystem(name: string, version?: number): Promise<IdbFileSystem> {
  const db = await new Promise<IDBDatabase>(resolve => {
    const idb = window.indexedDB.open(name, version)
    idb.onupgradeneeded = function () {
      this.result.createObjectStore('files')
    }
    idb.onsuccess = function () { resolve(this.result) }
  })
  
  return {
    save(key: string, data: any): Promise<void> {
      return new Promise<void>(resolve => {
        const request = db.transaction('files', 'readwrite').objectStore('files').put(data, key)
        request.onsuccess = function () {
          resolve()
        }
      })
    },
    load<T>(key: string): Promise<T | null> {
      return new Promise(resolve => {
        const request = db.transaction('files', 'readonly').objectStore('files').get(key)
        request.onsuccess = function (ev) {
          resolve((ev.target as any).result ?? null)
        }  
      })
    },
  }
}
