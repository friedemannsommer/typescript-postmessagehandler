import addEvent from './lib/add-event'
import noop from './lib/noop'
import { IPostMessageEvent } from './typings/PostMessageEvent'

export type MessageListener<T extends unknown[] = unknown[]> = (...args: T) => void

export default class PostMessageHandler<T extends unknown[] = unknown[]> {
    private readonly messageListener: MessageListener<T>[] = []
    private readonly secret: string
    private readonly target: MessageEventSource
    private readonly targetOrigin: string | undefined
    private readonly eventCallback: (evt: MessageEvent) => void
    private readonly isWindow: boolean
    private listenerRegistered = false
    private removeMessageListener: VoidFunction | undefined

    public constructor(secret: string, target: Window, targetOrigin: string)
    public constructor(secret: string, target: MessagePort | ServiceWorker)
    public constructor(secret: string, target: MessageEventSource, targetOrigin?: string) {
        this.isWindow =
            (target as Window).self === target &&
            (target as Window).window === target &&
            typeof window.document === 'object'

        if (this.isWindow && typeof targetOrigin !== 'string') {
            throw new Error('`target` is `window` like which requires an `targetOrigin`, but no `targetOrigin` is set')
        }

        this.targetOrigin = targetOrigin
        this.secret = secret
        this.target = target
        this.eventCallback = (evt: MessageEvent): void => {
            this.handleMessage(evt as IPostMessageEvent)
        }
    }

    /**
     * subscribe to message events
     * @param func function which will be called when an event has been received
     * @returns {Function} function shorthand for calling `PostMessageHandler.unsubscribe`
     */
    public subscribe(func: MessageListener<T>): VoidFunction {
        if (!this.listenerRegistered) {
            this.listenerRegistered = true
            this.removeMessageListener = addEvent(this.target, 'message', this.eventCallback as EventListener, false)
        }

        if (typeof func === 'function') {
            this.messageListener.push(func)

            return (): void => {
                this.unsubscribe(func)
            }
        }

        return noop
    }

    /**
     * remove message event subscription
     * @param func function which should be removed from the message event subscription
     */
    public unsubscribe(func: MessageListener<T>): void {
        const index = this.messageListener.indexOf(func)

        if (index !== -1) {
            this.messageListener.splice(index, 1)
        }

        if (this.listenerRegistered && this.messageListener.length === 0) {
            this.listenerRegistered = false
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.removeMessageListener!()
        }
    }

    /**
     * send the given data to the configured target
     * @param data arguments which should be passed onto the target (must be serializable)
     */
    public send(...data: T): boolean {
        try {
            if (this.isWindow) {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;(this.target as Window).postMessage(this.secret + JSON.stringify(data), this.targetOrigin as string)
            } else {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;(this.target as MessagePort).postMessage(this.secret + JSON.stringify(data))
            }

            return true
        } catch (e) {
            return false
        }
    }

    private handleMessage(event: IPostMessageEvent): void {
        // check if window references match
        if (this.checkEventOrigin(event.origin, event.source)) {
            const dataKey = event.message ? 'message' : 'data'

            if (typeof event[dataKey] !== 'string') {
                return
            }

            const secret = event[dataKey].slice(0, this.secret.length)

            // check if received secret matches
            if (secret === this.secret) {
                this.callListener(JSON.parse(event[dataKey].slice(this.secret.length)))
            }
        }
    }

    private checkEventOrigin(eventOrigin: string, eventSource: MessageEventSource): boolean {
        return eventOrigin === this.targetOrigin && eventSource === this.target
    }

    private callListener(data: T): void {
        const length: number = this.messageListener.length

        for (let index = 0; index < length; index++) {
            this.messageListener[index].apply(undefined, data)
        }
    }
}
