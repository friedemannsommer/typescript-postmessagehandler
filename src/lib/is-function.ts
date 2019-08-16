import getType from './get-type'

export default function isFunction(value: any): boolean {
    return getType(value) === 'function' || typeof value === 'function'
}
