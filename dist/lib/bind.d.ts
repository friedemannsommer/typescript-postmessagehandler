export declare type BindFn<T extends unknown[] = unknown[]> = (...args: T) => void;
export default function bindFn<T extends unknown[] = unknown[]>(fn: BindFn<T>, context: object | undefined, ...givenArguments: unknown[]): BindFn<T>;
