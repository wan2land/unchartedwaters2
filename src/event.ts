export type EventHandler = (...args: unknown[]) => unknown;

export interface HasAddEventListener {
  addEventListener(event: string, handler: EventHandler): void;
}

const originAddEventListeners = new Map<
  HasAddEventListener,
  HasAddEventListener["addEventListener"]
>();
const blockedEventHandlers = new Map<
  HasAddEventListener,
  Record<string, EventHandler[]>
>();

export function blockAddEventListener(
  target: HasAddEventListener,
  events: string[]
) {
  if (originAddEventListeners.has(target)) {
    restoreAddEventListener(target);
  }
  const originAddEventListener = target.addEventListener;
  originAddEventListeners.set(target, originAddEventListener);
  target.addEventListener = function (event, handler) {
    if (events.includes(event)) {
      let handlers = blockedEventHandlers.get(target);
      if (!handlers) {
        handlers = {};
        blockedEventHandlers.set(target, handlers);
      }
      handlers[event] = handlers[event] ?? [];
      handlers[event].push(handler);
      return;
    }
    return originAddEventListener.apply(this, arguments as any); // eslint-disable-line prefer-rest-params,@typescript-eslint/no-explicit-any
  };
}

export function getBlockedHandler(
  target: HasAddEventListener,
  event: string
): EventHandler[] {
  const handlers = blockedEventHandlers.get(target);
  if (!handlers) {
    return [];
  }
  return handlers[event] ?? [];
}

export function restoreAddEventListener(target: HasAddEventListener) {
  const originAddEventListener = originAddEventListeners.get(target);
  if (originAddEventListener) {
    target.addEventListener = originAddEventListener;
    originAddEventListeners.delete(target);
  }
  blockedEventHandlers.delete(target);
}

export function createKeyboardEvent(type: string, keyCode: number) {
  const event = document.createEvent("KeyboardEvent");
  Object.defineProperties(event, {
    type: { get: () => type },
    keyCode: { get: () => keyCode },
    which: { get: () => keyCode },
  });
  return event;
}
