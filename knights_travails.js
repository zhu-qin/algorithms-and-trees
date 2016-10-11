const PolyNode = require('./polynodetree');
const stack = require('./polynodetree').stack;


const KNIGHT_CONSTANTS = {
  DELTAS: [
    [2, 1],
    [2,-1],
    [1, 2],
    [-1,2],
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [1, -2]
  ],

  DFS: [],
  BFS: []

};


class KnightTravails {
  constructor(start) {
    this.root = new PolyNode(start);
  }

  static possibleMoves (pos) {
    let results = [];
    KNIGHT_CONSTANTS.DELTAS.forEach ((delta) => {
      let row = pos[0] + delta[0];
      let col = pos[1] + delta[1];
      if ((row > -1 && row < 8) && (col > -1 && col < 8)) {
        results.push([row,col]);
      }
    });
    return results;
  }

  createDOMBoard () {
    for (let i = 0; i < 8; i += 1) {
      let $row = $(`<div class="row"></div>`);
      for (let j = 0; j < 8; j += 1) {
        let $unit = $(`<div class="box">${[i,j]}</div>`);
        $unit.attr("pos",`${[i,j]}`);
        $row.append($unit);
      }
      $("#root").append($row);
    }
  }

  buildTree () {
    let visited = {};
    let queue = [this.root];
    while (queue.length > 0) {
      let parent = queue.shift();
      visited[parent.value] = true;
      let potentialMoves = KnightTravails.possibleMoves(parent.value);
      potentialMoves.forEach((move) => {
        if (!visited[move]) {
          let child = new PolyNode(move);
          parent.addChild(child);
          queue.push(child);
        }
      });
    }

    return this.root;
  }

  static dfs(node, target) {
    if (node.value[0] === target[0] && node.value[1] === target[1]) {
      return node;
    }
    KNIGHT_CONSTANTS.DFS.push(node);
    let found;
    node.children.forEach((child) => {
      let nextCall = KnightTravails.dfs(child, target);
      if (nextCall) {
        found = nextCall;
      }
    });
    return found;
  }

  static bfs (node, target) {
    let queue = [node];
    while (queue.length > 0) {
      let parent = queue.shift();
      KNIGHT_CONSTANTS.BFS.push(parent);
      if (parent.value[0] === target[0] && parent.value[1] === target[1]) {
        return parent;
      }
      queue = queue.concat(parent.children);
    }
  }

  static animateStack(stack) {
    let parents = [];
    let visited = {};
    let state = 1;

    stack.forEach((move) => {
      if (!visited[move.value]) {
        visited[move.value] = true;
        state += 1;
      }
      let $domNode = $(`[pos="${move.value}"]`);
      let fillIn = function () {
        $domNode.addClass("knight");
      };
      setTimeout(fillIn, 300*state);
      parents.push($domNode);
    });
  }
}

let knight = new KnightTravails([0,0]);

$(function () {
  knight.createDOMBoard();
  let tree = knight.buildTree();
  console.log(tree);
  let resultDfs = KnightTravails.dfs(tree, [7,6]);
  let resultBfs = KnightTravails.bfs(tree, [7,6]);
  // KnightTravails.animateStack(KNIGHT_CONSTANTS.DFS);
  KnightTravails.animateStack(KNIGHT_CONSTANTS.BFS);
});


// console.log(tree.dfs([7,6]));
