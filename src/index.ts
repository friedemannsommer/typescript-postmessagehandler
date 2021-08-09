import addEvent from './lib/add-event'
import bind, { BindFn } from './lib/bind'
import getType from './lib/get-type'
import isFunction from './lib/is-function'
import removeEvent from './lib/remove-event'
import { IPostMessageEvent } from './typings/PostMessageEvent'

class PostMessageHandler<T extends unknown[] = unknown[]> {
    private static registerListener(func: EventListener): void {
        addEvent(window, 'message', func, false)
    }

    private static removeListener(func: EventListener): void {
        removeEvent(window, 'message', func)
    }

    private readonly messageListener: BindFn<T>[] = []
    private readonly secret: string
    private readonly target: MessageEventSource
    private readonly targetOrigin: string | undefined
    private readonly eventCallback: EventListener
    private readonly isWindow: boolean
    private listenerRegistered = false

    public constructor(secret: string, target: Window, targetOrigin: string)
    public constructor(secret: string, target: MessagePort | ServiceWorker)
    public constructor(secret: string, target: MessageEventSource, targetOrigin?: string) {
        this.isWindow = (target as Window).self === target && (target as Window).window === target && typeof window.document === 'object'

        if (this.isWindow && getType(targetOrigin) !== 'string') {
            throw new Error('`target` is `window` like which requires an `targetOrigin`, but no `targetOrigin` is set')
        }

        this.targetOrigin = targetOrigin
        this.secret = secret
        this.target = target
        this.eventCallback = bind(this.handleMessage, this) as EventListener
    }

    /**
     * subscribe to message events
     * @param func function which will be called if a message event has been dispatched
     * @returns {Function} which can be called as a shorthand for calling `PostMessageHandler.unsubscribe`
     */
    public subscribe(func: BindFn<T>): () => void {
        if (!this.listenerRegistered) {
            this.listenerRegistered = true
            PostMessageHandler.registerListener(this.eventCallback)
        }

        if (isFunction(func)) {
            this.messageListener.push(func)
        }

        return () => {
            this.unsubscribe(func)
        }
    }

    /**
     * remove message event subscription
     * @param func function which should be removed from the message event subscription
     */
    public unsubscribe(func: BindFn<T>): void {
        const index: number = this.messageListener.indexOf(func)

        if (index > -1) {
            this.messageListener.splice(index, 1)
        }

        if (this.messageListener.length <= 0) {
            PostMessageHandler.removeListener(this.eventCallback)
            this.listenerRegistered = false
        }
    }

    /**
     * "send" the given data to the given target
     * @param data arguments which should be passed onto the target (should be serializable)
     */
    public send(...data: T): boolean {
        if (isFunction(this.target.postMessage)) {
            try {
                if (this.isWindow) {
                    (this.target as Window).postMessage(this.secret + JSON.stringify(data), this.targetOrigin as string)
                    return true
                } else {
                    (this.target as MessagePort).postMessage(this.secret + JSON.stringify(data))
                    return true
                }
            } catch (e) {
                // silence is golden
            }
        }

        return false
    }

    private checkEventOrigin(eventOrigin: string, eventSource: Window): boolean {
        return eventOrigin === this.targetOrigin && eventSource === this.target
    }

    private handleMessage(event: IPostMessageEvent): void {
        const dataKey = (event.message) ? 'message' : 'data'
        const secret: string = (getType(event[dataKey]) === 'string') ? event[dataKey].slice(0, this.secret.length) : ''
        const data: string = (getType(event[dataKey]) === 'string') ? event[dataKey].slice(this.secret.length) : ''

        // check if window references match
        if (this.checkEventOrigin(event.origin, event.source)) {
            // check if secret match
            if (secret === this.secret) {
                this.callListener(JSON.parse(data))
            }
        }
    }

    private callListener(data: T): void {
        const length: number = this.messageListener.length
        let index = -1

        while (++index < length) {
            this.messageListener[index].apply(undefined, data)
        }
    }
}

export default PostMessageHandler
