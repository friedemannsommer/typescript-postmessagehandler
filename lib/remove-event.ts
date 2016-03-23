/// <reference path="../typings/EventTarget.d.ts"/>
import supports from './supports';

export default function (element:EventTarget, type:string, listener:EventListener):void {
    if (supports(element, "removeEventListener")) {
        element.removeEventListener(type, listener);
    }
    else if (supports(element, "detachEvent")) {
        element.detachEvent("on" + type, listener);
    }
}