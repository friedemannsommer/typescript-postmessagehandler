export default function supports(object: unknown, property: string): boolean {
    if (object !== null && typeof object !== 'undefined') {
        try {
            return property in (object as Record<string, unknown>)
        } catch (e) {
            return typeof (object as Record<string, unknown>)[property] !== 'undefined'
        }
    }

    return false
}
