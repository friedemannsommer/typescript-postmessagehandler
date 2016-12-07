declare module 'json3' {
    interface IJSON3 {
        parse(text: string, reviver?: (key: string, value: any) => any): any
        stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string
        noConflict(): IJSON3
        runInContext(context?: any, exports?: Object): void
    }

    export function parse(text: string, reviver?: (key: string, value: any) => any): any
    export function stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string
    export function noConflict(): IJSON3
    export function runInContext(context?: any, exports?: Object): void
}
