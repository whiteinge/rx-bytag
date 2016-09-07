# rx-byTag

An RxJS operator to provide very lightweight "channels".

This wraps the Rx
[filter](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/where.md)
operator to perform succinct matching using light shell-style glabbing syntax.
The whole package consists of three, small functions.

This provides two things:

* A lightweight way to create a "by convention channel" in an Rx stream by sending an object payload with a `tag` attribute.
* A very lightweight hierarchical namespacing syntax using simple strings. Each "level" in the slash-delimited string provides an additional level of specificity.

## Example

```js
import {byTag, sendAction} from 'rx-bytag';
Rx.Observable.prototype.byTag = byTag;

var Dispatcher = new Rx.Subject();
var send = sendAction.bind(Dispatcher);

var sub = Dispatcher.byTag('foo/*/baz')
    .subscribe(x => console.log(x);

send('foo/bar/baz', {bar: 'Bar'});
// => {tag: 'foo/bar/baz', data: {bar: 'Bar'}}

// With currying for easy use in callbacks.
send('foo/bar/baz')({bar: 'Bar'});
// => {tag: 'foo/bar/baz', data: {bar: 'Bar'}}
```

## Related Projects

* The [Rxmq.js](https://github.com/rxmqjs/rxmq.js) project provides much more robust channel functionality and uses a far more granular filtering syntax.
