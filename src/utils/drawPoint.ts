import { Point } from './Canvas.types';

export const drawPoint = (context: CanvasRenderingContext2D, point: Point) => {
  context.beginPath();
  context.arc(point.x, point.y, 5, 0, 2 * Math.PI, false);
  context.fillStyle = 'black';
  context.fill();
  context.font = '20px Arial';
  context.fillText(point.name, point.x + 10, point.y + 10);
};
