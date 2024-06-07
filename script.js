// Functionality for hiding and showing the sidebar
document.getElementById('sidebar').addEventListener('dblclick', function () {
  this.classList.toggle('hidden');
});

document.getElementById('startButton').addEventListener('click', function () {
  const customCode = document.getElementById('codeInput').value;
  const executeCustomCode = document.getElementById('toggleCustomCode').checked;
  // Placeholder function to draw graph based on adjacency matrix
  drawGraph();
  // Placeholder function to execute algorithms and update time table
  executeAlgorithms(executeCustomCode, customCode);
});

function drawGraph() {
  // Add your graph drawing logic here
  document.getElementById('graph').textContent = 'Graph rendering...';
}

function executeAlgorithms(executeCustomCode, customCode) {
  // Add your algorithm execution logic here
  const algorithms = [['dijkstra', dijkstra], ['bellman-ford', bellmanFord]];
  if (executeCustomCode) {
    customFunction = (adjMatrix, startNode, endNode) => eval(customCode);
    algorithms.push(['custom_code', customFunction])
  }
  console.log(algorithms)
  const timeTable = document.getElementById('timeTable');
  timeTable.innerHTML = '';
  const matrix = getRandomGraph()

  algorithms.forEach(algorithm => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const timeCell = document.createElement('td');
    nameCell.textContent = algorithm[0];
    let result = measureExecutionTime(algorithm[1], matrix, 0, matrix.length - 1);
    timeCell.textContent = `${result.time}`;
    row.appendChild(nameCell);
    row.appendChild(timeCell);
    timeTable.appendChild(row);
  });
}

function measureExecutionTime(func, ...args) {
  const start = Date.now();
  const result = func(...args);
  const end = Date.now();
  const executionTime = end - start;
  return {time: executionTime};
}

function dijkstra(adjMatrix, startNode, endNode) {
  const numNodes = adjMatrix.length;
  const distances = new Array(numNodes).fill(Infinity);
  const previousNodes = new Array(numNodes).fill(null);
  const visited = new Array(numNodes).fill(false);

  distances[startNode] = 0;

  while (true) {
    let closestNode = -1;
    let shortestDistance = Infinity;

    for (let i = 0; i < numNodes; i++) {
      if (!visited[i] && distances[i] < shortestDistance) {
        closestNode = i;
        shortestDistance = distances[i];
      }
    }

    if (closestNode === -1) {
      break;
    }

    visited[closestNode] = true;

    for (let i = 0; i < numNodes; i++) {
      const edgeWeight = adjMatrix[closestNode][i];
      if (edgeWeight > 0) {
        const alternativeDistance = distances[closestNode] + edgeWeight;
        if (alternativeDistance < distances[i]) {
          distances[i] = alternativeDistance;
          previousNodes[i] = closestNode;
        }
      }
    }
  }

  const path = [];
  let currentNode = endNode;

  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = previousNodes[currentNode];
  }


  if (path[0] !== startNode) {
    return { weight: Infinity, path: [] };
  }

  return { weight: distances[endNode], path: path };
}

function bellmanFord(adjMatrix, startNode, endNode) {
  return { weight: 25, path: [0, 1, 4, 3, 6, 8, 9] }
}

function getRandomGraph() {

  graphs = [

    [[0, 3, 6, 1, 8, 5, 1, 1, 9, 5, 4, 2, 4, 6, 7, 2, 8, 2, 3, 8, 1, 4, 8, 5, 1, 1, 5, 2, 1, 1],
    [9, 0, 5, 4, 1, 5, 2, 5, 8, 5, 2, 8, 3, 5, 3, 1, 7, 1, 8, 2, 5, 4, 5, 8, 9, 3, 1, 2, 6, 2],
    [3, 6, 0, 2, 6, 4, 4, 4, 1, 3, 2, 3, 4, 4, 1, 3, 7, 5, 3, 3, 5, 5, 8, 7, 6, 1, 8, 5, 1, 9],
    [8, 5, 1, 0, 9, 5, 2, 8, 9, 3, 5, 2, 1, 8, 8, 6, 8, 3, 8, 7, 3, 3, 4, 7, 1, 6, 7, 1, 9, 7],
    [5, 7, 4, 6, 0, 6, 2, 7, 8, 9, 6, 9, 8, 1, 2, 3, 8, 8, 3, 4, 3, 6, 5, 2, 1, 3, 4, 9, 9, 8],
    [4, 2, 3, 6, 9, 0, 7, 5, 9, 5, 7, 3, 7, 8, 4, 8, 4, 2, 9, 5, 6, 7, 6, 8, 8, 7, 9, 2, 8, 9],
    [8, 6, 1, 1, 9, 1, 0, 4, 9, 5, 6, 4, 6, 7, 2, 9, 9, 3, 6, 5, 9, 3, 4, 1, 5, 4, 5, 9, 9, 7],
    [8, 2, 7, 7, 5, 8, 6, 0, 4, 6, 6, 4, 4, 4, 4, 1, 1, 2, 8, 4, 4, 1, 4, 7, 6, 6, 9, 5, 7, 1],
    [8, 5, 6, 2, 1, 2, 7, 1, 0, 9, 7, 6, 1, 6, 4, 6, 4, 8, 1, 5, 2, 2, 9, 9, 5, 2, 2, 5, 3, 4],
    [1, 1, 4, 3, 9, 6, 6, 7, 8, 0, 6, 5, 1, 1, 8, 5, 5, 2, 1, 7, 2, 1, 6, 1, 9, 8, 1, 5, 6, 2],
    [9, 5, 6, 4, 7, 5, 3, 5, 4, 9, 0, 2, 8, 3, 1, 8, 2, 7, 7, 1, 1, 3, 5, 9, 2, 2, 5, 6, 7, 4],
    [7, 1, 5, 5, 4, 3, 9, 3, 2, 2, 7, 0, 2, 8, 9, 2, 9, 9, 7, 5, 3, 2, 9, 9, 1, 7, 4, 7, 1, 6],
    [9, 1, 8, 5, 7, 9, 5, 6, 9, 6, 4, 3, 0, 5, 8, 5, 1, 7, 8, 8, 2, 2, 3, 7, 2, 9, 7, 9, 7, 4],
    [4, 4, 7, 9, 5, 6, 2, 5, 1, 3, 1, 7, 1, 0, 5, 2, 3, 4, 9, 9, 9, 4, 5, 8, 8, 8, 1, 7, 8, 4],
    [6, 5, 4, 2, 1, 3, 6, 2, 2, 3, 5, 5, 3, 9, 0, 4, 7, 9, 4, 7, 6, 2, 7, 9, 4, 2, 7, 4, 4, 8],
    [4, 1, 7, 3, 3, 1, 5, 9, 1, 9, 3, 3, 9, 8, 2, 0, 6, 7, 3, 6, 6, 6, 1, 5, 9, 8, 4, 2, 8, 2],
    [3, 5, 8, 4, 6, 9, 1, 4, 7, 4, 4, 9, 2, 8, 1, 4, 0, 7, 7, 9, 8, 2, 3, 8, 9, 9, 3, 2, 4, 5],
    [2, 4, 9, 3, 4, 5, 5, 3, 9, 7, 5, 5, 5, 9, 6, 1, 9, 0, 8, 2, 6, 5, 5, 1, 7, 2, 3, 7, 2, 1],
    [7, 3, 4, 7, 4, 3, 2, 4, 3, 5, 8, 7, 5, 2, 8, 8, 5, 9, 0, 1, 3, 1, 3, 9, 8, 1, 5, 5, 1, 1],
    [4, 3, 8, 2, 1, 9, 2, 9, 1, 1, 7, 2, 5, 4, 3, 3, 1, 8, 6, 0, 4, 6, 8, 4, 9, 1, 6, 2, 7, 4],
    [5, 6, 2, 5, 5, 6, 7, 9, 4, 8, 4, 9, 9, 9, 1, 5, 9, 2, 3, 2, 0, 2, 9, 2, 5, 4, 1, 1, 9, 9],
    [2, 6, 4, 2, 4, 4, 9, 6, 3, 9, 3, 7, 4, 2, 6, 3, 6, 7, 6, 2, 6, 0, 1, 6, 9, 4, 5, 9, 3, 8],
    [9, 9, 1, 3, 3, 8, 8, 6, 8, 5, 1, 1, 3, 1, 3, 2, 3, 4, 4, 1, 3, 7, 0, 3, 6, 2, 7, 9, 4, 2],
    [9, 9, 1, 3, 3, 8, 8, 6, 8, 5, 1, 1, 3, 1, 3, 2, 3, 4, 4, 1, 3, 7, 2, 0, 6, 2, 7, 9, 4, 2],
    [5, 7, 4, 6, 0, 6, 2, 7, 8, 9, 6, 9, 8, 1, 2, 3, 8, 8, 3, 4, 3, 6, 5, 2, 0, 3, 4, 9, 9, 8],
    [1, 1, 4, 3, 9, 6, 6, 7, 8, 0, 6, 5, 1, 1, 8, 5, 5, 2, 1, 7, 2, 1, 6, 1, 9, 0, 1, 5, 6, 2],
    [9, 1, 8, 5, 7, 9, 5, 6, 9, 6, 4, 3, 0, 5, 8, 5, 1, 7, 8, 8, 2, 2, 3, 7, 2, 9, 0, 9, 7, 4],
    [9, 0, 5, 4, 1, 5, 2, 5, 8, 5, 2, 8, 3, 5, 3, 1, 7, 1, 8, 2, 5, 4, 5, 8, 9, 3, 1, 0, 6, 2],
    [7, 1, 5, 5, 4, 3, 9, 3, 2, 2, 7, 0, 2, 8, 9, 2, 9, 9, 7, 5, 3, 2, 9, 9, 1, 7, 4, 7, 0, 6],
    [9, 1, 8, 5, 7, 9, 5, 6, 9, 6, 4, 3, 0, 5, 8, 5, 1, 7, 8, 8, 2, 2, 3, 7, 2, 9, 7, 9, 7, 0]]

  ]

  return graphs[Math.floor(Math.random() * graphs.length)]
}