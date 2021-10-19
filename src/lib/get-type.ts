export default function getType(object: unknown): string {
    const typeStr = Object.prototype.toString.call(object).substring(8).toLowerCase()

    return typeStr.substring(0, typeStr.length - 1)
}
