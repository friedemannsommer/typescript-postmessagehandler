interface PostMessageEvent extends Event {
    data:any
    message:any
    origin:string
    source:Window
    originalEvent:PostMessageEvent
}