/// <reference path="./typings/PostMessageEvent.d.ts" />
/// <reference path="./typings/JSON3.d.ts" />

import bind from './lib/bind';
import getType from './lib/get-type';
import addEvent from './lib/add-event';
import isFunction from './lib/is-function';
import removeEvent from './lib/remove-event';
// import non typescript library
import JSON3Lib = require('./lib/json3');

class PostMessageHandler {
    private listenerRegistered:boolean = false;
    private messageListener:Array<Function> = [];
    private secret:string;
    private target:Window;
    private targetOrigin:string;
    private eventCallback:EventListener;
    private static JSON:JSON3 = (<JSON3>JSON3Lib).noConflict();

    public constructor(secret:string, target:Window, targetOrigin:string) {
        this.secret = secret;
        this.target = target;
        this.targetOrigin = targetOrigin;
        this.eventCallback = <EventListener>bind(this.handleMessage, this);
    }

    public subscribe(fn:Function) {
        if (!this.listenerRegistered) {
            this.listenerRegistered = true;
            PostMessageHandler.registerListener(this.eventCallback);
        }

        if (isFunction(fn)) {
            this.messageListener.push(fn);
        }
    }

    public unsubscribe(fn:Function) {
        let index:number = this.messageListener.indexOf(fn);

        if (index > -1) {
            this.messageListener.splice(index, 1);
        }

        if (this.messageListener.length <= 0) {
            PostMessageHandler.removeListener(this.eventCallback);
            this.listenerRegistered = false;
        }
    }

    public send(...data):boolean {
        let userData:string = PostMessageHandler.serialize(data);
        userData = this.secret + userData;

        if (isFunction(this.target.postMessage)) {
            try {
                this.target.postMessage(userData, this.targetOrigin);
                return true;
            } catch (e) {

            }
        }

        return false;
    }

    private static registerListener(fn:EventListener):void {
        addEvent(window, 'message', fn, false);
    }

    private static removeListener(fn:EventListener):void {
        removeEvent(window, 'message', fn);
    }

    private static parse(data:string):Array<any> {
        return PostMessageHandler.JSON.parse(data);
    }

    private static serialize(data:Array<any>):string {
        return PostMessageHandler.JSON.stringify(data);
    }

    private checkEventOrigin(eventOrigin:string, eventSource:Window):boolean {
        return eventOrigin === this.targetOrigin && eventSource === this.target;
    }

    private handleMessage(e:PostMessageEvent):void {
        let origin:string = e.origin || e.originalEvent.origin,
            source:Window = e.source || e.originalEvent.source,
            dataKey:string = (e.message) ? 'message' : 'data',
            secret:string = (getType(e[dataKey]) == 'string') ? e[dataKey].slice(0, this.secret.length) : '',
            data:string = (getType(e[dataKey]) == 'string') ? e[dataKey].slice(this.secret.length) : '';

        // check if window references match
        if (this.checkEventOrigin(origin, source)) {
            // check if secret match
            if (secret == this.secret) {
                this.callListener(PostMessageHandler.parse(data));
            }
        }
    }

    private callListener(data:Array<any>):void {
        let index:number = -1,
            len:number = this.messageListener.length >>> 0;

        while (++index < len) {
            this.messageListener[index].apply(undefined, data);
        }
    }
}

export default PostMessageHandler;
