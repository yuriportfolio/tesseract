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
  const appRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    appRef.current = new PIXI.Application({
      width: 300,
      height: 300,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
    });

    containerRef.current.appendChild(appRef.current.view);

    const container = new PIXI.Container();
    appRef.current.stage.addChild(container);

    const particles = [];

    for (let i = 0; i < 100; i++) {
      const particle = new PIXI.Sprite(PIXI.Texture.WHITE);
      particle.x = Math.random() * appRef.current.screen.width;
      particle.y = Math.random() * appRef.current.screen.height;
      particle.tint = Math.random() * 0xFFFFFF;
      particle.anchor.set(0.5);
      particle.scale.set(0.1 + Math.random() * 0.3);
      particle.direction = Math.random() * Math.PI * 2;
      particle.turningSpeed = Math.random() - 0.8;
      particle.speed = (2 + Math.random() * 2) * 0.2;
      container.addChild(particle);
      particles.push(particle);
    }

    const animate = () => {
      particles.forEach((particle) => {
        particle.x += Math.sin(particle.direction) * (particle.speed * particle.scale.y);
        particle.y += Math.cos(particle.direction) * (particle.speed * particle.scale.y);
        particle.direction += particle.turningSpeed * 0.01;
        if (particle.x < 0 || particle.x > appRef.current.screen.width) {
          particle.x = particle.x < 0 ? appRef.current.screen.width : 0;
        }
        if (particle.y < 0 || particle.y > appRef.current.screen.height) {
          particle.y = particle.y < 0 ? appRef.current.screen.height : 0;
        }
      });
    };

    appRef.current.ticker.add(animate);

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
      }
    };
  }, []);

  return <ParticlesContainer ref={containerRef} />;
};

export default PixiParticles;