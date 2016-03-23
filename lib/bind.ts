import concat from './array-concat';

export default function (fn:Function, context:Object, ...givenArguments):Function {
    if (typeof fn == 'function') {
        if (typeof Function.prototype.bind == "function") {
            return Function.prototype.bind.apply(fn, concat([context], givenArguments));
        }

        return givenArguments.length > 0
            ?
            (...localArguments) => {
                return localArguments.length > 0
                    ? fn.apply(context, concat(givenArguments, localArguments))
                    : fn.apply(context, givenArguments)
            }
            :
            (...localArguments) => {
                return localArguments.length > 0
                    ? fn.apply(context, localArguments)
                    : fn.apply(context)
            };
    }

    return fn;
}