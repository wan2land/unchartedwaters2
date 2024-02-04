// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce<T extends Function>(handle: T, delay = 83): T {
  let timeout = null as ReturnType<typeof setTimeout> | null;
  return function (this: unknown) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const args = arguments; // eslint-disable-line prefer-rest-params
    timeout = setTimeout(() => handle.apply(this, args), delay);
  } as unknown as T;
}
