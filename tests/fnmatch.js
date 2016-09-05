import {test} from 'tape';
import {fnmatch} from '../index';

test('Curried function output incorrect.', function(assert) {
    assert.ok(fnmatch('foo')('foo'));
    assert.end();
});

test('Curried globbing function output incorrect.', function(assert) {
    assert.ok(fnmatch('foo*')('foobar'));
    assert.end();
});

test('Equal glob match incorrect.', function(assert) {
    assert.ok(fnmatch('foo', 'foo'));
    assert.end();
});

test('Subset match incorrect.', function(assert) {
    assert.ok(!fnmatch('foo', 'foobar'));
    assert.end();
});

test('Subset glob end-match incorrect.', function(assert) {
    assert.ok(fnmatch('foo*', 'foobar'));
    assert.end();
});

test('Subset mid-glob match incorrect.', function(assert) {
    assert.ok(fnmatch('foo*r', 'foobar'));
    assert.end();
});

test('Subset begin-glob match incorrect.', function(assert) {
    assert.ok(fnmatch('*bar', 'foobar'));
    assert.end();
});
