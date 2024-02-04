export interface IdbFileSystem {
  save(key: string, data: Uint8Array): Promise<void>;
  load(key: string): Promise<Uint8Array | null>;
}

export async function createIdbFileSystem(
  name: string,
  version?: number
): Promise<IdbFileSystem> {
  const db = await new Promise<IDBDatabase>((resolve) => {
    const idb = window.indexedDB.open(name, version);
    idb.onupgradeneeded = function () {
      this.result.createObjectStore("files");
    };
    idb.onsuccess = function () {
      resolve(this.result);
    };
  });

  return {
    save(key: string, data: Uint8Array): Promise<void> {
      return new Promise<void>((resolve) => {
        const request = db
          .transaction("files", "readwrite")
          .objectStore("files")
          .put(data, key);
        request.onsuccess = function () {
          resolve();
        };
      });
    },
    load(key: string): Promise<Uint8Array | null> {
      return new Promise((resolve) => {
        const request = db
          .transaction("files", "readonly")
          .objectStore("files")
          .get(key);
        request.onsuccess = function (ev) {
          console.log(ev);
          resolve((ev.target as IDBRequest<Uint8Array>).result ?? null);
        };
      });
    },
  };
}
