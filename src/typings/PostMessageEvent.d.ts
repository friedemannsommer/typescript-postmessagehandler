// tslint:disable-next-line
interface PostMessageEvent extends MessageEvent {
    data: any
    message: any
    origin: string
    source: Window
}
