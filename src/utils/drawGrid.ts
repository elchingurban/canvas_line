export const drawGrid = (context: CanvasRenderingContext2D, width: number, height: number) => {
  context.clearRect(0, 0, width, height);
  const gridSize = 30; // px
  context.strokeStyle = '#ddd'; // Grid line color

  for (let x = 0; x <= width; x += gridSize) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }

  for (let y = 0; y <= height; y += gridSize) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }

  context.stroke();
};
