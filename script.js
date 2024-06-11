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
  console.log(matrix)
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
      if (matrix[i][j] !== Infinity && i !== j) {
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
    let result = measureExecutionTime(algorithm[1], matrix, startNode, endNode);
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
  const numVertices = adjMatrix.length;
  const distances = Array(numVertices).fill(Infinity);
  const visited = Array(numVertices).fill(false);
  const priorityQueue = [[0, startNode]];
  distances[startNode] = 0;

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a[0] - b[0]);
    const [currentDistance, currentVertex] = priorityQueue.shift();

    if (visited[currentVertex]) {
      continue;
    }

    visited[currentVertex] = true;

    if (currentVertex === endNode) {
      break;
    }

    for (let neighbor = 0; neighbor < numVertices; neighbor++) {
      if (adjMatrix[currentVertex][neighbor] !== Infinity && !visited[neighbor]) {
        const distance = currentDistance + adjMatrix[currentVertex][neighbor];
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          priorityQueue.push([distance, neighbor]);
        }
      }
    }
  }

  return { weight : distances[endNode]};
}


function bellmanFord(adjMatrix, startNode, endNode) {
  return { weight: 0 };
}

function floydWarshall(adjMatrix, startNode, endNode) {
  const n = adjMatrix.length;
  const dist = adjMatrix.map(row => row.slice());

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
      }
    }
  }

  return { weight: dist[startNode][endNode] };
}


function getRandomGraph() {
  i = Infinity

  graphs = [
    [
      [0, 7, i, 3, 10, i, i, 2, i, 1],
      [7, 0, 5, i, i, i, 8, i, 3, i],
      [i, 5, 0, 2, 4, i, i, i, 9, 6],
      [3, i, 2, 0, i, 7, 1, i, i, i],
      [10, i, 4, i, 0, 5, i, 6, i, 8],
      [i, i, i, 7, 5, 0, 9, i, i, 2],
      [i, 8, i, 1, i, 9, 0, 4, 3, i],
      [2, i, i, i, 6, i, 4, 0, 5, i],
      [i, 3, 9, i, i, i, 3, 5, 0, 7],
      [1, i, 6, i, 8, 2, i, i, 7, 0]
    ]
  ]

  return graphs[Math.floor(Math.random() * graphs.length)]
}

function addNode() {
  nodeId = matrix.length
  matrix.push(new Array(matrix.length).fill(Infinity))
  matrix.forEach(element => {
    element.push(Infinity)
  });
  matrix[nodeId][nodeId] = 0
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

  if (!isNaN(fromNode) && !isNaN(toNode) && !isNaN(weight)) {

    if (weight == 0) return

    matrix[fromNode][toNode] = weight
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