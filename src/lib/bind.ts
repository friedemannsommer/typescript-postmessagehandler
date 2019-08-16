import isFunction from './is-function'

export type BindFn<T extends unknown[] = unknown[]> = (...args: T) => void

export default function bindFn<T extends unknown[] = unknown[]>(
    fn: BindFn<T>,
    context: object | undefined,
    ...givenArguments: unknown[]
): BindFn<T> {
    if (isFunction(fn)) {
        if (isFunction(Function.prototype.bind)) {
            return Function.prototype.bind.apply(fn, [context].concat(givenArguments) as [object | undefined, ...unknown[]])
        }

        return givenArguments.length > 0
            ? (...localArguments: unknown[]) => {
                return localArguments.length > 0
                    ? fn.apply(context, givenArguments.concat(localArguments) as T)
                    : fn.apply(context, givenArguments as T)
            }
            : (...localArguments: unknown[]) => {
                return localArguments.length > 0
                    ? fn.apply(context, localArguments as T)
                    : (fn as unknown as BindFn<[]>).call(context)
            }
    }

    return fn
}
