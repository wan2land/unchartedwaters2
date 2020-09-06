/* eslint-disable prefer-rest-params, no-invalid-this, @typescript-eslint/no-this-alias, @typescript-eslint/ban-types */

export function debounce<T extends Function>(handle: T, delay = 83): T {
  let timeout = null as any
  return function (this: any) {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    const self = this
    const args = arguments
    timeout = setTimeout(() => handle.apply(self, args), delay)
  } as any as T
}
