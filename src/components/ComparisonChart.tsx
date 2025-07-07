"use client";

import React, { useState } from "react";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { curveMonotoneX } from "@visx/curve";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";

export interface ScenarioSettings {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  earlyWithdrawal?: {
    year: number;
    amount: number;
  };
  contributionChanges?: {
    year: number;
    newAmount: number;
  }[];
}

export interface ComparisonScenario {
  id: string;
  name: string;
  color: string;
  settings: ScenarioSettings;
  data: Array<{
    year: number;
    totalValue: number;
    totalContributions: number;
    totalInterest: number;
  }>;
}

interface ComparisonChartProps {
  scenarios: ComparisonScenario[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  strokeWidthConfig?: {
    base: number;
    current: number;
    hovered: number;
    hoveredCurrent: number;
  };
  pointRadiusConfig?: {
    base: number;
    current: number;
    hovered: number;
    hoveredCurrent: number;
  };
}

const defaultMargin = { top: 20, right: 20, bottom: 40, left: 80 };
const defaultStrokeConfig = { base: 3, current: 4, hovered: 4, hoveredCurrent: 5 };
const defaultPointConfig = { base: 3, current: 4, hovered: 5, hoveredCurrent: 6 };

export default function ComparisonChart({
  scenarios,
  width,
  height,
  margin = defaultMargin,
  strokeWidthConfig = defaultStrokeConfig,
  pointRadiusConfig = defaultPointConfig,
}: ComparisonChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    scenario: string;
    year: number;
    value: number;
    x: number;
    y: number;
  } | null>(null);
  
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.bottom - margin.top;

  // Helper functions for dynamic sizing
  const getStrokeWidth = (scenario: ComparisonScenario) => {
    const isCurrent = scenario.id === "1";
    const isHovered = hoveredPoint?.scenario === scenario.name;
    
    if (isHovered && isCurrent) return strokeWidthConfig.hoveredCurrent;
    if (isHovered) return strokeWidthConfig.hovered;
    if (isCurrent) return strokeWidthConfig.current;
    return strokeWidthConfig.base;
  };

  const getPointRadius = (scenario: ComparisonScenario, point: { year: number; totalValue: number; totalContributions: number; totalInterest: number }) => {
    const isCurrent = scenario.id === "1";
    const isHovered = hoveredPoint?.scenario === scenario.name && hoveredPoint?.year === point.year;
    
    if (isHovered && isCurrent) return pointRadiusConfig.hoveredCurrent;
    if (isHovered) return pointRadiusConfig.hovered;
    if (isCurrent) return pointRadiusConfig.current;
    return pointRadiusConfig.base;
  };

  const getStrokeOpacity = (scenario: ComparisonScenario) => {
    return hoveredPoint?.scenario === scenario.name ? 1 : 0.9;
  };

  const getPointStrokeWidth = (scenario: ComparisonScenario, point: { year: number; totalValue: number; totalContributions: number; totalInterest: number }) => {
    const isHovered = hoveredPoint?.scenario === scenario.name && hoveredPoint?.year === point.year;
    return isHovered ? 2 : 1;
  };

  const getDashPattern = (scenario: ComparisonScenario, index: number) => {
    if (scenario.id === "1") return undefined; // Current scenario is always solid
    const patterns = [
      undefined, // Solid
      "5,5",     // Medium dash
      "3,3",     // Short dash
      "8,3,2,3", // Dash-dot
      "2,2",     // Dotted
    ];
    return patterns[index % patterns.length];
  };

  // Get all data points for scaling
  const allData = scenarios.flatMap((scenario) => scenario.data);

  if (allData.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 rounded-lg"
        style={{ width, height }}
      >
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  const maxYear = Math.max(...allData.map((d) => d.year));
  const maxValue = Math.max(...allData.map((d) => d.totalValue));

  // Scales
  const xScale = scaleLinear<number>({
    range: [0, innerWidth],
    domain: [0, maxYear],
  });

  const yScale = scaleLinear<number>({
    range: [innerHeight, 0],
    domain: [0, maxValue * 1.1], // Add 10% padding
  });

  // Accessors
  const getX = (d: {
    year: number;
    totalValue: number;
    totalContributions: number;
    totalInterest: number;
  }) => d.year;
  const getY = (d: {
    year: number;
    totalValue: number;
    totalContributions: number;
    totalInterest: number;
  }) => d.totalValue;

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1000000) {
      return `${sign}$${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${sign}$${(absValue / 1000).toFixed(0)}K`;
    }
    return `${sign}$${absValue.toFixed(0)}`;
  };

  const formatCurrencyDetailed = (value: number) => {
    const sign = value < 0 ? '-' : '';
    const absValue = Math.abs(value);
    return `${sign}$${new Intl.NumberFormat('en-US').format(absValue)}`;
  };

  return (
    <div className="relative w-full">
      <svg width={width} height={height} className="max-w-full h-auto">
        <Group left={margin.left} top={margin.top}>
          {/* Grid */}
          <GridRows
            scale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke="#e5e7eb"
            strokeWidth={1}
            strokeOpacity={0.5}
          />
          <GridColumns
            scale={xScale}
            width={innerWidth}
            height={innerHeight}
            stroke="#e5e7eb"
            strokeWidth={1}
            strokeOpacity={0.5}
          />

          {/* Axes */}
          <AxisLeft
            scale={yScale}
            tickFormat={formatCurrency}
            stroke="#6b7280"
            tickStroke="#6b7280"
            tickLabelProps={{
              fill: "#6b7280",
              fontSize: 12,
              textAnchor: "end",
              dx: -4,
              dy: 4,
            }}
          />
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickFormat={(value) => `Year ${value}`}
            stroke="#6b7280"
            tickStroke="#6b7280"
            tickLabelProps={{
              fill: "#6b7280",
              fontSize: 12,
              textAnchor: "middle",
              dy: 4,
            }}
          />

          {/* Lines */}
          {scenarios.map((scenario, index) => (
            <LinePath
              key={scenario.id}
              curve={curveMonotoneX}
              data={scenario.data}
              x={(d) => xScale(getX(d)) ?? 0}
              y={(d) => yScale(getY(d)) ?? 0}
              stroke={scenario.color}
              strokeWidth={getStrokeWidth(scenario)}
              strokeOpacity={getStrokeOpacity(scenario)}
              strokeDasharray={getDashPattern(scenario, index)}
            />
          ))}
          
          {/* Data points for better visibility */}
          {scenarios.map((scenario) =>
            scenario.data.map((point, pointIndex) => {
              const x = xScale(getX(point)) ?? 0;
              const y = yScale(getY(point)) ?? 0;
              
              return (
                <circle
                  key={`${scenario.id}-${pointIndex}`}
                  cx={x}
                  cy={y}
                  r={getPointRadius(scenario, point)}
                  fill={scenario.color}
                  stroke="white"
                  strokeWidth={getPointStrokeWidth(scenario, point)}
                  opacity={pointIndex === 0 || pointIndex === scenario.data.length - 1 ? 1 : 0.6}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPoint({
                    scenario: scenario.name,
                    year: point.year,
                    value: point.totalValue,
                    x: x,
                    y: y,
                  })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })
          )}
          
          {/* Hover tooltip */}
          {hoveredPoint && (() => {
            const tooltipWidth = 140;
            const tooltipHeight = 85;
            const padding = 10;
            
            // Smart positioning to avoid cutoff
            let tooltipX = hoveredPoint.x - tooltipWidth / 2;
            let tooltipY = hoveredPoint.y - tooltipHeight - 15; // Above the point by default
            
            // Adjust X position if too close to edges
            if (tooltipX < padding) {
              tooltipX = padding;
            } else if (tooltipX + tooltipWidth > innerWidth - padding) {
              tooltipX = innerWidth - tooltipWidth - padding;
            }
            
            // Adjust Y position if too close to top or bottom
            if (tooltipY < padding) {
              // If too close to top, show below the point
              tooltipY = hoveredPoint.y + 15;
            }
            if (tooltipY + tooltipHeight > innerHeight - padding) {
              // If too close to bottom, show above with more space
              tooltipY = innerHeight - tooltipHeight - padding;
            }
            
            return (
              <foreignObject
                x={tooltipX}
                y={tooltipY}
                width={tooltipWidth}
                height={tooltipHeight}
                style={{ pointerEvents: 'none' }}
              >
                <div className="bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl border border-gray-700 leading-relaxed">
                  <div className="font-semibold text-yellow-300 mb-1 truncate">{hoveredPoint.scenario}</div>
                  <div className="text-gray-300 mb-1">Year {hoveredPoint.year}</div>
                  <div className="text-green-400 font-semibold whitespace-nowrap">{formatCurrency(hoveredPoint.value)}</div>
                </div>
              </foreignObject>
            );
          })()}
        </Group>
      </svg>

      {/* Enhanced Legend */}
      <div className="mt-6 space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 text-center">
          Scenario Comparison
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scenarios.map((scenario, index) => {
            const finalValue = scenario.data[scenario.data.length - 1]?.totalValue || 0;
            const totalContributions = scenario.data[scenario.data.length - 1]?.totalContributions || 0;
            const totalInterest = finalValue - totalContributions;
            const expectedReturn = scenario.settings.annualRate;
            const isNegativeReturn = expectedReturn < 0;
            const isNegativeInterest = totalInterest < 0;
            
            return (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                style={{ borderLeftColor: scenario.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: scenario.color }}
                    />
                    {getDashPattern(scenario, index) && (
                      <div 
                        className="w-6 h-0.5 mt-1" 
                        style={{ 
                          background: getDashPattern(scenario, index) === "5,5" 
                            ? `repeating-linear-gradient(to right, ${scenario.color} 0, ${scenario.color} 3px, transparent 3px, transparent 6px)`
                            : getDashPattern(scenario, index) === "3,3"
                            ? `repeating-linear-gradient(to right, ${scenario.color} 0, ${scenario.color} 2px, transparent 2px, transparent 4px)`
                            : getDashPattern(scenario, index) === "2,2"
                            ? `repeating-linear-gradient(to right, ${scenario.color} 0, ${scenario.color} 1px, transparent 1px, transparent 2px)`
                            : `repeating-linear-gradient(to right, ${scenario.color} 0, ${scenario.color} 4px, transparent 4px, transparent 2px, ${scenario.color} 2px, ${scenario.color} 3px, transparent 3px, transparent 5px)`
                        }} 
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 text-sm truncate">
                      {scenario.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Return: <span className={isNegativeReturn ? "text-red-600 font-medium" : "text-gray-600"}>
                        {expectedReturn >= 0 ? '+' : ''}{expectedReturn.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Final: {formatCurrencyDetailed(finalValue)}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-sm font-semibold ${isNegativeInterest ? 'text-red-600' : 'text-green-600'}`}>
                    {isNegativeInterest ? '' : '+'}{formatCurrency(totalInterest)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isNegativeInterest ? 'loss' : 'interest'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
