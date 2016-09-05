import escapeRegExp from 'lodash/escapeRegExp';

/**
Filter messages through the event stream by pattern matching on tag attribute

The pattern may contain glob-style tokens which will be matched against tags
coming through the event stream.

@see fnmatch
**/
export function byTag(...args) {
    // reuse the regex objs.
    var fnList = [];
    for (let pattern of args) {
        fnList.push(fnmatch(pattern));
    }

    return this.filter(function(stream) {
        if (!stream.tag) { return false; }

        for (let fn of fnList) {
            if (fn(stream.tag)) { return true; }
        }

        return false;
    });
}


/**
Convert a glob-style match to a regex
**/
function globStringToRegex(str) {
    return new RegExp(`^${escapeRegExp(str).replace(/\\\*/g, '.*')}$`);
}

/**
Perform shell-style globbing on strings

Function can be curried to cache the generated regex object for performance.
Note, only the `*` character is supported for now.

Usage:
    fnmatch('foo*')('foobarbaz')
    // true
    fnmatch('foo*', 'foobarbaz')
    // true
**/
export function fnmatch(match, string) {
    var testFn;
    if (match.includes('*')) {
        var glob = globStringToRegex(match);
        testFn = glob.test.bind(glob);
    } else {
        testFn = x => match === x;
    }

    if (arguments.length < 1) {
        return fnmatch;
    } else if (arguments.length < 2) {
        return x => testFn(x);
    } else {
        return testFn(string);
    }
}

/**
Format a payload for use with the byTag filter

Usage:

    var Dispatcher = new Rx.Subject();
    var sub = Dispatcher.subscribe(x => console.log(x));
    var send = sendAction.bind(Dispatcher);

    send('foo', {bar: 'Bar'})
    // => {tag: 'foo', data: {bar: 'Bar'}}
    send('foo')
    // [function]
    send('foo')({bar: 'Bar'})
    // => {tag: 'foo', data: {bar: 'Bar'}}
**/
export function sendAction(tag, data) {
    if (arguments.length < 1) {
        return sendAction;
    } else if (arguments.length < 2) {
        return x => sendAction.call(this, tag, x);
    } else {
        var fn = this.onNext || this.next;
        return fn.call(this, {tag, data});
    }
}
