1. src/components/Tesseract.js
```jsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const SvgContainer = styled.svg`
  width: 60vw;
  max-height: calc(100vh - 120px);
  filter: drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.4));
  opacity: 0;
  transition: stroke 0.3s cubic-bezier(0.455, 0.03, 0.515, 0.955);
`;

const Tesseract = ({ isDarkMode }) => {
  const tesseractRef = useRef(null);

  useEffect(() => {
    const tesseract = tesseractRef.current;
    tesseract.style.opacity = 1;

    const animateTesseract = () => {
      // Animation logic here
      // You can manipulate the SVG elements directly or use a library like GSAP
    };

    const animationFrame = requestAnimationFrame(function animate() {
      animateTesseract();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <SvgContainer ref={tesseractRef} viewBox="0 0 1140.6 1314.9">
      {/* Insert the full tesseract SVG code here */}
      {/* This is a placeholder, replace with actual tesseract SVG */}
      <polygon points="0,0 100,0 50,100" fill={isDarkMode ? "#FFF" : "#000"} />
    </SvgContainer>
  );
};

export default Tesseract;
```

2. src/components/GameOfLife.js
```jsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const GameOfLife = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Game of Life implementation
    const CELL_SIZE = 10;
    const COLS = Math.floor(canvas.width / CELL_SIZE);
    const ROWS = Math.floor(canvas.height / CELL_SIZE);
    let grid = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0));

    // Initialize random grid
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        grid[i][j] = Math.random() > 0.7 ? 1 : 0;
      }
    }

    function updateGrid() {
      const newGrid = grid.map(arr => [...arr]);
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          const neighbors = countNeighbors(i, j);
          if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
            newGrid[i][j] = 0;
          } else if (grid[i][j] === 0 && neighbors === 3) {
            newGrid[i][j] = 1;
          }
        }
      }
      grid = newGrid;
    }

    function countNeighbors(x, y) {
      let sum = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          const row = (x + i + ROWS) % ROWS;
          const col = (y + j + COLS) % COLS;
          sum += grid[row][col];
        }
      }
      sum -= grid[x][y];
      return sum;
    }

    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (grid[i][j] === 1) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
          }
        }
      }
    }

    function animate() {
      updateGrid();
      drawGrid();
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default GameOfLife;
```

3. src/components/ThreeScene.js
```jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

function RotatingBox() {
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta;
  });
  return (
    <Box ref={meshRef} args={[1, 1, 1]}>
      <meshStandardMaterial color="hotpink" />
    </Box>
  );
}

const ThreeScene = () => {
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, zIndex: -2 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <RotatingBox />
    </Canvas>
  );
};

export default ThreeScene;
```

4. src/components/PixiParticles.js
```jsx
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const PixiParticles = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view);

    const particles = new PIXI.ParticleContainer(1000, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true,
    });

    app.stage.addChild(particles);

    const particleTexture = PIXI.Texture.from('https://pixijs.io/examples/examples/assets/bunny.png');

    const particlesData = [];
    for (let i = 0; i < 1000; i++) {
      const particle = new PIXI.Sprite(particleTexture);
      particle.anchor.set(0.5);
      particle.scale.set(0.2);
      particle.x = Math.random() * app.screen.width;
      particle.y = Math.random() * app.screen.height;
      particles.addChild(particle);

      particlesData.push({
        sprite: particle,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
      });
    }

    app.ticker.add(() => {
      for (let i = 0; i < particlesData.length; i++) {
        const particle = particlesData[i];
        particle.sprite.x += particle.vx;
        particle.sprite.y += particle.vy;

        if (particle.sprite.x < 0 || particle.sprite.x > app.screen.width) {
          particle.vx *= -1;
        }
        if (particle.sprite.y < 0 || particle.sprite.y > app.screen.height) {
          particle.vy *= -1;
        }
      }
    });

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -3 }} />;
};

export default PixiParticles;
```

5. src/App.js
```jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Tesseract from './components/Tesseract';
import GameOfLife from './components/GameOfLife';
import ThreeScene from './components/ThreeScene';
import PixiParticles from './components/PixiParticles';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.isDarkMode ? '#222' : '#f0f0f0'};
  color: ${props => props.isDarkMode ? '#fff' : '#000'};
  transition: background-color 0.3s ease;
`;

const ControlPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGameOfLife, setShowGameOfLife] = useState(true);
  const [showThreeScene, setShowThreeScene] = useState(true);
  const [showPixiParticles, setShowPixiParticles] = useState(true);

  return (
    <AppContainer isDarkMode={isDarkMode}>
      <Tesseract isDarkMode={isDarkMode} />
      {showGameOfLife && <GameOfLife />}
      {showThreeScene && <ThreeScene />}
      {showPixiParticles && <PixiParticles />}
      <ControlPanel>
        <Button onClick={() => setIsDarkMode(!isDarkMode)}>
          Toggle Dark Mode
        </Button>
        <Button onClick={() => setShowGameOfLife(!showGameOfLife)}>
          Toggle Game of Life
        </Button>
        <Button onClick={() => setShowThreeScene(!showThreeScene)}>
          Toggle Three.js Scene
        </Button>
        <Button onClick={() => setShowPixiParticles(!showPixiParticles)}>
          Toggle Pixi.js Particles
        </Button>
      </ControlPanel>
    </AppContainer>
  );
}

export default App;
```

6. src/index.js (update)
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

7. src/index.css (update)
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

