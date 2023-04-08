/**
 * This error will be thrown by {@link PostMessageHandler} if {@link PostMessageHandler."constructor" | target}
 * is a `Window` but {@link PostMessageHandler."constructor" | targetOrigin} isn't a `string`.
 */
export class TargetOriginMissingError extends Error {
    public constructor(public readonly target: Window) {
        super('`target` is `window` like which requires an `targetOrigin`, but no `targetOrigin` is set')

        this.name = 'TargetOriginMissingError'
    }
}
