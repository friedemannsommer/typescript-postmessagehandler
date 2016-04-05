# Typescript PostMessage
Simply implements postMessage in Typescript

## Compatibility
**NO** fallback for older Browsers!

Partial (IFrames)
* IE8
* IE Mobile 10+

Full (IFrames, Windows, Tabs)
* IE9+
* Edge 12+
* Firefox 3+
* Chrome 4+
* Safari 4+
* Opera 10.1+
* Android Chrome 49+
* Android Firefox 45+
* Android Browser 2.1+
* Android UC Browser 9.9+
* iOS Safari 3.2+
* Blackberry Browser 7+
* Opera Mobile 12+
* Opera Mini 8+

Source: [Can I use](http://caniuse.com/#search=postMessage)

## Example
```typescript
/**
 * https://app.example.com
 */
import PostMessageHandler from 'postmessage.ts';
// in this example we use a IFrame to communicate with
let iFrame:HTMLIFrameElement = document.createElement('iframe');
iFrame.src = 'https://example.com';
document.appendChild(iFrame);
// instantiate PostMessageHandler
const MessageHandler = new PostMessageHandler('my-secret-key', iFrame.contentWindow, 'https://example.com');
MessageHandler.send('example data', 1337, ['array', 'values'], {key: 'value'});
```
```typescript
/**
 * https://example.com
 */
import PostMessageHandler from 'postmessage.ts';
// instantiate PostMessageHandler
const MessageHandler = new PostMessageHandler('my-secret-key', window.parent, document.referrer);
// create PostMessage Listener
function handlePostMessage(stringValue:string, numberValue:number, arrayValue:Array<string>, objectValue:Object) {
    // do what ever you want with your data :)
}
// subscribe to PostMessages
MessageHandler.subscribe(handlePostMessage);
```

## API
```typescript
interface PostMessageHandler {
    new(secret:string, target:Window, origin:string)

    send(...data:Array<any>):boolean

    subscribe(listener:Function):void

    unsubscribe(listener:Function):void
}
```