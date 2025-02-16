
class QueueNode {
  constructor(val) {
    this.val = val;
    this.next = undefined;
  }
}

class Queue {
  constructor() {
    this.head = undefined;
    this.tail = undefined;
  }

  push(val) {
    let node = new QueueNode(val);
    if(this.head === undefined) {
      this.head = node;
    } else if(this.tail === undefined) {
      this.tail = node;
      this.head.next = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
  }

  pop() {
    let node;
    if(this.head !== undefined) {
      node = this.head;
      this.head = this.head.next;
      if(this.head?.next === undefined) {
        this.tail = undefined;
      }
    }
    return node?.val;
  }
  
  empty() {
    return this.head === undefined;
  }

  [Symbol.iterator]() {
    let currNode = this.head;
    let next = () => {
      let done = currNode === undefined;
      let value = currNode?.val;
      currNode = currNode?.next;
      return {
        value,
        done,
      };
    };
    return {
      next,
    };
  }
}

module.exports = {
  Queue,
};
