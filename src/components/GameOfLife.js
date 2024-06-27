import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
`;

const GameCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

const CELL_SIZE = 10;
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';

const GameOfLife = () => {
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState([]);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);

  const drawGrid = useCallback((context, currentGrid) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = currentGrid[row][col];
        
        context.fillStyle = cell ? ALIVE_COLOR : DEAD_COLOR;
        context.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        
        context.strokeStyle = GRID_COLOR;
        context.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }, [cols, rows]);

  const updateGrid = useCallback((currentGrid) => {
    const newGrid = currentGrid.map(arr => [...arr]);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const neighbors = countNeighbors(currentGrid, row, col);
        if (currentGrid[row][col]) {
          if (neighbors < 2 || neighbors > 3) newGrid[row][col] = false;
        } else {
          if (neighbors === 3) newGrid[row][col] = true;
        }
      }
    }

    return newGrid;
  }, [rows, cols]);

  const countNeighbors = (grid, row, col) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = (row + i + rows) % rows;
        const newCol = (col + j + cols) % cols;
        count += grid[newRow][newCol] ? 1 : 0;
      }
    }
    return count;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    const width = canvas.width;
    const height = canvas.height;
    
    const cols = Math.floor(width / CELL_SIZE);
    const rows = Math.floor(height / CELL_SIZE);
    
    setCols(cols);
    setRows(rows);
    
    // Initialize grid
    const initialGrid = Array(rows).fill().map(() => Array(cols).fill(false));
    setGrid(initialGrid);
    
    // Draw initial state
    drawGrid(context, initialGrid);
  }, [drawGrid]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGrid(currentGrid => {
        const newGrid = updateGrid(currentGrid);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        drawGrid(context, newGrid);
        return newGrid;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [drawGrid, updateGrid]);

  return (
    <GameContainer>
      <GameCanvas ref={canvasRef} width={300} height={300} />
    </GameContainer>
  );
};

export default GameOfLife;