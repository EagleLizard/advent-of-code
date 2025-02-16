
const { suite, test } = require('node:test');
const assert = require('node:assert/strict');

const { Queue } = require('./queue');

suite('queue tests', () => {

  test('queue is not empty', () => {
    let queue = new Queue();
    queue.push(1);
    assert.equal(queue.empty(), false);
  });

  test('queue empties', () => {
    let queue = new Queue();
    let testVals = [ 1, 2, 3, 4, 5 ];
    for(let i = 0; i < testVals.length; ++i) {
      queue.push(testVals[i]);
    }
    let numVals = testVals.length;
    while(numVals-- > 0) {
      queue.pop();
    }
    assert.equal(queue.empty(), true);
  });

  test('queue with one item has head but no tail', () => {
    let queue = new Queue();
    queue.push(1);
    assert.notDeepEqual(queue.head, queue.tail);
  });

  test('queue Iterator has correct elements', () => {
    let queue = new Queue();
    let testVals = [ 5, 4, 3, 2, 1 ];
    for(let i = 0; i < testVals.length; ++i) {
      queue.push(testVals[i]);
    }
    assert.deepEqual(testVals, [ ...queue ]);
  });
});
