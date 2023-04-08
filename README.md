# Typescript PostMessage

Simply implements postMessage in Typescript

## Documentation

You can find the API documentation
here: [friedemannsommer.github.io/typescript-postmessagehandler](https://friedemannsommer.github.io/typescript-postmessagehandler/)

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

Source: [Can I use](https://caniuse.com/mdn-api_window_postmessage)

## Example

### Sender

```typescript
/**
 * https://app.example.com
 */
import PostMessageHandler from 'typescript-postmessagehandler';

// in this example we use a IFrame to communicate with
const secret = 'my-secret-key';
let iFrame: HTMLIFrameElement = document.createElement('iframe');

iFrame.src = 'https://example.com/#' + secret;

document.appendChild(iFrame);

// instantiate PostMessageHandler
const messageHandler = new PostMessageHandler(secret, iFrame.contentWindow, 'https://example.com');

// send a message
messageHandler.send('example data', 1337, ['array', 'values'], {key: 'value'});
```

### Receiver

```typescript
/**
 * https://example.com
 */
import PostMessageHandler from 'typescript-postmessagehandler';

// instantiate PostMessageHandler
const messageHandler = new PostMessageHandler(window.location.hash, window.parent, document.referrer);

// create PostMessage Listener
function handlePostMessage(stringValue: string, numberValue: number, arrayValue: Array<string>, objectValue: Object) {
    // do what ever you want with your data :)
}

// subscribe to PostMessages
messageHandler.subscribe(handlePostMessage);
```
