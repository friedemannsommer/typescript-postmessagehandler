import concat from './array-concat'
import getType from './get-type'

export default function (fn: Function, context: Object, ...givenArguments: any[]): Function {
    if (getType(fn) === 'function') {
        if (getType(Function.prototype.bind) === 'function') {
            return Function.prototype.bind.apply(fn, concat([context], givenArguments))
        }

        return givenArguments.length > 0
            ?
            (...localArguments: any[]) => {
                return localArguments.length > 0
                    ? fn.apply(context, concat(givenArguments, localArguments))
                    : fn.apply(context, givenArguments)
            }
            :
            (...localArguments: any[]) => {
                return localArguments.length > 0
                    ? fn.apply(context, localArguments)
                    : fn.apply(context)
            }
    }

    return fn
}
