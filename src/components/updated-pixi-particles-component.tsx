import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import styled from 'styled-components';

const ParticlesContainer = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
`;

const PixiParticles = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: 300,
      height: 300,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
    });

    containerRef.current.appendChild(app.view);

    const container = new PIXI.Container();
    app.stage.addChild(container);

    const particles = [];

    for (let i = 0; i < 100; i++) {
      const particle = new PIXI.Sprite(PIXI.Texture.WHITE);
      particle.x = Math.random() * app.screen.width;
      particle.y = Math.random() * app.screen.height;
      particle.tint = Math.random() * 0xFFFFFF;
      particle.anchor.set(0.5);
      particle.scale.set(0.1 + Math.random() * 0.3);
      particle.direction = Math.random() * Math.PI * 2;
      particle.turningSpeed = Math.random() - 0.8;
      particle.speed = (2 + Math.random() * 2) * 0.2;
      particle.offset = Math.random() * 100;
      container.addChild(particle);
      particles.push(particle);
    }

    let elapsed = Date.now();

    const animate = (delta) => {
      const now = Date.now();
      particles.forEach((particle, i) => {
        const { x, y, direction, turningSpeed, speed, offset } = particle;
        const angle = 0.1 * (i + offset);
        particle.scale.y = Math.sin(angle) * 0.3 + 0.7;
        particle.x += Math.sin(direction) * (speed * particle.scale.y);
        particle.y += Math.cos(direction) * (speed * particle.scale.y);
        particle.direction += turningSpeed * 0.01;
        if (x < 0 || x > app.screen.width) {
          particle.x = x < 0 ? app.screen.width : 0;
        }
        if (y < 0 || y > app.screen.height) {
          particle.y = y < 0 ? app.screen.height : 0;
        }
      });
      elapsed = now;
    };

    app.ticker.add(animate);

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, []);

  return <ParticlesContainer ref={containerRef} />;
};

export default PixiParticles;
