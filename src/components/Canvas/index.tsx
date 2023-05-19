import React, { useRef, useEffect, useState } from 'react';

import { GridContext } from '../../context/GridContext';

import styles from './Canvas.module.scss';

import { Point } from '../../utils/Canvas.types';
import {
  drawGrid,
  drawPoint,
  drawArea,
  calculateAngle,
  calculateArea,
  calculateDistance,
  drawDistance,
  pixelsToCentimeters,
} from '../../utils/gridFunction';
import { AlertComponent } from '../../layout/Alert';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  // const [currentPointName, setCurrentPointName] = useState('A');
  const [area, setArea] = useState<number | null>(null);
  const [, setHistory] = useState<Point[][]>([]);

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

    // Add a point and draw a line to the previous point when the canvas is clicked
    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round((event.clientX - rect.left) / 30) * 30;
      const y = Math.round((event.clientY - rect.top) / 30) * 30;

      // const newPoint: Point = { x, y, name: String.fromCharCode(65 + (points.length % 26)) };
      const newPointName = String.fromCharCode(65 + (points.length % 26));
      const newPoint: Point = { x, y, name: newPointName };
      setPoints((prevPoints) => {
        const updatedPoints = [...prevPoints, newPoint];

        setHistory((prevHistory) => [...prevHistory, updatedPoints]);
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
        if (points.length >= 3) {
          const start = points[0];
          const dx = x - start.x;
          const dy = y - start.y;
          if (Math.sqrt(dx * dx + dy * dy) < 10) {
            // 10 is the radius within which we consider the points to be "near" each other
            context.beginPath();
            context.moveTo(points[points.length - 1].x, points[points.length - 1].y);
            context.lineTo(start.x, start.y);
            context.stroke();
            const areaInPixels = calculateArea(points);
            const areaInCmSquare = pixelsToCentimeters(areaInPixels);
            console.log(`The area of the polygon is ${areaInCmSquare} square cm.`);
            drawArea(context, areaInCmSquare);
          }
        }
        return updatedPoints;
      });
      console.log(newPointName);

      drawPoint(context, newPoint);
    };

    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Draw lines between points
    context.beginPath();
    context.lineWidth = 1;
    const isPolygonClosed =
      points.length >= 3 &&
      points[0].x === points[points.length - 1].x &&
      points[0].y === points[points.length - 1].y;

    context.strokeStyle = isPolygonClosed ? 'orange' : '#000';
    points.forEach((point, i) => {
      if (i === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
        const distanceInPixels = calculateDistance(points[i - 1], point);
        const distanceInCentimeters = pixelsToCentimeters(distanceInPixels);
        drawDistance(context, points[i - 1], point, distanceInCentimeters);
      }
    });
    context.stroke();
  }, [points]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        setHistory((prevHistory) => {
          if (prevHistory.length > 1) {
            const newHistory = prevHistory.slice(0, -1);
            setPoints(newHistory[newHistory.length - 1]);
            return newHistory;
          } else {
            return prevHistory;
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <GridContext.Provider value={{ area, setArea }}>
      <canvas ref={canvasRef} className={styles.grid} />
      <AlertComponent />
    </GridContext.Provider>
  );
};
