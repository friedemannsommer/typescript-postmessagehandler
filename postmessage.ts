/// <reference path="./typings/PostMessageEvent.d.ts" />
/// <reference path="./typings/JSON3.d.ts" />

import bind from './lib/bind';
import addEvent from './lib/add-event';
import isFunction from './lib/is-function';
import removeEvent from './lib/remove-event';
// import non typescript library
import JSON3Lib = require('./lib/json3.js');
import JSON3 = JSON_Module.JSON3;
var JSONLib:JSON3 = JSON3Lib;

class PostMessageHandler {
    private listenerRegistered:boolean = false;
    private messageListener:Array<Function> = [];
    private secret:string;
    private target:Window;
    private targetOrigin:string;
    private eventCallback:EventListener;
    private static JSON:JSON3 = JSONLib.noConflict();

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
        var index:number = this.messageListener.indexOf(fn);

        if (index > -1) {
            this.messageListener.splice(index, 1);
        }

        if (this.messageListener.length <= 0) {
            PostMessageHandler.removeListener(this.eventCallback);
            this.listenerRegistered = false;
        }
    }

    public send(...data):boolean {
        var userData:string = PostMessageHandler.serialize(data);

        userData = this.secret + userData;

        if (isFunction(this.target.postMessage)) {
            try {
                this.target.postMessage(userData, this.targetOrigin);
                return true;
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

    private checkEventSecret(eventMessage:string):boolean {
        return eventMessage.slice(0, this.secret.length) == this.secret;
    }

    private handleMessage(e:PostMessageEvent):void {
        var origin:string = e.origin || e.originalEvent.origin,
            source:Window = e.source || e.srcElement,
            dataKey:string = e.message ? 'message' : 'data';

        if (this.checkEventOrigin(origin, source) && typeof e[dataKey] === 'string') {
            if (this.checkEventSecret(e[dataKey])) {
                this.callListener(PostMessageHandler.parse(e[dataKey].slice(this.secret.length)));
            }
        }
    }

    private callListener(data:Array<any>):void {
        for (let i = 0; i < this.messageListener.length; i++) {
            this.messageListener[i].apply(undefined, data);
        }
    }
}

export default PostMessageHandler;
