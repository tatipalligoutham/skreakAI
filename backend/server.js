const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const directions = [
  { x: -1, y: 0 }, 
  { x: 1, y: 0 },  
  { x: 0, y: -1 }, 
  { x: 0, y: 1 },  
];


function findShortestPath(source, destination) {
  console.log('Finding path from', source, 'to', destination);

  const queue = [[source]]; 
  const visited = new Set();
  visited.add(`${source.x},${source.y}`);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1]; 

    if (current.x === destination.x && current.y === destination.y) {
      console.log('Path found:', path);
      return path; 
    }

    for (const dir of directions) {
      const next = { x: current.x + dir.x, y: current.y + dir.y };

      if (next.x >= 0 && next.x < 20 && next.y >= 0 && next.y < 20 && !visited.has(`${next.x},${next.y}`)) {
        visited.add(`${next.x},${next.y}`);
        queue.push([...path, next]); 
      }
    }
  }

  console.log('No path found.');
  return [];
}

app.post('/shortest-path', (req, res) => {
  const { source, destination } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ error: 'Source and destination points are required.' });
  }

  const path = findShortestPath(source, destination);

  const distance = path.length > 0 ? path.length - 1 : null; 

  console.log('Calculated path:', path);

  res.json({
    distance: distance,
    path:path
  });
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
