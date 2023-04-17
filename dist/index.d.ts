import { TargetOriginMissingError } from './lib/error';
export type MessageListener<T extends unknown[] = unknown[]> = (...args: T) => void;
export declare class PostMessageHandler<T extends unknown[] = unknown[]> {
    private readonly messageListener;
    private readonly secret;
    private readonly target;
    private readonly targetOrigin;
    private readonly eventCallback;
    private readonly isWindow;
    private listenerRegistered;
    private removeMessageListener;
    constructor(secret: string, target: Window, targetOrigin: string);
    constructor(secret: string, target: MessagePort | ServiceWorker);
    subscribe(func: MessageListener<T>): VoidFunction;
    unsubscribe(func: MessageListener<T>): void;
    send(...data: T): boolean;
    private handleMessage;
    private checkEventOrigin;
    private callListener;
}
export default PostMessageHandler;
export { TargetOriginMissingError };
