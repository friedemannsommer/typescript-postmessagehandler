declare global {
    interface EventTarget {
        attachEvent(event: string, listener: EventListener): boolean;
    }
}
export default function addEvent(element: EventTarget, type: string, listener: EventListener, capture: boolean): void;
