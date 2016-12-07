export default function (object: any): string {
    return Object.prototype.toString.call(object).replace(/^\[object\s+|\]$/ig, '').toLowerCase()
}
