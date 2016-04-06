export default function (...args):Array<any> {
    return Array.prototype.concat.apply(Array.prototype, args);
}