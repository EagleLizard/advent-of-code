
import { suite, test } from 'node:test';
import assert from 'node:assert/strict';

// const { Queue } = require('./queue');
import { Queue } from './queue';

suite('queue tests', () => {

  test('queue is not empty', () => {
    let queue = new Queue();
    queue.push(1);
    console.log(queue);
    assert.equal(queue.isEmpty(), false);
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
    assert.equal(queue.isEmpty(), true);
  });

  test('queue with one item has head equal to tail', () => {
    let queue = new Queue();
    queue.push(1);
    assert.deepEqual(queue.head, queue.tail);
  });

  test('pop() returns FIFO order', () => {
    let queue = new Queue<string>();
    let testStr = 'first in first out.';
    for(let i = 0; i < testStr.length; i++) {
      let c = testStr[i];
      queue.push(c);
    }
    let items: string[] = [];
    while(!queue.isEmpty()) {
      items.push(queue.pop()!);
    }
    assert.equal(items.join(''), testStr);
  });

  // test('queue Iterator has correct elements', () => {
  //   let queue = new Queue();
  //   let testVals = [ 5, 4, 3, 2, 1 ];
  //   for(let i = 0; i < testVals.length; ++i) {
  //     queue.push(testVals[i]);
  //   }
  //   assert.deepEqual(testVals, [ ...queue ]);
  // });
});

