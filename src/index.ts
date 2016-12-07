/// <reference path="./typings/PostMessageEvent.d.ts" />
/// <reference path="./typings/JSON3.d.ts" />

import addEvent from './lib/add-event'
import bind from './lib/bind'
import getType from './lib/get-type'
import isFunction from './lib/is-function'
import removeEvent from './lib/remove-event'
import JSON3 = require('json3')

class PostMessageHandler {
    private static JSON = JSON3.noConflict()

    private static registerListener(func: EventListener): void {
        addEvent(window, 'message', func, false)
    }

    private static removeListener(func: EventListener): void {
        removeEvent(window, 'message', func)
    }

    private static parse(data: string): any[] {
        return PostMessageHandler.JSON.parse(data)
    }

    private static serialize(data: any[]): string {
        return PostMessageHandler.JSON.stringify(data)
    }

    private listenerRegistered: boolean = false
    private messageListener: Function[] = []
    private secret: string
    private target: Window
    private targetOrigin: string
    private eventCallback: EventListener

    public constructor(secret: string, target: Window, targetOrigin: string) {
        this.secret = secret
        this.target = target
        this.targetOrigin = targetOrigin
        this.eventCallback = <EventListener>bind(this.handleMessage, this)
    }

    public subscribe(func: Function) {
        if (!this.listenerRegistered) {
            this.listenerRegistered = true
            PostMessageHandler.registerListener(this.eventCallback)
        }

        if (isFunction(func)) {
            this.messageListener.push(func)
        }
    }

    public unsubscribe(func: Function) {
        let index: number = this.messageListener.indexOf(func)

        if (index > -1) {
            this.messageListener.splice(index, 1)
        }

        if (this.messageListener.length <= 0) {
            PostMessageHandler.removeListener(this.eventCallback)
            this.listenerRegistered = false
        }
    }

    public send(...data: any[]): boolean {
        let userData: string = PostMessageHandler.serialize(data)
        userData = this.secret + userData

        if (isFunction(this.target.postMessage)) {
            try {
                this.target.postMessage(userData, this.targetOrigin)
                return true
            } catch (e) {
                // silence is golden
            }
        }

        return false
    }

    private checkEventOrigin(eventOrigin: string, eventSource: Window): boolean {
        return eventOrigin === this.targetOrigin && eventSource === this.target
    }

    private handleMessage(event: PostMessageEvent): void {
        const dataKey: string = (event.message) ? 'message' : 'data'
        const secret: string = (getType(event[dataKey]) === 'string') ? event[dataKey].slice(0, this.secret.length) : ''
        const data: string = (getType(event[dataKey]) === 'string') ? event[dataKey].slice(this.secret.length) : ''

        // check if window references match
        if (this.checkEventOrigin(event.origin, event.source)) {
            // check if secret match
            if (secret === this.secret) {
                this.callListener(PostMessageHandler.parse(data))
            }
        }
    }

    private callListener(data: any[]): void {
        const len: number = this.messageListener.length
        let index: number = -1

        while (++index < len) {
            this.messageListener[index].apply(undefined, data)
        }
    }
}

export default PostMessageHandler
