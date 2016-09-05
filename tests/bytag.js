import {test} from 'tape';
import Rx, {ReactiveTest} from 'rx';

import collectionAssert from 'rx-collectionassert';

import {byTag} from '../index';
Rx.Observable.prototype.byTag = byTag;

test('Filters correctly', function(assert) {
    var scheduler = new Rx.TestScheduler();

    var Dispatcher = scheduler.createHotObservable(
        ReactiveTest.onNext(210, {tag: 'foo/bar/baz'}),
        ReactiveTest.onNext(250, {tag: 'foo/bar/qux'}),
        ReactiveTest.onCompleted(200));

    var ret = scheduler.startScheduler(function() {
        return Dispatcher.byTag('foo/bar/b*');
    }, {created: 100, subscribed: 200, disposed: 500});

    collectionAssert.assertEqual(ret.messages, [
        ReactiveTest.onNext(210, {tag: 'foo/bar/baz'}),
    ]);

    assert.end();
});

test('Ignores non-matches', function(assert) {
    var scheduler = new Rx.TestScheduler();

    var Dispatcher = scheduler.createHotObservable(
        ReactiveTest.onNext(210, 'Not a match'),
        ReactiveTest.onNext(250, {tag: 'foo/bar/baz'}),
        ReactiveTest.onCompleted(200));

    var ret = scheduler.startScheduler(function() {
        return byTag.call(Dispatcher, 'foo/bar/b*');
    }, {created: 100, subscribed: 200, disposed: 500});

    collectionAssert.assertEqual(ret.messages, [
        ReactiveTest.onNext(250, {tag: 'foo/bar/baz'}),
    ]);

    assert.end();
});
