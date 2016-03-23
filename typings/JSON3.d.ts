declare module JSON_Module {
    interface JSON3 {
        parse(text:string, reviver?:(key:string, value:any) => any):any
        stringify(value:any, replacer?:(key:string, value:any) => any, space?:string|number):string
        noConflict():JSON3
        runInContext(context?:any, exports?:Object):void
    }

    export default JSON3;
}