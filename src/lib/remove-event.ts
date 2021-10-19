import supports from './supports'

declare global {
    // tslint:disable-next-line: interface-name
    interface EventTarget {
        detachEvent(event: string, listener: EventListener): boolean
    }
}

export default function removeEvent(element: EventTarget, type: string, listener: EventListener): void {
    if (supports(element, 'removeEventListener')) {
        element.removeEventListener(type, listener)
    } else if (supports(element, 'detachEvent')) {
        element.detachEvent('on' + type, listener)
    }
}
