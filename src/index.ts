import addEvent, { LegacyEventTarget } from './lib/add-event'
import noop from './lib/noop'
import { PostMessageEvent } from './typings/PostMessageEvent'
import { TargetOriginMissingError } from './lib/error'

/**
 * Alias for a function which accepts `T`.
 *
 * @typeParam T - Event data
 */
export type MessageListener<T extends unknown[] = unknown[]> = (...args: T) => void

/**
 * Constructs a new message handler with the given `secret` and `target`
 *
 * @typeParam T - Event data
 */
export class PostMessageHandler<T extends unknown[] = unknown[]> {
    private readonly messageListener: MessageListener<T>[] = []
    private readonly secret: string
    private readonly target: MessageEventSource & LegacyEventTarget
    private readonly targetOrigin: string | undefined
    private readonly eventCallback: (evt: MessageEvent) => void
    private readonly isWindow: boolean
    private listenerRegistered = false
    private removeMessageListener: VoidFunction | undefined

    /**
     * Constructs a new instance which will register event listeners for the given window.
     *
     * @param secret - A secret which should be unique to this instance, which both the sender and receiver must know.
     * @param target - `Window` reference to communicate with.
     * @param targetOrigin - Must be the origin of the given `Window`.
     *
     * @throws {@link TargetOriginMissingError}
     * Thrown if `targetOrigin` isn't a `string`.
     */
    public constructor(secret: string, target: Window, targetOrigin: string)

    /**
     * Constructs a new instance which will register event listeners for the given event target.
     *
     * @param secret - A secret which should be unique to this instance, which both the sender and receiver must know.
     * @param target - Message event target to communicate with.
     */
    public constructor(secret: string, target: MessagePort | ServiceWorker)
    public constructor(secret: string, target: MessageEventSource, targetOrigin?: string) {
        this.isWindow =
            (target as Window).self === target &&
            (target as Window).window === target &&
            typeof target.document === 'object'

        if (this.isWindow && typeof targetOrigin !== 'string') {
            throw new TargetOriginMissingError(target as Window)
        }

        this.targetOrigin = targetOrigin
        this.secret = secret
        this.target = target as MessageEventSource & LegacyEventTarget
        this.eventCallback = (evt: MessageEvent): void => {
            this.handleMessage(evt)
        }
    }

    /**
     * Adds the given function as listener for message events.
     *
     * @param func - A function which should be called when an event has been received.
     * @returns A wrapper function for calling {@link PostMessageHandler.unsubscribe | unsubscribe}
     * with the given `func` parameter.
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
     * Remove the given function from message event handler list.
     *
     * @param func - A function which should be removed from the message event subscriptions.
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
     * Send the given data to the configured target.
     *
     * @param data - Data which should be passed onto the target
     * (must be serializable {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description | see `JSON.stringify`}).
     * @returns `true` if data could be sent, `false` otherwise.
     */
    public send(...data: T): boolean {
        try {
            if (this.isWindow) {
                // eslint-disable-next-line no-extra-semi
                ;(this.target as Window).postMessage(this.secret + JSON.stringify(data), this.targetOrigin as string)
            } else {
                // eslint-disable-next-line no-extra-semi
                ;(this.target as MessagePort).postMessage(this.secret + JSON.stringify(data))
            }

            return true
        } catch (e) {
            return false
        }
    }

    private handleMessage(event: MessageEvent): void {
        // check if window references match
        if (this.checkEventOrigin(event.origin, (event as PostMessageEvent).source)) {
            const dataKey = (event as PostMessageEvent).message ? 'message' : 'data'

            if (typeof (event as PostMessageEvent)[dataKey] !== 'string') {
                return
            }

            const secret = (event as PostMessageEvent)[dataKey].slice(0, this.secret.length)

            // check if received secret matches
            if (secret === this.secret) {
                this.callListener(JSON.parse((event as PostMessageEvent)[dataKey].slice(this.secret.length)))
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

export default PostMessageHandler

export { TargetOriginMissingError }
