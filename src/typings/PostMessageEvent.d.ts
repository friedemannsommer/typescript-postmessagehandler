export interface IPostMessageEvent extends MessageEvent {
    data: string
    message: string
    source: MessageEventSource
}
