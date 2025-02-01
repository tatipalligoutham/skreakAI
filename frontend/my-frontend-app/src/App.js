import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const Grid = () => {
  
  const [grid, setGrid] = useState(Array(20).fill(null).map(() => Array(20).fill(null)));
  const [points, setPoints] = useState([]); 
  const [distance, setDistance] = useState(null); 
  const [path, setPath] = useState([]); 

  
  const handleClick = (row, col) => {
    const newPoint = { x: row, y: col };

    
    if (points.some(p => p.x === row && p.y === col)) {
      setPoints(points.filter(p => p.x !== row || p.y !== col));
    } else if (points.length < 2) {
      
      setPoints([...points, newPoint]);
    }
  };

 
  const calculateDistance = async () => {
    if (points.length === 2) {
      try {
        const response = await axios.post('http://localhost:5000/shortest-path', {
          source: points[0],
          destination: points[1]
        });
        console.log('Sending source:', points[0]);
        console.log('Sending destination:', points[1]);
        console.log('Response from backend:', response.data);
        setDistance(response.data.distance); 
        setPath(response.data.path || []);
      } catch (error) {
        console.error('Error calculating distance:', error);
        alert('There was an error calculating the distance.');
      }
    }
  };

  
  const isPathCell = (row, col) => {
    return path.some(p => p.x === row && p.y === col); 
  };

  return (
    <div className="grid-container">
      <div className="grid">
        {grid.map((row, i) => (
          <div key={i} className="row">
            {row.map((_, j) => (
              <div
                key={j}
                className={`cell
                  ${points.some(p => p.x === i && p.y === j) ? 'selected' : ''}
                  ${((i + j) % 2 === 0) ? 'black' : 'white'}
                  ${isPathCell(i, j) ? 'path' : ''}`}
                onClick={() => handleClick(i, j)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={calculateDistance} disabled={points.length !== 2}>
        Find Shortest Path
      </button>
      {distance !== null && <p>Shortest Distance: {distance}</p>}
    </div>
  );
};

export default Grid;
