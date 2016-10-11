/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const PolyNode = __webpack_require__(1);
	const stack = __webpack_require__(1).stack;
	
	
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


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map