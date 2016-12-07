export default function (...args: any[]): any[] {
    return Array.prototype.concat.apply(Array.prototype, args)
}
