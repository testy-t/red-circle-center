
import { useEffect, useRef, useState } from "react";

const RedCircle = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [direction, setDirection] = useState({ x: 1, y: 1 });
  const [color, setColor] = useState("bg-red-500");

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500"
  ];

  const changeColor = () => {
    const currentIndex = colors.indexOf(color);
    const nextIndex = (currentIndex + 1) % colors.length;
    setColor(colors[nextIndex]);
  };

  useEffect(() => {
    const moveCircle = () => {
      if (!containerRef.current || !circleRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const circleWidth = circleRef.current.clientWidth;
      const circleHeight = circleRef.current.clientHeight;

      let newX = position.x + direction.x * 5;
      let newY = position.y + direction.y * 5;
      let newDirectionX = direction.x;
      let newDirectionY = direction.y;
      let colorChanged = false;

      // Проверка столкновения с горизонтальными границами
      if (newX + circleWidth > containerWidth || newX < 0) {
        newDirectionX = -direction.x;
        colorChanged = true;
      }

      // Проверка столкновения с вертикальными границами
      if (newY + circleHeight > containerHeight || newY < 0) {
        newDirectionY = -direction.y;
        colorChanged = true;
      }

      if (colorChanged) {
        changeColor();
      }

      setPosition({ x: newX, y: newY });
      setDirection({ x: newDirectionX, y: newDirectionY });
    };

    const animationId = setInterval(moveCircle, 30);
    return () => clearInterval(animationId);
  }, [position, direction, color]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden"
    >
      <div
        ref={circleRef}
        className={`w-16 h-16 ${color} rounded-full shadow-lg absolute transition-colors duration-300`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </div>
  );
};

export default RedCircle;
