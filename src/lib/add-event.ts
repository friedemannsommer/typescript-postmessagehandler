/// <reference path="../typings/EventTarget.d.ts"/>
import supports from './supports'

export default function (element: EventTarget, type: string, listener: EventListener, capture: boolean): void {
    if (supports(element, 'addEventListener')) {
        element.addEventListener(type, listener, capture)
    } else if (supports(element, 'attachEvent')) {
        element.attachEvent('on' + type, listener)
    }
}
