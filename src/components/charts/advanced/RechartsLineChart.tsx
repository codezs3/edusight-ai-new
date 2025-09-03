'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  Brush
} from 'recharts';

interface RechartsLineChartProps {
  data: Array<any>;
  lines: Array<{
    dataKey: string;
    stroke: string;
    name: string;
    strokeWidth?: number;
    dot?: boolean;
    activeDot?: boolean;
  }>;
  title?: string;
  height?: number;
  showGrid?: boolean;
  showBrush?: boolean;
  showArea?: boolean;
  predictiveData?: Array<any>;
  targetLine?: {
    value: number;
    label: string;
    color: string;
  };
  aiInsights?: {
    trend: 'up' | 'down' | 'stable';
    prediction: string;
    confidence: number;
  };
}

export default function RechartsLineChart({
  data,
  lines,
  title,
  height = 300,
  showGrid = true,
  showBrush = false,
  showArea = false,
  predictiveData = [],
  targetLine,
  aiInsights
}: RechartsLineChartProps) {
  const combinedData = [...data, ...predictiveData];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
            </p>
          ))}
          {predictiveData.some(d => d.name === label) && (
            <p className="text-xs text-blue-600 italic">Predicted</p>
          )}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {aiInsights && (
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                aiInsights.trend === 'up' ? 'bg-green-100 text-green-800' :
                aiInsights.trend === 'down' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {aiInsights.trend.toUpperCase()} TREND
              </div>
              <span className="text-xs text-gray-500">
                {aiInsights.confidence}% confidence
              </span>
            </div>
          )}
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', color: '#6b7280' }}
          />
          
          {targetLine && (
            <ReferenceLine 
              y={targetLine.value} 
              stroke={targetLine.color} 
              strokeDasharray="5 5"
              label={{ value: targetLine.label, position: 'left' }}
            />
          )}
          
          {lines.map((line, index) => {
            if (showArea) {
              return (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  fill={`${line.stroke}20`}
                  strokeWidth={line.strokeWidth || 2}
                  name={line.name}
                />
              );
            } else {
              return (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth || 2}
                  dot={line.dot !== false}
                  activeDot={line.activeDot !== false ? { r: 4, stroke: line.stroke, strokeWidth: 2 } : false}
                  name={line.name}
                />
              );
            }
          })}
          
          {showBrush && <Brush dataKey="name" height={30} stroke="#8884d8" />}
        </ChartComponent>
      </ResponsiveContainer>
      
      {aiInsights && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">AI Prediction</p>
              <p className="text-sm text-blue-800">{aiInsights.prediction}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
