/**
 * Adds legacy field `message` for `MessageEvent`.
 *
 * @internal
 */
export interface PostMessageEvent extends MessageEvent {
    data: string
    message: string
    source: MessageEventSource
}
