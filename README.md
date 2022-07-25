# Typescript PostMessage

Simply implements postMessage in Typescript

## Compatibility

**NO** fallback for older Browsers!

Partial (IFrames)

* IE8-9

Full (IFrames, Windows, Tabs)

* IE10+
* Edge 12+
* Firefox 3+
* Chrome 4+
* Safari 4+
* Opera 10.1+

Source: [Can I use](https://caniuse.com/#search=postMessage)

## Example

```typescript
/**
 * https://app.example.com
 */
import PostMessageHandler from 'typescript-postmessagehandler';
// in this example we use a IFrame to communicate with
let iFrame: HTMLIFrameElement = document.createElement('iframe');
iFrame.src = 'https://example.com';
document.appendChild(iFrame);
// instantiate PostMessageHandler
const messageHandler = new PostMessageHandler('my-secret-key', iFrame.contentWindow, 'https://example.com');
messageHandler.send('example data', 1337, ['array', 'values'], {key: 'value'});
```

```typescript
/**
 * https://example.com
 */
import PostMessageHandler from 'typescript-postmessagehandler';
// instantiate PostMessageHandler
const messageHandler = new PostMessageHandler('my-secret-key', window.parent, document.referrer);

// create PostMessage Listener
function handlePostMessage(stringValue: string, numberValue: number, arrayValue: Array<string>, objectValue: Object) {
    // do what ever you want with your data :)
}

// subscribe to PostMessages
messageHandler.subscribe(handlePostMessage);
```

## API

```typescript
interface PostMessageHandler {
    new(secret: string, target: MessageEventSource, origin?: string)

    send(...data: Array<any>): boolean

    subscribe(listener: Function): void

    unsubscribe(listener: Function): void
}
```
