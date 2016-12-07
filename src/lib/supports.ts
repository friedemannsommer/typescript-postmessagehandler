export default function supports(object: any, property: string): boolean {
    if (object !== null) {
        try {
            return property in object
        } catch (e) {
            return typeof object[property] !== 'undefined'
        }
    }

    return false
}
