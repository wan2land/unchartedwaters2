import { debounce } from "../utils/timing";

export function detectFileChange(
  fs: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  path: string,
  handler: () => unknown
) {
  let lastModified = null as number | null;
  const debouncedHandler = debounce(handler, 350);
  setInterval(() => {
    try {
      const modified = (fs as any).fs.stat(path).mtime.getTime() as number; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (lastModified !== modified) {
        if (lastModified) {
          debouncedHandler();
        }
        lastModified = modified;
      }
    } catch (e) {
      lastModified = -1;
    }
  }, 300);
}
