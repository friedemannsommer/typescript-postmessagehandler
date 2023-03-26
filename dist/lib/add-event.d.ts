declare global {
    interface EventTarget {
        attachEvent(event: string, listener: EventListener): boolean;
        detachEvent(even: string, listener: EventListener): boolean;
    }
}
export default function addEvent<T extends EventTarget>(element: T, type: string, listener: Parameters<T['addEventListener']>[1], capture: boolean): VoidFunction;
