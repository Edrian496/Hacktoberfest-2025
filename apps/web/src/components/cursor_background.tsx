// components/CursorLightBackground.tsx
"use client";

import React, { useEffect, useRef } from 'react';

const CursorLightBackground: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (backgroundRef.current) {
        requestAnimationFrame(() => {
          backgroundRef.current?.style.setProperty('--mouse-x', `${event.clientX}px`);
          backgroundRef.current?.style.setProperty('--mouse-y', `${event.clientY}px`);
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={backgroundRef} className="cursor-light-background fixed inset-0 z-0">
      <style jsx>{`
        .cursor-light-background {
          background-color: transparent;
          overflow: hidden;
        }

        .cursor-light-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(
              600px circle at var(--mouse-x) var(--mouse-y),
              rgba(var(--accent-rgb), 0.3),
              transparent 80%
            );
          filter: blur(80px);
          opacity: 0.75;
          pointer-events: none;
          transition: background 0.05s ease-out;
        }

        /* REMOVED: :root { --accent-rgb: 250, 204, 21; } from here */
      `}</style>
    </div>
  );
};

export default CursorLightBackground;