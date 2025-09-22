class BoardGraph {
  constructor() {
    this.Adjlist = new Map();
  }

  addVertex(position) {
    this.Adjlist.set(position.toString(), []);
  }

  addEdge(start_pos, possible_pos) {
    const startKey = start_pos.toString();
    const endKey = possible_pos.toString();

    if (!this.Adjlist.has(startKey)) this.Adjlist.set(startKey, []);
    if (!this.Adjlist.has(endKey)) this.Adjlist.set(endKey, []);

    if (!this.Adjlist.get(startKey).includes(endKey))
      this.Adjlist.get(startKey).push(endKey);

    if (!this.Adjlist.get(endKey).includes(startKey))
      this.Adjlist.get(endKey).push(startKey);
  }

  printGraph() {
    let keys = this.Adjlist.keys();
    for (let i of keys) {
      let getValues = this.Adjlist.get(i);
      let concatString = "";

      for (let j of getValues) {
        concatString += j + " ";
      }

      console.log(i + " => " + concatString);
    }
  }

  initBoard() {
    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 7; y++) {
        this.addVertex([x, y]);
      }
    }

    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 7; y++) {
        let possiblePositions = [];
        possiblePositions.push([x - 2, y + 1], [x - 1, y + 2]);
        possiblePositions.push([x + 2, y + 1], [x + 1, y + 2]);
        possiblePositions.push([x - 2, y - 1], [x - 1, y - 2]);
        possiblePositions.push([x + 2, y - 1], [x + 1, y - 2]);

        for (let possiblePosition of possiblePositions) {
          if (
            possiblePosition[0] < 0 ||
            possiblePosition[1] < 0 ||
            possiblePosition[0] > 7 ||
            possiblePosition[1] > 7
          ) {
            continue;
          } else {
            this.addEdge([x, y], possiblePosition);
          }
        }
      }
    }
  }

  knight_moves(starting_pos, ending_pos) {
    let visited = {};
    let queue = [];
    let parent = {};

    starting_pos = starting_pos.toString();
    visited[starting_pos] = true;
    queue.push(starting_pos);

    while (!queue.length == 0) {
      let targetPos = queue.shift();
      if (targetPos.toString() == ending_pos.toString()) break;
      let targetPosList = this.Adjlist.get(targetPos.toString());
      for (let i in targetPosList) {
        let neighbour = targetPosList[i];
        if (!visited[neighbour]) {
          visited[neighbour] = true;
          parent[neighbour] = targetPos;
          queue.push(neighbour);
        }
      }
    }

    let array = this.backtrack(parent, ending_pos.toString());
    return array;
  }

  backtrack(parent, pos, array = []) {
    if (parent[pos] == null || parent[pos] == undefined) {
      array.unshift(pos);
      return array;
    }

    array.unshift(pos);
    return this.backtrack(parent, parent[pos], array);
  }
}

const boardGraph = new BoardGraph();
boardGraph.initBoard();

export { boardGraph };
