import {test} from 'tape';
import Rx from 'rx';

import {sendAction} from '../index';

test('Binding', function(assert) {
    var Dispatcher = new Rx.Subject();
    var send = sendAction.bind(Dispatcher);

    var sub = Dispatcher.subscribe(function(x) {
        console.log('x', x);
        assert.deepEqual(x, {tag: 'foo', data: {bar: 'Bar'}});
    });

    send('foo', {bar: 'Bar'});
    assert.end();
});

test('Currying', function(assert) {
    var Dispatcher = new Rx.Subject();
    var send = sendAction.bind(Dispatcher);

    var sub = Dispatcher.subscribe(function(x) {
        console.log('x', x);
        assert.deepEqual(x, {tag: 'foo', data: {bar: 'Bar'}});
    });

    send('foo')({bar: 'Bar'});
    assert.end();
});
