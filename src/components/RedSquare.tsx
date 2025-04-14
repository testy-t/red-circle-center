import { useEffect, useRef, useState } from "react";

const RedSquare = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState({ x: 1, y: 1 });
  const [color, setColor] = useState("bg-red-500");
  
  // Сохраняем последнее время для расчета анимации
  const lastTimeRef = useRef<number>(0);
  // Скорость движения (пикселей в секунду)
  const speedRef = useRef({ x: 150, y: 150 });

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
    if (!containerRef.current) return;
    
    // Начальные размеры контейнера
    containerRef.current.style.width = `${window.innerWidth}px`;
    containerRef.current.style.height = `${window.innerHeight}px`;
    
    let animationFrameId: number;
    
    const moveSquare = (timestamp: number) => {
      if (!containerRef.current || !squareRef.current) {
        animationFrameId = requestAnimationFrame(moveSquare);
        return;
      }

      // Вычисляем delta time для плавного движения независимо от частоты кадров
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 1000; // в секундах
      lastTimeRef.current = timestamp;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const squareWidth = squareRef.current.clientWidth;
      const squareHeight = squareRef.current.clientHeight;

      // Рассчитываем движение на основе deltaTime для стабильной скорости
      let newX = position.x + direction.x * speedRef.current.x * deltaTime;
      let newY = position.y + direction.y * speedRef.current.y * deltaTime;
      let newDirectionX = direction.x;
      let newDirectionY = direction.y;
      let colorChanged = false;

      // Проверка столкновения с границами
      if (newX + squareWidth > containerWidth) {
        newX = containerWidth - squareWidth;
        newDirectionX = -1;
        colorChanged = true;
      } else if (newX < 0) {
        newX = 0;
        newDirectionX = 1;
        colorChanged = true;
      }

      if (newY + squareHeight > containerHeight) {
        newY = containerHeight - squareHeight;
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
      
      animationFrameId = requestAnimationFrame(moveSquare);
    };

    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.style.width = `${window.innerWidth}px`;
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(moveSquare);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
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
        ref={squareRef}
        className={`w-24 h-24 ${color} shadow-lg absolute will-change-transform`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translateZ(0)', // Включаем аппаратное ускорение
        }}
      >
        <span className="text-white font-bold text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">DVD</span>
      </div>
    </div>
  );
};

export default RedSquare;