
const originAddEventListners = new Map<any, any>()
const blockedEventHandlers = new Map<any, Record<string, EventHandler[]>>()

export type EventHandler = (...args: any[]) => any

export interface HasAddEventListener {
  addEventListener(event: string, handler: EventHandler): any
}

export function blockAddEventListener(target: HasAddEventListener, events: string[]) {
  if (originAddEventListners.has(target)) {
    restoreAddEventListener(target)
  }
  const originAddEventListener = target.addEventListener
  originAddEventListners.set(target, originAddEventListener)
  target.addEventListener = function (event, handler) {
    if (events.includes(event)) {
      let handlers = blockedEventHandlers.get(target)
      if (!handlers) {
        handlers = {}
        blockedEventHandlers.set(target, handlers)
      }
      handlers[event] = handlers[event] ?? []
      handlers[event].push(handler)
      return
    }
    return originAddEventListener.apply(this, arguments as any)
  }
}

export function getBlockedHandler(target: HasAddEventListener, event: string): EventHandler[] {
  const handlers = blockedEventHandlers.get(target)
  if (!handlers) {
    return []
  }
  return handlers[event] ?? []
}

export function restoreAddEventListener(target: HasAddEventListener) {
  const originAddEventListener = originAddEventListners.get(target)
  if (originAddEventListener) {
    target.addEventListener = originAddEventListener
    originAddEventListners.delete(target)
  }
  blockedEventHandlers.delete(target)
}

export function createKeyboardEvent(type: string, keyCode: number) {
  const event = document.createEvent('KeyboardEvent')
  Object.defineProperties(event, {
    type: { get: () => type },
    keyCode: { get: () => keyCode },
    which: { get: () => keyCode },
  })
  return event
}
