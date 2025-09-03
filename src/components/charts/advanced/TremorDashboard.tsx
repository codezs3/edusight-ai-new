'use client';

import React from 'react';
import {
  Card,
  Title,
  Text,
  Metric,
  Flex,
  Badge,
  DonutChart,
  AreaChart,
  BarChart,
  ScatterChart,
  LineChart,
  Grid,
  Col
} from '@tremor/react';

interface TremorDashboardProps {
  data: {
    overview: Array<{
      title: string;
      value: string | number;
      change: number;
      changeType: 'positive' | 'negative' | 'neutral';
      data: Array<any>;
    }>;
    charts: Array<{
      type: 'area' | 'bar' | 'line' | 'donut' | 'scatter';
      title: string;
      data: Array<any>;
      categories?: string[];
      index?: string;
      colors?: string[];
      valueFormatter?: (value: number) => string;
    }>;
  };
  aiInsights?: Array<{
    type: 'insight' | 'recommendation' | 'alert';
    title: string;
    description: string;
    confidence: number;
  }>;
}

export default function TremorDashboard({ data, aiInsights }: TremorDashboardProps) {
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive': return 'emerald';
      case 'negative': return 'red';
      default: return 'gray';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive': return '↗';
      case 'negative': return '↘';
      default: return '→';
    }
  };

  const renderChart = (chart: any, index: number) => {
    const commonProps = {
      data: chart.data,
      index: chart.index || 'name',
      categories: chart.categories || ['value'],
      colors: chart.colors || ['blue'],
      valueFormatter: chart.valueFormatter || ((value: number) => value.toString()),
      className: 'h-72'
    };

    switch (chart.type) {
      case 'area':
        return <AreaChart {...commonProps} />;
      case 'bar':
        return <BarChart {...commonProps} />;
      case 'line':
        return <LineChart {...commonProps} />;
      case 'donut':
        return (
          <DonutChart
            data={chart.data}
            category="value"
            index="name"
            colors={chart.colors || ['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
            className="h-72"
            valueFormatter={chart.valueFormatter}
          />
        );
      case 'scatter':
        return <ScatterChart {...commonProps} />;
      default:
        return <AreaChart {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        {data.overview.map((item, index) => (
          <Col key={index}>
            <Card className="max-w-xs mx-auto" decoration="top" decorationColor={getChangeColor(item.changeType)}>
              <Text>{item.title}</Text>
              <Metric>{item.value}</Metric>
              <Flex justifyContent="start" className="space-x-2">
                <Badge color={getChangeColor(item.changeType)} size="xs">
                  {getChangeIcon(item.changeType)} {Math.abs(item.change)}%
                </Badge>
                <Text className="truncate">vs last period</Text>
              </Flex>
            </Card>
          </Col>
        ))}
      </Grid>

      {/* Charts Grid */}
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        {data.charts.map((chart, index) => (
          <Col key={index} numColSpan={chart.type === 'donut' ? 1 : 2}>
            <Card>
              <Title>{chart.title}</Title>
              {renderChart(chart, index)}
            </Card>
          </Col>
        ))}
      </Grid>

      {/* AI Insights */}
      {aiInsights && aiInsights.length > 0 && (
        <div className="space-y-4">
          <Title>AI-Powered Insights</Title>
          <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4">
            {aiInsights.map((insight, index) => (
              <Col key={index}>
                <Card 
                  className={`${
                    insight.type === 'alert' ? 'border-red-200 bg-red-50' :
                    insight.type === 'recommendation' ? 'border-blue-200 bg-blue-50' :
                    'border-green-200 bg-green-50'
                  }`}
                >
                  <Flex justifyContent="between" alignItems="start">
                    <div className="space-y-2">
                      <Text className="font-medium">{insight.title}</Text>
                      <Text className="text-sm">{insight.description}</Text>
                    </div>
                    <Badge 
                      color={
                        insight.type === 'alert' ? 'red' :
                        insight.type === 'recommendation' ? 'blue' : 'green'
                      }
                      size="xs"
                    >
                      {insight.confidence}% confidence
                    </Badge>
                  </Flex>
                </Card>
              </Col>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}
