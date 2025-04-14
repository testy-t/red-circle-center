
import { useEffect, useRef, useState } from "react";

const RedCircle = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
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
    // Начальные размеры контейнера
    if (containerRef.current) {
      const initialWidth = window.innerWidth;
      const initialHeight = window.innerHeight;
      containerRef.current.style.width = `${initialWidth}px`;
      containerRef.current.style.height = `${initialHeight}px`;
    }

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
      if (newX + circleWidth > containerWidth) {
        newX = containerWidth - circleWidth;
        newDirectionX = -1;
        colorChanged = true;
      } else if (newX < 0) {
        newX = 0;
        newDirectionX = 1;
        colorChanged = true;
      }

      // Проверка столкновения с вертикальными границами
      if (newY + circleHeight > containerHeight) {
        newY = containerHeight - circleHeight;
        newDirectionY = -1;
        colorChanged = true;
      } else if (newY < 0) {
        newY = 0;
        newDirectionY = 1;
        colorChanged = true;
      }

      if (colorChanged) {
        changeColor();
      }

      setPosition({ x: newX, y: newY });
      setDirection({ x: newDirectionX, y: newDirectionY });
    };

    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.style.width = `${window.innerWidth}px`;
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    const animationId = setInterval(moveCircle, 30);
    
    return () => {
      clearInterval(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [position, direction, color]);

  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-screen h-screen overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh'
      }}
    >
      <div
        ref={circleRef}
        className={`w-16 h-16 ${color} rounded-full shadow-lg absolute transition-colors duration-300 flex items-center justify-center`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <span className="text-white font-bold text-xs">DVD</span>
      </div>
    </div>
  );
};

export default RedCircle;
