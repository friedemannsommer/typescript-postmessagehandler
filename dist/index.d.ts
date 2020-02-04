import { BindFn } from './lib/bind';
declare class PostMessageHandler<T extends unknown[] = unknown[]> {
    private static registerListener;
    private static removeListener;
    private readonly messageListener;
    private readonly secret;
    private readonly target;
    private readonly targetOrigin;
    private readonly eventCallback;
    private readonly isWindow;
    private listenerRegistered;
    constructor(secret: string, target: Window, targetOrigin: string);
    constructor(secret: string, target: MessagePort | ServiceWorker);
    subscribe(func: BindFn<T>): () => void;
    unsubscribe(func: BindFn<T>): void;
    send(...data: T): boolean;
    private checkEventOrigin;
    private handleMessage;
    private callListener;
}
export default PostMessageHandler;
