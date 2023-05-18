import React, { useRef, useEffect, useState } from 'react';
import './Canvas.scss';

import { Point } from '../../utils/Canvas.types';
import { drawGrid } from '../../utils/drawGrid';
import { drawPoint } from '../../utils/drawPoint';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [currentPointName, setCurrentPointName] = useState('A');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawGrid(context, canvas.width, canvas.height);
      points.forEach((point) => drawPoint(context, point));
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const point: Point = { x, y, name: currentPointName };
      setPoints([...points, point]);
      setCurrentPointName(String.fromCharCode(currentPointName.charCodeAt(0) + 1));
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

  return <canvas ref={canvasRef} className='grid' />;
};
