declare global {
    interface EventTarget {
        detachEvent(event: string, listener: EventListener): boolean;
    }
}
export default function removeEvent(element: EventTarget, type: string, listener: EventListener): void;
