class BSTNode {
  constructor (value) {
    this.value = value;
    this.left = undefined;
    this.right = undefined;
    this.parent = undefined;
  }
}

class BSTree {
  constructor () {
    this.root = undefined;
  }

  insertFromRoot (value) {
    if (!this.root) {
      this.root = new BSTNode(value);
    } else {
      return BSTree.insert(value, this.root);
    }
  }

  heightFromRoot () {
    return BSTree.height(this.root);
  }

  minFromRoot () {
    return BSTree.min(this.root);
  }

  maxFromRoot () {
    return BSTree.max(this.root);
  }

  findFromRoot (target) {
    return BSTree.find(this.root, target);
  }

  deleteNode (target) {
    return BSTree.deleteNode(this.root, target);
  }

  getSortedArrayfromRoot () {
    return BSTree.getSortedArray(this.root);
  }

  static min (node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  static max (node) {
    while (node.right) {
      node = node.right;
    }
    return node;
  }

  static insert (value, parentNode) {
    let returnedNode;
    if (!parentNode) {
      return new BSTNode(value);
    } else if (parentNode.value <= value) {
      returnedNode = BSTree.insert(value, parentNode.right);
      parentNode.right = returnedNode;
    } else if (parentNode.value > value) {
      returnedNode = BSTree.insert(value, parentNode.left);
      parentNode.left = returnedNode;
    }
    returnedNode.parent = parentNode;
    return parentNode;
  }

  static height (node) {
    if (!node) {
      return 0;
    }
    let maxDepth;
    [node.left, node.right].forEach((child) => {
      let nextCall = BSTree.height(child);
      let depth = nextCall + 1;
      if (!maxDepth || depth > maxDepth) {
        maxDepth = depth;
      }
    });
  return maxDepth;
  }

  static find(node, target) {
    if (target === node.value) {
      return node;
    }
    if (node.value <= target) {
      return BSTree.find(node.right, target);
    } else if (node.value > target) {
      return BSTree.find(node.left, target);
    }

  }

  buildBalancedTree (arr) {
    if (arr.length === 0) {
      return;
    }
    let midIdx = Math.floor(arr.length/2);
    this.insertFromRoot(arr[midIdx]);
    let left = arr.slice(0, midIdx);
    let right = arr.slice(midIdx + 1);
    this.buildBalancedTree(left);
    this.buildBalancedTree(right);
  }

  static getSortedArray (node) {
    if (!node.left && !node.right) {
      return [node.value];
    }
    let left,
        right;
    if (node.left) {
      left = BSTree.getSortedArray(node.left);
    }
    if (node.right) {
      right = BSTree.getSortedArray(node.right);
    }
    if (left && right) {
      return left.concat([node.value], right);
    } else if (left) {
      return left.concat([node.value]);
    } else {
      return [node.value].concat(right);
    }
  }

  static deleteNode (inputNode, target) {
    let nodeToDelete = BSTree.find(inputNode, target);
    let side;
    if (!nodeToDelete.parent) {
      return BSTree.deleteParent(inputNode, target);
    } else if (nodeToDelete.parent.left === nodeToDelete) {
      side = "left";
    } else {
      side = "right";
    }



    if (!nodeToDelete.left && !nodeToDelete.right) {
      nodeToDelete.parent[side] = undefined;
    } else if (nodeToDelete.left) {
      nodeToDelete.parent[side] = nodeToDelete.left;
    } else if (nodeToDelete.right) {
      nodeToDelete.parent[side] = nodeToDelete.right;
    } else {
      let rightMax = BSTree.max(nodeToDelete.left);
      rightMax.right = nodeToDelete.right;
      rightMax.left = nodeToDelete.left;
      rightMax.parent = nodeToDelete.parent;
      nodeToDelete.parent[side] = rightMax;
    }
    nodeToDelete.parent = undefined;
    return nodeToDelete;
  }

 }


let tree1 = new BSTree();
let tree2 = new BSTree();
let inserts = [8,9,10,11,12,13,14,15,1,2,3,4,5,6,7];
inserts.forEach((num) => {
  tree2.insertFromRoot(num);
});
inserts.sort((a,b) => {
  return a - b;
});
tree1.buildBalancedTree(inserts, tree1.root);

// console.log(tree1.heightFromRoot());
// console.log(tree1.minFromRoot());
// console.log(tree1.maxFromRoot());
// console.log(tree1.deleteNode(7));
// console.log(tree1);
// console.log(tree1.getSortedArrayfromRoot());
