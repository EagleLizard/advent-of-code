import assert from 'node:assert';

class QueueNode<T> {
  prev?: QueueNode<T>;
  next?: QueueNode<T>;
  val: T;
  constructor(val: T) {
    this.val = val;
  }
}

/*

  Default push/pop behavior is FIFO

  H -> T void
  push(0)
  H -> T 0
  push(1)
  H 0 -> T 1
  push(2)
  H 0 -> 1 -> T 2

_*/
export class Queue<T> {
  private _size: number;
  head?: QueueNode<T>;
  tail?: QueueNode<T>;
  constructor() {
    this._size = 0;
  }
  /*
  push_front
  _*/
  push(val: T) {
    let node = new QueueNode(val);
    if(this.head === undefined || this.tail === undefined) {
      this.head = this.tail = node;
    } else if(this.head === this.tail) {
      node.next = this.tail;
      this.head = node;
      this.tail.prev = this.head;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    this._size++;
  }
  /*
  pop_back
  _*/
  pop(): T | undefined {
    let node: QueueNode<T>;
    if(this.head === undefined || this.tail === undefined) {
      return undefined;
    }
    if(this.head === this.tail) {
      node = this.head;
      this.head = this.tail = undefined;
      // return node.val;
    } else {
      node = this.tail;
      assert(this.tail.prev !== undefined);
      this.tail = this.tail.prev;
      this.tail.next = undefined;
    }
    this._size--;
    return node.val;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }
  get size(): number {
    return this._size;
  }
}
