import { Point } from '../utils/Canvas.types';

// Draw a 30px grid
export const drawGrid = (
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
export const drawPoint = (context: CanvasRenderingContext2D, point: Point) => {
  context.beginPath();
  context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
  context.fill();
  context.fillStyle = 'black';
  context.fill();
  context.font = '20px Arial';
  context.fillText(point.name, point.x + 10, point.y + 10);
};

export const drawArea = (context: CanvasRenderingContext2D, area: number) => {
  context.font = '16px Arial';
  context.fillText(
    `Area: ${area.toFixed(2)} px²`,
    context.canvas.width - 150,
    context.canvas.height - 20,
  );
};
