'use client';

import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';

interface NivoRadarChartProps {
  data: Array<any>;
  keys: string[];
  indexBy: string;
  title?: string;
  height?: number;
  colors?: string[];
  aiInsights?: {
    strongestArea: string;
    weakestArea: string;
    recommendation: string;
    balanceScore: number;
  };
}

export default function NivoRadarChart({
  data,
  keys,
  indexBy,
  title,
  height = 300,
  colors = ['#3B82F6', '#10B981', '#F59E0B'],
  aiInsights
}: NivoRadarChartProps) {
  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {aiInsights && (
            <div className="flex items-center space-x-2 mt-2">
              <div className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Balance Score: {aiInsights.balanceScore}/100
              </div>
            </div>
          )}
        </div>
      )}
      
      <div style={{ height: `${height}px` }}>
        <ResponsiveRadar
          data={data}
          keys={keys}
          indexBy={indexBy}
          maxValue="auto"
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
          borderColor={{ from: 'color' }}
          gridLabelOffset={36}
          dotSize={8}
          dotColor={{ theme: 'background' }}
          dotBorderWidth={2}
          colors={colors}
          blendMode="multiply"
          motionConfig="wobbly"
          legends={[
            {
              anchor: 'top-left',
              direction: 'column',
              translateX: -50,
              translateY: -40,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: '#6b7280',
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: '#e5e7eb',
                  strokeWidth: 1
                }
              },
              legend: {
                text: {
                  fontSize: 12,
                  fill: '#6b7280'
                }
              },
              ticks: {
                line: {
                  stroke: '#e5e7eb',
                  strokeWidth: 1
                },
                text: {
                  fontSize: 11,
                  fill: '#6b7280'
                }
              }
            },
            grid: {
              line: {
                stroke: '#f3f4f6',
                strokeWidth: 1
              }
            }
          }}
        />
      </div>
      
      {aiInsights && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">💪</span>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Strongest Area</p>
                <p className="text-sm text-green-800">{aiInsights.strongestArea}</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">📈</span>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-900">Growth Area</p>
                <p className="text-sm text-orange-800">{aiInsights.weakestArea}</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">AI Recommendation</p>
                <p className="text-sm text-blue-800">{aiInsights.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
