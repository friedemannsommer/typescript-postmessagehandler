import getType from './get-type'

export default function isFunction(value: unknown): boolean {
    return getType(value) === 'function' || typeof value === 'function'
}
