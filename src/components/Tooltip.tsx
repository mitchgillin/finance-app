"use client";

import React, { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
  content: string;
  title?: string;
  className?: string;
}

export default function Tooltip({ content, title, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let x = buttonRect.left + buttonRect.width / 2;
      let y = buttonRect.top;
      
      // Adjust horizontal position if tooltip would overflow
      if (x + tooltipRect.width / 2 > viewportWidth - 16) {
        x = viewportWidth - tooltipRect.width - 16;
      } else if (x - tooltipRect.width / 2 < 16) {
        x = tooltipRect.width / 2 + 16;
      }
      
      // Adjust vertical position if tooltip would overflow at top
      if (y - tooltipRect.height - 8 < 16) {
        y = buttonRect.bottom + 8;
      } else {
        y = y - tooltipRect.height - 8;
      }
      
      setPosition({ x, y });
    }
  }, [isVisible]);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`text-gray-400 hover:text-gray-600 transition-colors ${className}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl border border-gray-700 w-80 max-w-sm">
            {title && (
              <div className="font-semibold text-yellow-300 mb-2 text-sm">{title}</div>
            )}
            <div className="leading-relaxed text-gray-200">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}