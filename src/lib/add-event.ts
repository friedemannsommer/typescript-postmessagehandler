import supports from './supports'

declare global {
    // tslint:disable-next-line: interface-name
    interface EventTarget {
        attachEvent(event: string, listener: EventListener): boolean
    }
}

export default function addEvent(
    element: EventTarget,
    type: string,
    listener: EventListener,
    capture: boolean
): void {
    if (supports(element, 'addEventListener')) {
        element.addEventListener(type, listener, capture)
    } else if (supports(element, 'attachEvent')) {
        element.attachEvent('on' + type, listener)
    }
}
