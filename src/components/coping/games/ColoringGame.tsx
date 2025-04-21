
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Download } from "lucide-react";

const colors = [
  "#FF5733", // red-orange
  "#FFC300", // yellow
  "#36D7B7", // teal
  "#3498DB", // blue
  "#9B59B6", // purple
  "#2ECC71", // green
  "#F1C40F", // yellow
  "#E74C3C", // red
  "#1ABC9C", // turquoise
  "#8E44AD"  // dark purple
];

const patterns = [
  {
    name: "Mandala",
    paths: [
      "M50,50 m-45,0 a45,45 0 1,0 90,0 a45,45 0 1,0 -90,0",
      "M50,50 m-35,0 a35,35 0 1,0 70,0 a35,35 0 1,0 -70,0",
      "M50,50 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0",
      "M50,50 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0",
      "M50,5 L50,95 M5,50 L95,50 M15,15 L85,85 M15,85 L85,15",
      "M20,50 L80,50 M50,20 L50,80 M30,30 L70,70 M30,70 L70,30"
    ]
  },
  {
    name: "Nature",
    paths: [
      "M10,80 Q50,20 90,80", // hill
      "M20,50 Q35,20 50,50 Q65,20 80,50", // waves
      "M50,20 L50,80", // stem
      "M30,30 Q50,10 70,30 Q90,50 70,70 Q50,90 30,70 Q10,50 30,30" // flower
    ]
  },
  {
    name: "Geometric",
    paths: [
      "M20,20 L80,20 L80,80 L20,80 Z", // outer square
      "M35,35 L65,35 L65,65 L35,65 Z", // inner square
      "M20,20 L80,80 M80,20 L20,80", // X
      "M50,20 L80,50 L50,80 L20,50 Z", // diamond
      "M20,50 L50,20 L80,50 L50,80 Z" // diamond 2
    ]
  }
];

const ColoringGame = () => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [brushSize, setBrushSize] = useState(5);
  const [currentPattern, setCurrentPattern] = useState(patterns[0]);
  const [drawMode, setDrawMode] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to be same size as displayed
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw pattern as guides
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 1;
    
    currentPattern.paths.forEach(path => {
      ctx.beginPath();
      const pathObj = new Path2D(path);
      // Scale path to fit canvas
      ctx.save();
      ctx.scale(canvas.width / 100, canvas.height / 100);
      ctx.stroke(pathObj);
      ctx.restore();
    });
  }, [currentPattern]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getMousePosition(e);
    setLastPosition(pos);
    drawDot(pos);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const currentPosition = getMousePosition(e);
    drawLine(lastPosition, currentPosition);
    setLastPosition(currentPosition);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      setIsDrawing(true);
      const pos = getTouchPosition(e);
      setLastPosition(pos);
      drawDot(pos);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || e.touches.length !== 1) return;
    
    const currentPosition = getTouchPosition(e);
    drawLine(lastPosition, currentPosition);
    setLastPosition(currentPosition);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const getMousePosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const getTouchPosition = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  const drawDot = (position: { x: number, y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.arc(position.x, position.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = drawMode ? selectedColor : 'white';
    ctx.fill();
  };

  const drawLine = (start: { x: number, y: number }, end: { x: number, y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = drawMode ? selectedColor : 'white';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw pattern as guides
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 1;
    
    currentPattern.paths.forEach(path => {
      ctx.beginPath();
      const pathObj = new Path2D(path);
      // Scale path to fit canvas
      ctx.save();
      ctx.scale(canvas.width / 100, canvas.height / 100);
      ctx.stroke(pathObj);
      ctx.restore();
    });
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = `${currentPattern.name}-coloring.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Calm Coloring</h2>
          <p className="text-muted-foreground">Engage in mindful coloring to reduce stress</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={clearCanvas}>
            <RotateCcw className="mr-2 h-4 w-4" /> Clear
          </Button>
          <Button onClick={downloadCanvas}>
            <Download className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full aspect-square bg-white cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-medium">Pattern</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {patterns.map((pattern) => (
              <Button
                key={pattern.name}
                variant={currentPattern.name === pattern.name ? "default" : "outline"}
                onClick={() => setCurrentPattern(pattern)}
              >
                {pattern.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-medium">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color ? "border-primary" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setSelectedColor(color);
                  setDrawMode(true);
                }}
              />
            ))}
            <button
              className={`w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center ${
                drawMode ? "border-transparent" : "border-primary"
              }`}
              onClick={() => setDrawMode(false)}
            >
              <div className="w-4 h-4 bg-gray-300 rounded-full" />
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Brush Size</h3>
            <span>{brushSize}px</span>
          </div>
          <Slider
            value={[brushSize]}
            min={1}
            max={20}
            step={1}
            onValueChange={(vals) => setBrushSize(vals[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default ColoringGame;
