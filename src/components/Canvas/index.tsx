import React, { useRef, useEffect, useState } from 'react';

import styles from './Canvas.module.scss';
import { Point } from '../../utils/Canvas.types';
// type Point = {
//   x: number;
//   y: number;
// };

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [currentPointName, setCurrentPointName] = useState('A');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Resize the canvas to fill the window and draw the grid
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawGrid(context, canvas.width, canvas.height, 30);
      points.forEach((point) => drawPoint(context, point));
    };

    // Draw a 30px grid
    const drawGrid = (
      context: CanvasRenderingContext2D,
      width: number,
      height: number,
      step: number,
    ) => {
      context.beginPath();
      context.strokeStyle = '#ddd'; // Grid line color
      for (let x = 0; x <= width; x += step) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += step) {
        context.moveTo(0, y);
        context.lineTo(width, y);
      }
      context.stroke();
    };

    // Draw a point
    const drawPoint = (context: CanvasRenderingContext2D, point: Point) => {
      context.beginPath();
      context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      context.fill();
      context.fillStyle = 'black';
      context.fill();
      context.font = '20px Arial';
      context.fillText(point.name, point.x + 10, point.y + 10);
    };

    // Add a point and draw a line to the previous point when the canvas is clicked
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round((event.clientX - rect.left) / 30) * 30;
      const y = Math.round((event.clientY - rect.top) / 30) * 30;
      const point: Point = { x, y, name: currentPointName };
      setPoints((points) => [...points, point]);
      setCurrentPointName(String.fromCharCode(currentPointName.charCodeAt(0) + 1));
      console.log(currentPointName);
      const nextCharCode = currentPointName.charCodeAt(0) + 1;
      if (nextCharCode > 'Z'.charCodeAt(0)) {
        const numberPart = currentPointName.slice(1);
        const nextNumberPart = numberPart ? parseInt(numberPart) + 1 : 1;
        setCurrentPointName('A' + nextNumberPart);
      } else {
        setCurrentPointName(String.fromCharCode(nextCharCode) + currentPointName.slice(1));
      }
      drawPoint(context, point);
    };

    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [points, currentPointName]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Draw lines between points
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = '#000';
    points.forEach((point, i) => {
      if (i === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();
  }, [points]);

  return <canvas ref={canvasRef} className={styles.grid} />;
};

export default Canvas;
