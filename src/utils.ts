export function debounce<T extends Function>(handle: T, delay = 83): T {
  let timeout = null as any;
  return function (this: any) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    const self = this;
    const args = arguments;
    timeout = setTimeout(() => handle.apply(self, args), delay);
  } as any as T;
}

export function parseQueryString(str: string) {
  const ret = {} as Record<string, any>;
  str = str.trim().replace(/^(\?|#|&)/, "");
  if (!str) {
    return ret;
  }

  str.split("&").forEach((param) => {
    const parts = param.replace(/\+/g, " ").split("=");
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    let key = parts.shift() as string;
    let val = parts.length > 0 ? parts.join("=") : null;

    key = decodeURIComponent(key);

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val ? decodeURIComponent(val) : null;

    if (typeof ret[key] === "undefined") {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }
  });

  return ret;
}
