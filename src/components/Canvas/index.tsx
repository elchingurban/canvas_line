import React, { useRef, useEffect, useState } from 'react';

import styles from './Canvas.module.scss';
import { Point } from '../../utils/Canvas.types';
// type Point = {
//   x: number;
//   y: number;
//   name: string;
// };
import { drawGrid, drawPoint, drawArea } from '../../utils/drawGrid';

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

    const calculateAngle = (A: Point, B: Point, C: Point) => {
      const BA = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
      const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
      const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
      return Math.acos((BA * BA + BC * BC - AC * AC) / (2 * BA * BC));
    };

    const calculateArea = (points: Point[]) => {
      let area = 0;
      for (let i = 0; i < points.length; i++) {
        const { x: x1, y: y1 } = points[i];
        const { x: x2, y: y2 } = points[(i + 1) % points.length]; // Use modulo to loop back to the first point
        area += x1 * y2 - x2 * y1;
      }
      return Math.abs(area) / 2;
    };

    // Add a point and draw a line to the previous point when the canvas is clicked
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round((event.clientX - rect.left) / 30) * 30;
      const y = Math.round((event.clientY - rect.top) / 30) * 30;
      const newPoint: Point = { x, y, name: String.fromCharCode(65 + (points.length % 26)) }; // Names will be A, B, C, ..., Z, A, B, C, ...
      setPoints((prevPoints) => {
        const updatedPoints = [...prevPoints, newPoint];
        if (updatedPoints.length >= 3) {
          const A = updatedPoints[updatedPoints.length - 3];
          const B = updatedPoints[updatedPoints.length - 2];
          const C = updatedPoints[updatedPoints.length - 1];
          const angle = calculateAngle(A, B, C);
          console.log(
            `The angle between points ${A.name}(${A.x}, ${A.y}), ${B.name}(${B.x}, ${B.y}), and ${
              C.name
            }(${C.x}, ${C.y}) is ${angle} radians or ${angle * (180 / Math.PI)} degrees.`,
          );
        }
        return updatedPoints;
      });
      // If the user clicked near the starting point and there are at least 3 points, close the polygon
      if (points.length >= 3) {
        const start = points[0];
        const dx = x - start.x;
        const dy = y - start.y;
        if (Math.sqrt(dx * dx + dy * dy) < 10) {
          // 10 is the radius within which we consider the points to be "near" each other
          context?.beginPath();
          context?.moveTo(points[points.length - 1].x, points[points.length - 1].y);
          context?.lineTo(start.x, start.y);
          context?.stroke();
          const area = calculateArea(points);
          console.log(`The area of the polygon is ${area} square pixels.`);
          if (context) {
            drawArea(context, area);
          }
          return;
        }
      }
      const point: Point = { x, y, name: currentPointName };
      // setPoints((points) => [...points, point]);
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
