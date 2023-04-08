import supports from './supports'
import noop from './noop'

export interface LegacyEventTarget extends EventTarget {
    attachEvent(event: string, listener: EventListener): boolean

    detachEvent(even: string, listener: EventListener): boolean
}

export default function addEvent<T extends LegacyEventTarget>(
    element: T,
    type: string,
    listener: Parameters<T['addEventListener']>[1],
    capture: boolean
): VoidFunction {
    if (supports(element, 'addEventListener')) {
        element.addEventListener(type, listener, capture)

        return (): void => {
            element.removeEventListener(type, listener, capture)
        }
    }

    if (supports(element, 'attachEvent')) {
        const eventName = 'on' + type

        element.attachEvent(eventName, listener as EventListener)

        return (): void => {
            element.detachEvent(eventName, listener as EventListener)
        }
    }

    return noop
}
