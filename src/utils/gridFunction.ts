import { Point } from './Canvas.types';

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

const drawArea = (context: CanvasRenderingContext2D, area: number) => {
  context.font = '16px Arial';
  context.fillText(
    `Area: ${area.toFixed(2)} px²`,
    context.canvas.width - 150,
    context.canvas.height - 20,
  );
};

// Helper functions
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

const calculateDistance = (A: Point, B: Point) => {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const drawDistance = (context: CanvasRenderingContext2D, A: Point, B: Point, distance: number) => {
  const midX = (A.x + B.x) / 2 - 5;
  const midY = (A.y + B.y) / 2 - 5;
  context.font = '14px Arial';
  context.fillText(`${distance.toFixed(2)} cm`, midX, midY);
};

const pixelsToCentimeters = (pixels: number) => {
  const pixelsPerCentimeter = 60; // 2 squares of 30px each
  return pixels / pixelsPerCentimeter;
};

const calculateAreaInCm = (points: Point[]) => {
  const areaInPixels = calculateArea(points);
  const areaInCm = areaInPixels / (60 * 60); // 60px = 1cm, so 60*60px^2 = 1cm^2
  return areaInCm;
};

export {
  drawArea,
  drawGrid,
  drawPoint,
  calculateAngle,
  calculateArea,
  calculateDistance,
  drawDistance,
  pixelsToCentimeters,
  calculateAreaInCm,
};
