// tslint:disable-next-line
interface EventTarget {
    // internet explorer implementations
    attachEvent(event: string, listener: EventListener): boolean
    detachEvent(event: string, listener: EventListener): boolean
    fireEvent(event: string, eventObject?: Event | CustomEvent, canceled?: boolean): boolean
}
