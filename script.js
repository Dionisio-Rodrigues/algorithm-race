var matrix = null
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var container = document.getElementById('mynetwork');
var data = { nodes: nodes, edges: edges };
var options = {
  physics: true,
  nodes: {
    shape: 'circle',
    size: 16,
  }
};
var network = null

document.getElementById('startButton').addEventListener('click', function () {
  const customCode = document.getElementById('codeInput').value;
  const executeCustomCode = document.getElementById('toggleCustomCode').checked;
  executeAlgorithms(executeCustomCode, customCode);
});

window.onload = function () {
  matrix = getRandomGraph()
  drawGraph(matrix)
}

document.getElementById('genGraphBttn').addEventListener('click', function () {
  matrix = getRandomGraph()
  drawGraph(matrix)
})

function drawGraph(matrix) {
  nodes.clear()
  edges.clear()

  for (var i = 0; i < matrix.length; i++) {
    nodes.add({ id: i, label: '' + i });
  }

  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== 0) {
        edges.add({ from: i, to: j, arrows: 'to', label: `${matrix[i][j]}` });
      }
    }
  }

  network = new vis.Network(container, data, options);
}

function executeAlgorithms(executeCustomCode, customCode) {
  const algorithms = [['dijkstra', dijkstra], ['bellman-ford', bellmanFord], ['floyd-warshall', floydWarshall]];
  if (executeCustomCode) {
    customFunction = (adjMatrix, startNode, endNode) => eval(customCode);
    algorithms.push(['custom code', customFunction])
  }
  const startNode = parseInt(document.getElementById('startNode').value);
  const endNode = parseInt(document.getElementById('endNode').value);
  const timeTable = document.getElementById('timeTable');
  timeTable.innerHTML = '';

  if (isNaN(startNode) || isNaN(endNode)) {
    alert(`Valores brancos não são permitidos`)
    return
  }

  if (startNode < 0 || endNode < 0 || endNode > matrix.length - 1 || startNode > matrix.length - 1) {
    alert(`Valor inválido, valores permitidos: de 0 a ${matrix.length - 1}`)
    return
  }

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
  const start = performance.now();
  const result = func(...args);
  console.log(result)
  const end = performance.now();
  console.log(start, end)
  const executionTime = end - start;
  return { time: executionTime };
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
  const n = adjMatrix.length;
  const distances = new Array(n).fill(Infinity);
  const predecessors = new Array(n).fill(null);
  distances[startNode] = 0;

  for (let k = 0; k < n - 1; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (adjMatrix[i][j] !== 0 && distances[i] !== Infinity && distances[j] > distances[i] + adjMatrix[i][j]) {
          distances[j] = distances[i] + adjMatrix[i][j];
          predecessors[j] = i;
        }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (adjMatrix[i][j] !== 0 && distances[i] !== Infinity && distances[j] > distances[i] + adjMatrix[i][j]) {
        return { weight: distances[endNode]};
      }
    }
  }

  return { weight: distances[endNode]};
}

function floydWarshall(adjMatrix, startNode, endNode) {
  const n = adjMatrix.length;
  const dist = adjMatrix.map(row => row.slice());

  console.log(dist)

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        
        if (i !== j && dist[i][j] === 0)
          dist[i][j] = Infinity

        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
      }
    }
  }

  return { weight: dist[startNode][endNode] };
}


function getRandomGraph() {

  graphs = [
    [
      [0, 0, 0, 0, 0, 0],
      [7, 0, 5, 0, 2, 3],
      [2, 0, 0, 4, 0, 6],
      [0, 1, 4, 0, 0, 2],
      [0, 6, 0, 3, 0, 1],
      [0, 2, 3, 0, 5, 0]
    ],

    [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 6, 0, 7, 2],
      [3, 0, 0, 5, 0, 4],
      [6, 4, 0, 0, 1, 0],
      [0, 0, 3, 2, 0, 5],
      [0, 2, 0, 3, 4, 0]
    ]
  ]

  return graphs[Math.floor(Math.random() * graphs.length)]
}

function addNode() {
  nodeId = matrix.length
  matrix.push(new Array(matrix.length).fill(0))
  matrix.forEach(element => {
    element.push(0)
  });
  nodes.add({ id: nodeId, label: `${nodeId}` });
}

function removeNode() {
  nodeId = matrix.length - 1
  edges.forEach(function (edge) {
    if (edge.from == nodeId || edge.to == nodeId) {
      edges.remove(edge.id);
    }
  });
  matrix.pop()
  matrix.forEach(element => {
    element.pop()
  })
  nodes.remove({ id: nodeId });
}

function addEdge() {
  var fromNode = parseInt(document.getElementById('fromNode').value);
  var toNode = parseInt(document.getElementById('toNode').value);
  var weight = parseInt(document.getElementById('weigthNode').value);

  matrix[fromNode][toNode] = weight

  if (!isNaN(fromNode) && !isNaN(toNode)) {
    network.body.data.edges.add({
      from: fromNode,
      to: toNode,
      arrows: 'to',
      label: `${weight}`
    });
  }
}

function removeEdge() {
  var fromNode = parseInt(document.getElementById('removeFromNode').value);
  var toNode = parseInt(document.getElementById('removeToNode').value);

  matrix[fromNode][toNode] = 0

  if (!isNaN(fromNode) && !isNaN(toNode)) {
    let edges = network.getConnectedEdges(fromNode);
    for (let edge of edges) {
      if (toNode == network.body.edges[edge].to.id) {
        network.body.data.edges.remove(edge);
        break;
      }
    }
  }
}