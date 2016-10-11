class PolyNode {
  constructor (value) {
    this.value = value;
    this.children = [];
    this.parent = undefined;
  }

  setParent (node) {
    if (this.parent) {
      this.parent = undefined;
    }
    this.parent = node;
    node.children.push(this);
    return this;
  }

  addChild (node) {
    node.setParent(this);
  }

  removeChild (node) {
    node.parent = undefined;
    let idx = this.children.indexOf(node);
    if ( idx > -1) {
      delete this.children[idx];
    }
  }

  dfs (target) {
    if (this.value === target) {
      return [];
    }
    let result;
    this.children.forEach((child, index) => {
      let nextCall = child.dfs(target);
      if (nextCall) {
        result = nextCall.concat([child.value]);
      }
    });
    return result;
  }

  deepestDepth () {
    if (this.children.length === 0) {
      return 1;
    }
    let maxDepth;
    this.children.forEach((child) => {
      let nextCall = child.deepestDepth();
      let depth = nextCall + 1;
      if (!maxDepth || depth > maxDepth) {
        maxDepth = depth;
      }
    });
    return maxDepth;
  }

  bfs (target) {
    let queue = [this];
    while (queue.length > 0) {
      let parent = queue.shift();
      if (parent.value === target) {
        return parent;
      }
      queue = queue.concat(parent.children);
    }
  }
}

const buildTree = function (arr) {
  let root = new PolyNode(arr[0]);
  let queue = [root];
  for (let i = 1; i < arr.length; i += 2) {
    let parent = queue.shift();
    let child1 = new PolyNode(arr[i]);
    let child2 = new PolyNode(arr[i + 1]);
    parent.addChild(child1);
    parent.addChild(child2);
    queue.push(child1, child2);
  }
  return root;
};

module.exports = PolyNode;
