export default function (...args):Array {
    return Array.prototype.concat.apply(Array.prototype, args);
}